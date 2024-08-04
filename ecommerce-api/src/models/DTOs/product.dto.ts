import { Types } from 'mongoose';

export interface ProductDTO {
  _id: Types.ObjectId;
  category: Types.ObjectId;
  favoriteProducts: Types.ObjectId[];
  name: string;
  price: number;
  stock: number;
  specifications: string[];
  images: string[];
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
}
