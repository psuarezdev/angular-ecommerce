import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  specifications: [{ type: String }],
  images: [{ type: String }]
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
