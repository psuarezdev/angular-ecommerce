import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ``,
  imports: [ReactiveFormsModule, JsonPipe],
})
export class AuthComponent {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  isLoginMode = signal(true);

  form = this.#fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  async onSubmit() {
    if(this.isLoginMode()) {
      if(this.form.controls.email.errors || this.form.controls.password.errors) {
        this.form.markAllAsTouched();
        return;
      }

      const { email, password } = this.form.value;

      const token = await this.#authService.signIn(email!, password!);

      if(!token) return;
      
      localStorage.setItem('token', token);
      this.#router.navigateByUrl('/home');
    } else {
      if(this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }

      const { firstName, lastName, email, password, address } = this.form.value;

      const signedUp = await this.#authService.signUp(
        firstName!, lastName!, email!, password!, address!
      );

      if(signedUp) this.toggleAuthMode();
    }
  }

  onConfirmPasswordChange() {
    if(this.form.controls.password.value !== this.form.controls.confirmPassword.value) {
      this.form.controls.confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      this.form.controls.confirmPassword.setErrors(null);
    }
  }

  fieldHasError(
    fieldName: 'firstName' | 'lastName' | 'email' | 'address' | 'password' | 'confirmPassword',
    errorType: 'required' | 'minlength' | 'email' | 'passwordMismatch',
  ) {
    return this.form.controls[fieldName].errors?.[errorType] && this.form.controls[fieldName].touched;
  }

  toggleAuthMode() {
    this.isLoginMode.update(prev => !prev);
  }
}
