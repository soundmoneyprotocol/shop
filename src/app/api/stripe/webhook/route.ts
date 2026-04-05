import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Payment successful:', session.id);

        // Create buyer account after successful payment
        if (session.customer_email) {
          try {
            const { data: existingBuyer } = await supabase
              .from('buyers')
              .select('id')
              .eq('email', session.customer_email)
              .single();

            // Only create if buyer doesn't exist
            if (!existingBuyer) {
              const { data: newBuyer, error } = await supabase
                .from('buyers')
                .insert({
                  email: session.customer_email,
                  stripe_customer_id: session.customer as string,
                  created_at: new Date().toISOString(),
                  first_purchase: true,
                })
                .select()
                .single();

              if (error) {
                console.error('Error creating buyer:', error);
              } else {
                console.log('✅ New buyer created:', newBuyer?.id);
              }
            } else {
              // Update existing buyer with Stripe customer ID if missing
              await supabase
                .from('buyers')
                .update({
                  stripe_customer_id: session.customer as string,
                })
                .eq('email', session.customer_email);
            }
          } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
          }
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', failedIntent.id);
        break;

      case 'charge.refunded':
        const refund = event.data.object as Stripe.Charge;
        console.log('💰 Refund processed:', refund.id);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
};
