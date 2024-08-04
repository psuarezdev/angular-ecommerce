import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { PaymentService } from '../../../services/payment.service';
import { Cart } from '../../../interfaces/cart.interface';
import { StripeLineItem } from '../../../interfaces/stripe-line-item.dto';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: ``,
  imports: [RouterModule, CurrencyPipe],
})
export class CartComponent implements OnInit {
  readonly #router = inject(Router);
  readonly #cartService = inject(CartService);
  readonly #PaymentService = inject(PaymentService);

  readonly previousShippingCost = 3.99;
  readonly actualShippingCost = 0.00;

  isLoading = signal(true);
  isLoadingCheckout = signal(false);
  cart = signal<Cart | null>(null);

  ngOnInit(): void {
    this.#cartService.getCart()
      .then(cart => {
        if(!cart) {
          this.#router.navigateByUrl('/home');
          return;
        }
        this.cart.set(cart);
      })
      .catch(() => this.#router.navigateByUrl('/home'))
      .finally(() => this.isLoading.set(false));
  }

  get cartTotal() {
    if(!this.cart()) return 0;
    return this.cart()!.products
      .reduce((acc, { product, quantity }) => acc + (product.price * quantity), 0);
  }

  async decreaseByOne(id: string) {
    try {
     const cartUpdated = await this.#cartService.decreaseByOne(id);
      if(!cartUpdated) return;
      
      this.cart.set(cartUpdated);
    } catch (error) {
      console.error('Error decreasing item quantity', error);
    }
  }
  
  async increaseByOne(id: string) {
    try {
      const cartUpdated = await this.#cartService.increaseByOne(id);
       if(!cartUpdated) return;
       
       this.cart.set(cartUpdated);
     } catch (error) {
       console.error('Error decreasing item quantity', error);
     }
  }

  async removeFromCart(id: string) {
    try {
      const cartUpdated = await this.#cartService.removeFromCart(id);
      if(!cartUpdated) return;
      
      this.cart.set(cartUpdated);
    } catch (error) {
      console.error('Error removing item from cart', error);
    }
  }

  async clearCart() {
    try {
      const cartUpdated = await this.#cartService.clearCart();
      if(!cartUpdated) return;
      
      this.cart.set(cartUpdated);
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  }

  async onCheckout() {
    if(!this.cart() || this.cart()!.products?.length === 0) return;
    const stripeLineItems: StripeLineItem[] = this.cart()!.products
      .map(({ product, quantity }) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: product.images ?? []
          },
          unit_amount: product.price * 100
        },
        quantity
      }));

    this.isLoadingCheckout.set(true);

    try {
      const paymentSession = await this.#PaymentService.createPaymentSession(stripeLineItems);

      if(!paymentSession) return;

      window.location.href = paymentSession.url;
    } catch (error) {
      console.error('Error checking out', error);
    } finally {
      this.isLoadingCheckout.set(false);
    }
  }
}
