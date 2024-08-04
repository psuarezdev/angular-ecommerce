export interface Product {
  _id: string;
  category: string;
  brand: string;
  name: string;
  price: number;
  stock: number;
  specifications: string[];
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}
