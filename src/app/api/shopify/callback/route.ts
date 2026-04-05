/**
 * Shopify OAuth Callback Handler
 * Receives authorization code from Shopify and exchanges it for access token
 */

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const shop = searchParams.get('shop');
    const state = searchParams.get('state');
    const hmac = searchParams.get('hmac');

    // Validate required parameters
    if (!code || !shop || !state) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: code, shop, or state'
        },
        { status: 400 }
      );
    }

    // Call backend to exchange code for access token
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const callbackUrl = new URL('/shopify/callback', backendUrl);
    callbackUrl.searchParams.set('code', code);
    callbackUrl.searchParams.set('shop', shop);
    callbackUrl.searchParams.set('state', state);
    if (hmac) callbackUrl.searchParams.set('hmac', hmac);

    const response = await fetch(callbackUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to authorize with Shopify'
        },
        { status: response.status || 400 }
      );
    }

    // Success! Redirect to connect-shopify page with success message
    // The access token should be stored by the user via POST /api/shopify/connect
    const redirectUrl = new URL('/seller/connect-shopify', request.url);
    redirectUrl.searchParams.set('shop', shop);
    redirectUrl.searchParams.set('authorized', 'true');

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('OAuth callback error:', error);

    // Redirect back to connection page with error
    const errorUrl = new URL('/seller/connect-shopify', request.url);
    errorUrl.searchParams.set('error', 'OAuth authorization failed');

    return NextResponse.redirect(errorUrl.toString());
  }
}
