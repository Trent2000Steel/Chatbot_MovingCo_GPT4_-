import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export const config = {
  api: {
    bodyParser: false, // Required for raw Stripe body
  },
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  let event;

  try {
    const rawBody = await buffer(req);
    const signature = req.headers['stripe-signature'];

    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error('❌ Stripe webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle the successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('✅ Payment received for:', session.customer_email);
    // TODO: Add backend logic here (save to DB, send confirmation, etc.)
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
