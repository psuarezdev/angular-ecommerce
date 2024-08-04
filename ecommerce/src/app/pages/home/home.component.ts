import { Component } from '@angular/core';

import { ProductsListComponent } from '../../shared/products-list/products-list.component';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: ``,
  imports: [ProductsListComponent],
})
export class HomeComponent {}
