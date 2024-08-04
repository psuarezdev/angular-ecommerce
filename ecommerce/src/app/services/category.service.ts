import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  readonly #http = inject(HttpClient);

  async getCategories() {
    try {
      return await firstValueFrom(this.#http.get<Category[]>(`${environment.apiUrl}/categories`));
    } catch (error) {
      return [];
    }
  }
}
