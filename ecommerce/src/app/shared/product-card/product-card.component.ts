import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../interfaces/product.interface';

@Component({
  standalone: true,
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styles: ``,
  imports: [RouterModule, CurrencyPipe],
})
export class ProductCardComponent {
  @Input() product!: Product;
}
