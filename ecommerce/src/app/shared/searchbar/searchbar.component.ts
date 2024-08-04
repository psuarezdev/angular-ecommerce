import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styles: `
    form {
      width: 600px;
    }

    @media (max-width: 1127px) {
      form { width: 400px; }
    }

    @media (max-width: 660px) {
      form { display: none; }
    }
  `,
  imports: [ReactiveFormsModule],
})
export class SearchbarComponent {
  readonly #router = inject(Router);
  readonly #fb = inject(FormBuilder);

  form = this.#fb.group({ search: ['', Validators.required] });

  onSubmit() {
    if (this.form.invalid) return;
    this.#router.navigateByUrl(`/home/search/${this.form.value.search}`);
  }
}
