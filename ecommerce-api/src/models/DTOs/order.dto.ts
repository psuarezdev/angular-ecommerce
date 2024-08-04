import { Types } from 'mongoose';

export interface ProductOrder {
  product: Types.ObjectId;
  quantity: number;
}

export interface OrderDTO {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: ProductOrder[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}
