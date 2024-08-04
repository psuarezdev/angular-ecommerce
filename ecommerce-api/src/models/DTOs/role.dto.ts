import { Types } from 'mongoose';

export interface RoleDTO {
  _id: Types.ObjectId;
  name: string;
  updatedAt?: NativeDate;
  createdAt?: NativeDate;
}
