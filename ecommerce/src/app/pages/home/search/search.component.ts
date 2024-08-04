import { Component, inject, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../interfaces/product.interface';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Subscription } from 'rxjs';
import { ProductsListComponent } from '../../../shared/products-list/products-list.component';

@Component({
  standalone: true,
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: ``,
  imports: [HeaderComponent, ProductsListComponent],
})
export class SearchComponent implements OnInit, OnDestroy {
  readonly #route = inject(ActivatedRoute);

  #paramsSub$?: Subscription;

  searchQuery = signal('');

  ngOnInit(): void {
    this.#paramsSub$ = this.#route.params
      .subscribe(params => this.searchQuery.set(params['query']));
  }

  ngOnDestroy(): void {
    this.#paramsSub$?.unsubscribe();
  }
}
