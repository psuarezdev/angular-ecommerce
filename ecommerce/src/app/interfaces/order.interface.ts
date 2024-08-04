import { Product } from "./product.interface";

export interface ProductOrder {
  product: Product;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  products: ProductOrder[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
