import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly #http = inject(HttpClient);

  readonly #httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  async getCart() {
    try {
      const cart = await firstValueFrom(this.#http.get<Cart>(`${environment.apiUrl}/cart`));

      if(!cart) return null;
      
      return cart;
    } catch (error) {
      return null;
    }
  }

  async increaseByOne(id: string) {
    try {
      const cartUpdated = await firstValueFrom(this.#http.post<Cart>(
        `${environment.apiUrl}/cart`, 
        { productId: id, quantity: 1 },
        this.#httpOptions
      ));

      if(!cartUpdated) return null;

      return await this.getCart();
    } catch (error) {
      return null;
    }
  }

  async decreaseByOne(id: string) {
    try {
      const cartUpdated = await firstValueFrom(this.#http.delete<Cart>(`${environment.apiUrl}/cart/decrease/${id}`));

      if(!cartUpdated) return null;

      return await this.getCart();
    } catch (error) {
      return null;
    }
  }

  async removeFromCart(id: string) {
    try {
      const cartUpdated = await firstValueFrom(this.#http.delete<Cart>(`${environment.apiUrl}/cart/remove/${id}`));

      if(!cartUpdated) return null;

      return await this.getCart();
    } catch (error) {
      return null;
    }
  }

  async clearCart() {
    try {
      const cartUpdated = await firstValueFrom(this.#http.delete<Cart>(`${environment.apiUrl}/cart/clear`));

      if(!cartUpdated) return null;

      return await this.getCart();
    } catch (error) {
      return null;
    }
  }
}
