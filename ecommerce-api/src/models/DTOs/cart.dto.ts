import { Types } from 'mongoose';
import { ProductOrder } from './order.dto';

export interface CartDTO {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  products: ProductOrder[];
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}
