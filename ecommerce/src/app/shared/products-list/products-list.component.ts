import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';

import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Category } from '../../interfaces/category.interface';
import { CategoryService } from '../../services/category.service';

@Component({
  standalone: true,
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  imports: [CommonModule, AsyncPipe, ProductCardComponent],
})
export class ProductsListComponent implements OnInit, OnChanges {
  readonly #productService = inject(ProductService); 
  readonly #categoryService = inject(CategoryService);

  @Input() showCategories = true;
  @Input() searchQuery?: string;

  #page = 1;

  selectedCategory = signal<string | undefined>(undefined);
  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.#categoryService.getCategories()
      .then(categories => this.categories.set(categories))
      .catch(() => this.categories.set([]));

    this.getProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['searchQuery']) this.getProducts();
  }

  async selectCategory(categoryId: string) {
    this.#page = 1;

    try {
      if(this.selectedCategory() === categoryId) {
        this.selectedCategory.set(undefined);
      } else {
        this.selectedCategory.set(categoryId);
      }

      await this.getProducts();
    } catch (error) {
      console.error('Error selecting category', error);
    }
  }

  async getProducts() {
    this.isLoading.set(true);
    try {
      const products = await this.#productService.getProducts(
        this.#page,
        this.selectedCategory(),
        this.searchQuery
      );
      this.products.set(products);
    } catch {
      this.products.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadMore() {
    this.#page++;

    try {
      const products = await this.#productService.getProducts(
        this.#page,
        this.selectedCategory(),
        this.searchQuery
      );

      if(products.length > 0) {
        this.products.set([...this.products(), ...products]);
      } else {
        this.#page--;
      }
    } catch (error) {
      console.error('Error isLoading more products', error);
    }
  }
}
