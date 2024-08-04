import express from 'express';
import cors from 'cors';
import { PORT } from './config';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import cartRoutes from './routes/cart.routes';
import paymentRoutes from './routes/payment.routes';
import orderRoutes from './routes/order.routes';
import './database';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json({
  verify: (req, _, buf) => {
    //* This is needed to get the raw body of the request becase the stripe webhook needs it, and we are using express.json() middleware
    (req as any).rawBody = buf;
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => console.log('Server is running on port:', PORT));
