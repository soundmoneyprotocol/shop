/**
 * Marketplace Prices API
 * GET /api/marketplace/prices?sku=AIR-JORDAN-1&marketplace=GOAT&timeframe=7d
 */

import { supabase } from '@/lib/supabase-server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get('sku');
    const marketplace = searchParams.get('marketplace');
    const timeframe = searchParams.get('timeframe') || '7d';

    if (!sku) {
      return Response.json(
        { success: false, error: 'SKU is required' },
        { status: 400 }
      );
    }

    // Try to fetch from Supabase
    try {
      const days = parseInt(timeframe) || 7;
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      // Fetch sneaker
      const { data: sneakerData, error: sneakerError } = await supabase
        .from('products')
        .select('*')
        .ilike('sku', `%${sku}%`)
        .single();

      if (sneakerError || !sneakerData) {
        // Fall back to mock data
        return Response.json({
          success: true,
          data: generateMockPriceHistory(sku, marketplace, timeframe),
        });
      }

      // Fetch price history
      let query = supabase
        .from('price_history')
        .select('*')
        .eq('product_id', sneakerData.id)
        .gte('created_at', startDate.toISOString());

      if (marketplace) {
        query = query.eq('marketplace', marketplace.toUpperCase());
      }

      const { data: priceData, error: priceError } = await query.order('created_at', { ascending: true });

      if (priceError || !priceData || priceData.length === 0) {
        // Fall back to mock data
        return Response.json({
          success: true,
          data: generateMockPriceHistory(sku, marketplace, timeframe),
        });
      }

      // Process real data
      const summary: Record<string, any> = {};
      const marketplaces = [...new Set(priceData.map(p => p.marketplace))];

      for (const mkt of marketplaces) {
        const mktPrices = priceData
          .filter(p => p.marketplace === mkt)
          .map(p => p.lowest_ask)
          .filter((p): p is number => p !== null);

        if (mktPrices.length === 0) continue;

        const avgPrice = mktPrices.reduce((a, b) => a + b, 0) / mktPrices.length;
        const volatility = Math.sqrt(
          mktPrices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / mktPrices.length
        );

        summary[mkt] = {
          avgAsk: Math.round(avgPrice * 100) / 100,
          avgBid: Math.round((avgPrice * 0.92) * 100) / 100,
          avgSalePrice: Math.round((avgPrice * 0.90) * 100) / 100,
          minAsk: Math.min(...mktPrices),
          maxAsk: Math.max(...mktPrices),
          volatility: Math.round(volatility * 100) / 100,
          supplyTrend: 0,
          supplyDirection: 'stable' as const,
          demandTrend: 0,
          demandDirection: 'stable' as const,
          dataPoints: mktPrices.length,
          totalSupply: 0,
          totalDemand: 0,
          priceRange: `$${Math.min(...mktPrices).toFixed(2)} - $${Math.max(...mktPrices).toFixed(2)}`,
        };
      }

      return Response.json({
        success: true,
        data: {
          sku: sneakerData.sku,
          name: sneakerData.name,
          brand: sneakerData.brand,
          imageUrl: sneakerData.image_url,
          timeframe,
          prices: priceData,
          summary,
          sentiment: {
            buyerSentiment: 65,
            sellerSentiment: 58,
            marketMomentum: 'neutral',
            priceDirection: 2.5,
            volumeTrend: 'stable',
          },
        },
      });
    } catch (dbError) {
      console.log('Supabase query failed, using mock data:', dbError);
      return Response.json({
        success: true,
        data: generateMockPriceHistory(sku, marketplace, timeframe),
      });
    }
  } catch (error) {
    console.error('Error fetching price data:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
}

function generateMockPriceHistory(sku: string, marketplace: string | null, timeframe: string) {
  const days = parseInt(timeframe) || 7;
  const now = new Date();

  const marketplaces = ['GOAT', 'STOCKX', 'GRAILED', 'EBAY', 'KLEKT', 'STADIUMGOODS'];
  const marketsToInclude = marketplace
    ? [marketplace.toUpperCase()]
    : marketplaces;

  const prices: any[] = [];

  // Generate daily price data
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

    for (const mkt of marketsToInclude) {
      const basePrice = 15000 + Math.random() * 10000;
      const volatility = Math.sin(i / days * Math.PI) * 0.1;

      prices.push({
        marketplace: mkt,
        lowestAsk: Math.round((basePrice + volatility * basePrice) * (0.95 + Math.random() * 0.1)),
        highestBid: Math.round((basePrice + volatility * basePrice) * (0.85 + Math.random() * 0.1)),
        lastSalePrice: Math.round((basePrice + volatility * basePrice) * (0.9 + Math.random() * 0.08)),
        supply: Math.floor(10 + Math.random() * 100),
        demand: Math.floor(5 + Math.random() * 80),
        created_at: date.toISOString(),
        condition: Math.random() > 0.5 ? 'Like New' : 'Excellent',
        size: ['8', '9', '10', '11', '12'][Math.floor(Math.random() * 5)],
      });
    }
  }

  const summary: Record<string, any> = {};

  for (const mkt of marketsToInclude) {
    const mktPrices = prices
      .filter(p => p.marketplace === mkt)
      .map(p => p.lowestAsk)
      .filter((p): p is number => p !== null);

    if (mktPrices.length === 0) continue;

    const avgPrice = mktPrices.reduce((a, b) => a + b, 0) / mktPrices.length;
    const volatility = Math.sqrt(
      mktPrices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / mktPrices.length
    );

    summary[mkt] = {
      avgAsk: Math.round(avgPrice * 100) / 100,
      avgBid: Math.round((avgPrice * 0.92) * 100) / 100,
      avgSalePrice: Math.round((avgPrice * 0.90) * 100) / 100,
      minAsk: Math.min(...mktPrices),
      maxAsk: Math.max(...mktPrices),
      volatility: Math.round(volatility * 100) / 100,
      supplyTrend: Math.round((Math.random() * 20 - 10) * 10) / 10,
      supplyDirection: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      demandTrend: Math.round((Math.random() * 30 - 5) * 10) / 10,
      demandDirection: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      dataPoints: mktPrices.length,
      totalSupply: Math.floor(200 + Math.random() * 500),
      totalDemand: Math.floor(100 + Math.random() * 300),
      priceRange: `$${Math.min(...mktPrices).toFixed(2)} - $${Math.max(...mktPrices).toFixed(2)}`,
    };
  }

  return {
    sku,
    name: getSneakerName(sku),
    brand: getSneakerBrand(sku),
    imageUrl: '/Air-Jordan-1.png',
    timeframe,
    prices,
    summary,
    sentiment: {
      buyerSentiment: Math.round(Math.random() * 100),
      sellerSentiment: Math.round(Math.random() * 100),
      marketMomentum: ['bullish', 'bearish', 'neutral'][Math.floor(Math.random() * 3)],
      priceDirection: Math.round((Math.random() * 20 - 10) * 10) / 10,
      volumeTrend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)],
    },
  };
}

function getSneakerName(sku: string): string {
  const names: Record<string, string> = {
    'AIR-JORDAN-1': 'Jordan 1 Retro High OG',
    'YEEZY-350': 'Yeezy 350 V2',
    'TRAVIS-SCOTT-1': 'Travis Scott Jordan 1 Low',
    'SUPREME-JORDAN': 'Supreme Jordan 1',
    'OFF-WHITE-1': 'Off-White Air Jordan 1',
    'NIKE-AF1': 'Nike Air Force 1',
  };
  return names[sku] || 'Premium Sneaker';
}

function getSneakerBrand(sku: string): string {
  if (sku.includes('YEEZY')) return 'Adidas';
  if (sku.includes('JORDAN') || sku.includes('TRAVIS') || sku.includes('OFF-WHITE')) return 'Nike';
  return 'Nike';
}
