import { Request, Response } from 'express';
import Stripe from 'stripe';
import { STRIPE_SECRET, STRIPE_WEBHOOK_SECRET, CLIENT_URL } from '../config';
import { JwtService } from '../lib/jwt';
import { User } from '../models/user.model';
import { Cart } from '../models/cart.model';
import { Order } from '../models/order.model';

const stripe = new Stripe(`${STRIPE_SECRET!}`);

//* I decided to define this function here because it's just going to be used in this file and it's not a method of the controller
async function createOrder(userId: string, total: number) {
  try {
    const user = await User.findById(userId).select('-password');

    if (!user) return;

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) return;

    const products = cart.products.map(p => ({
      product: p._id!,
      quantity: p.quantity
    }));

    const order = await Order.create({
      user: user._id,
      products,
      total: total / 100,
      status: 'pending',
      address: user.address
    });

    if (!order) return;

    await Cart.findByIdAndUpdate(cart._id, { products: [] });
  } catch (error) {
    console.error('Error creating order after payment', error);
  }
}

export class PaymentController {
  static async createSession(req: Request, res: Response) {
    const body = req.body as Stripe.Checkout.SessionCreateParams.LineItem[];
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!body || body.length === 0) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    try {
      const session = await stripe.checkout.sessions.create({
        line_items: body,
        mode: 'payment',
        metadata: { userId: authUser._id.toString() }, //* This will be used to identify the user when the payment is completed, to get his cart and create an order
        success_url: `${CLIENT_URL!}/home/orders`,
        cancel_url: `${CLIENT_URL!}/home/cart`
      });

      if (!session) {
        return res.status(500).json({ message: 'Error creating payment session' });
      }

      return res.status(201).json(session);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating payment session' });
    }
  }

  static async webhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).json({ message: 'Webhook error' });
    }

    try {
      const event = stripe.webhooks.constructEvent((req as any).rawBody, sig, STRIPE_WEBHOOK_SECRET!);

      if (!event) {
        return res.status(400).json({ message: 'Webhook error' });
      }

      if (event.type === 'checkout.session.completed') {
        const {
          metadata,
          amount_total: amountTotal
        } = event.data.object;

        if (metadata?.userId && amountTotal) {
          await createOrder(metadata.userId, amountTotal);
        }
      }

      return res.status(200).json({ message: 'Webhook received' });
    } catch (error) {
      return res.status(400).json({ message: 'Webhook error' });
    }
  }
}
