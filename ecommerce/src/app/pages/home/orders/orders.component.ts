import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../interfaces/order.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: ``,
  imports: [RouterModule, CommonModule, CurrencyPipe],
})
export class OrdersComponent implements OnInit {
  readonly #orderService = inject(OrderService);
  
  isLoading = signal(true);
  orders = signal<Order[]>([]);

  ngOnInit(): void {
    this.#orderService.getOrders()
      .then(orders => this.orders.set(orders))
      .catch(() => this.orders.set([]))
      .finally(async() => {
        this.isLoading.set(false);
        //* Wait for the component to be rendered before initializing Flowbite
        await new Promise(resolve => setTimeout(resolve, 100));
        initFlowbite();
    });
  }
}
