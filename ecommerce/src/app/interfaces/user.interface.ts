import { Product } from "./product.interface";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  favoriteProducts: Product[];
  role?: {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}
