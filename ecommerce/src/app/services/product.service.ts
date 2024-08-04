import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly #http = inject(HttpClient);

  async getProducts(page?: number, categoryId?: string, searchQuery?: string) {
    let query = `?page=${page ?? 1}&limit=20`;

    if(categoryId) {
      query += `&category=${categoryId}`;
    }

    if(searchQuery) {
      query += `&search=${searchQuery}`;
    }

    try {
      return await firstValueFrom(this.#http.get<Product[]>(`${environment.apiUrl}/products${query}`));
    } catch (error) {
      return [];
    }
  }

  async getProductById(id: string) {
    try {
      return await firstValueFrom(this.#http.get<Product>(`${environment.apiUrl}/products/${id}`));
    } catch (error) {
      return null;
    }
  }

  async searchProducts(query: string) {
    try {
      return await firstValueFrom(this.#http.get<Product[]>(`${environment.apiUrl}/products?q=${query}`));
    } catch (error) {
      return null;
    }
  }

  async toggleFavorite(productId: string) {
    try {
      await firstValueFrom(this.#http.patch(`${environment.apiUrl}/products/${productId}/favorite`, {}));
      return true;
    } catch (error) {
      return false;
    }
  }
}
