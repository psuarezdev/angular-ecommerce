import { ProductOrder } from './order.interface';

export interface Cart {
  _id: string;
  user: string;
  products: ProductOrder[];
  createdAt: Date;
  updatedAt: Date;
}
