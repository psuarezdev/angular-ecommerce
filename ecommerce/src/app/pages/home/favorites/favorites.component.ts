import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../interfaces/user.interface';
import { HeaderComponent } from '../../../shared/header/header.component';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';

@Component({
  standalone: true,
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styles: ``,
  imports: [HeaderComponent, ProductCardComponent],
})
export class FavoritesComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  isLoading = signal(true);
  user = signal<User | null>(null);

  ngOnInit(): void {
    this.#authService.getProfile()
      .then(profile => {
        if(!profile) {
          this.#router.navigateByUrl('/auth');
          return;
        }

        this.user.set(profile);
      })
      .catch(() => this.#router.navigateByUrl('/home'))
      .finally(() => this.isLoading.set(false));
  }
}
