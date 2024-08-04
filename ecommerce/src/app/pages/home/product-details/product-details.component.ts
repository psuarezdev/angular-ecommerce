import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../interfaces/product.interface';
import { HeaderComponent } from '../../../shared/header/header.component';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../interfaces/user.interface';
import { CartService } from '../../../services/cart.service';

@Component({
  standalone: true,
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styles: ``,
  imports: [CurrencyPipe, HeaderComponent],
})
export class ProductDetailsComponent implements OnInit {
  readonly #route = inject(ActivatedRoute);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #productService = inject(ProductService);
  readonly #cartService = inject(CartService);

  profile = signal<User | null>(null);
  isFavorite = signal(false);
  currentImage = signal(0);
  product = signal<Product | null>(null);
  isLoading = signal(true);

  ngOnInit(): void {
    const productId = this.#route.snapshot.params['id'];

    this.#productService.getProductById(productId)
      .then(async(product) => {
        const profile = await this.#authService.getProfile();

        if(!product) {
          this.#router.navigateByUrl('/home');
          return;
        }

        this.product.set(product);

        if(profile) {
          const isFavorite = profile.favoriteProducts.some(({ _id }) => _id === product._id);
          this.profile.set(profile);
          this.isFavorite.set(isFavorite);
        } 
      })
      .catch(() => this.#router.navigateByUrl('/home'))
      .finally(() => this.isLoading.set(false));
  }

  selectImage(index: number): void {
    this.currentImage.set(index);
  }

  async toggleFavorite(productId: string) {
    if (!this.profile()) {
      this.#router.navigateByUrl('/auth');
      return;
    }
    
    const favorited = await this.#productService.toggleFavorite(productId);
    if(!favorited)  return;
    this.isFavorite.update(favorite => !favorite);
  }

  async onAddToCart(product: Product) {
    try {
      if (!this.profile()) {
        this.#router.navigateByUrl('/auth');
        return;
      }

      await this.#cartService.increaseByOne(product._id);
    } catch (error) {
      console.error('Error adding item to cart', error);
    }
  }
}
