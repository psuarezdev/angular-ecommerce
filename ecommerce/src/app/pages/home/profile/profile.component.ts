import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user.interface';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: ``,
  imports: [ReactiveFormsModule, HeaderComponent],
})
export class ProfileComponent implements OnInit {
  readonly #fb = inject(FormBuilder);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  isLoading = signal(true);
  user = signal<User | null>(null);

  form = this.#fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.#authService.getProfile()
      .then(user => {
        if(!user) {
          this.#router.navigateByUrl('/auth');
          return;
        }

        this.user.set(user);

        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          address: user.address,
        });
      })
      .catch(() => this.#router.navigateByUrl('/home'))
      .finally(() => this.isLoading.set(false));
  }

  fieldHasError(
    fieldName: 'firstName' | 'lastName' | 'email' | 'address',
    errorType: 'required' | 'minlength' | 'email'
  ) {
    return this.form.controls[fieldName].errors?.[errorType] && this.form.controls[fieldName].touched;
  }

  async onSubmit() {
    if(!this.user()) return;

    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, address } = this.form.value;

    try {
      const updatedUsesr = await this.#authService.updateProfile(
        this.user()!._id, firstName!, lastName!, email!, address!
      );

      if(!updatedUsesr) return;

      this.user.set(updatedUsesr.user);
      this.form.patchValue({
        firstName: updatedUsesr.user.firstName,
        lastName: updatedUsesr.user.lastName,
        email: updatedUsesr.user.email,
        address: updatedUsesr.user.address
      });
      
      this.form.markAsPristine();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
