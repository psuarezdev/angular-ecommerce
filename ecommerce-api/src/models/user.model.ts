import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
