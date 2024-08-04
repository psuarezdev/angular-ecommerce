import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { StripeLineItem } from '../interfaces/stripe-line-item.dto';
import { PaymentResponse } from '../interfaces/payment-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  readonly #http = inject(HttpClient);

  readonly #httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  async createPaymentSession(products: StripeLineItem[]) {
    try {
      const session = await firstValueFrom(this.#http.post<PaymentResponse>(
        `${environment.apiUrl}/payment/create-session`,
        products,
        this.#httpOptions
      ));

      if(!session) return null;

      return session;
    } catch (error) {
      return null;
    }
  }
}
