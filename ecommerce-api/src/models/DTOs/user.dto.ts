import { Types } from 'mongoose';

export interface UserDTO {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  updatedAt?: NativeDate;
  createdAt?: NativeDate;
}
