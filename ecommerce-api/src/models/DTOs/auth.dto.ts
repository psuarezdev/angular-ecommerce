import { Types } from 'mongoose';

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  role?: Types.ObjectId;
}

export interface LoginDTO {
  email: string;
  password: string;
}
