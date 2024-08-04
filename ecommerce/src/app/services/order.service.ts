import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Order } from '../interfaces/order.interface';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  readonly #http = inject(HttpClient);

  readonly #httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  async getOrders() {
    try {
      return await firstValueFrom(this.#http.get<Order[]>(`${environment.apiUrl}/orders`));
    } catch (error) {
      return [];
    }
  }
}
