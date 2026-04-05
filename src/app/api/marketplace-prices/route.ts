import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface PriceData {
  marketplace: string;
  lowestAsk: number | null;
  highestBid: number | null;
  lastSalePrice: number | null;
  supply: number;
  demand: number;
  timestamp: string;
  condition: string;
  size: string;
}

interface ProductPriceHistory {
  sku: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  prices: PriceData[];
  timeframes: {
    '7d': PriceData[];
    '30d': PriceData[];
    '90d': PriceData[];
  };
}

// Mock data - replace with real database queries
const MOCK_PRICE_HISTORY: Record<string, ProductPriceHistory> = {
  'JORDAN-001': {
    sku: 'JORDAN-001',
    name: 'Jordan 1 Retro High OG',
    brand: 'Nike',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300',
    prices: [],
    timeframes: {
      '7d': [
        { marketplace: 'GOAT', lowestAsk: 159.99, highestBid: 155.00, lastSalePrice: 157.50, supply: 45, demand: 120, timestamp: '2026-03-29', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 162.50, highestBid: 157.50, lastSalePrice: 160.00, supply: 42, demand: 125, timestamp: '2026-03-30', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 161.00, highestBid: 156.00, lastSalePrice: 158.75, supply: 48, demand: 118, timestamp: '2026-03-31', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 165.50, highestBid: 160.00, lastSalePrice: 162.50, supply: 40, demand: 135, timestamp: '2026-04-01', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 164.00, highestBid: 159.00, lastSalePrice: 161.50, supply: 43, demand: 128, timestamp: '2026-04-02', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 166.75, highestBid: 161.50, lastSalePrice: 164.00, supply: 38, demand: 140, timestamp: '2026-04-03', condition: 'DS', size: '10.5' },
        { marketplace: 'GOAT', lowestAsk: 159.99, highestBid: 155.00, lastSalePrice: 157.50, supply: 45, demand: 120, timestamp: '2026-04-04', condition: 'DS', size: '10.5' },

        { marketplace: 'StockX', lowestAsk: 165.00, highestBid: 162.00, lastSalePrice: 163.50, supply: 52, demand: 110, timestamp: '2026-03-29', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 168.50, highestBid: 165.00, lastSalePrice: 166.75, supply: 48, demand: 115, timestamp: '2026-03-30', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 167.00, highestBid: 163.50, lastSalePrice: 165.25, supply: 51, demand: 112, timestamp: '2026-03-31', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 171.50, highestBid: 168.00, lastSalePrice: 169.75, supply: 46, demand: 125, timestamp: '2026-04-01', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 170.00, highestBid: 166.50, lastSalePrice: 168.25, supply: 49, demand: 118, timestamp: '2026-04-02', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 172.75, highestBid: 169.50, lastSalePrice: 171.00, supply: 44, demand: 130, timestamp: '2026-04-03', condition: 'New', size: '10' },
        { marketplace: 'StockX', lowestAsk: 165.00, highestBid: 162.00, lastSalePrice: 163.50, supply: 52, demand: 110, timestamp: '2026-04-04', condition: 'New', size: '10' },

        { marketplace: 'Grailed', lowestAsk: 155.00, highestBid: 150.00, lastSalePrice: 152.50, supply: 28, demand: 85, timestamp: '2026-03-29', condition: 'Used', size: '10.5' },
        { marketplace: 'Grailed', lowestAsk: 158.00, highestBid: 153.00, lastSalePrice: 155.50, supply: 26, demand: 88, timestamp: '2026-04-04', condition: 'Used', size: '10.5' },

        { marketplace: 'eBay', lowestAsk: 152.50, highestBid: 148.00, lastSalePrice: 150.25, supply: 35, demand: 72, timestamp: '2026-03-29', condition: 'Used', size: '10.5' },
        { marketplace: 'eBay', lowestAsk: 155.75, highestBid: 151.00, lastSalePrice: 153.50, supply: 32, demand: 76, timestamp: '2026-04-04', condition: 'Used', size: '10.5' },      ],
      '30d': [],
      '90d': [],
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get('sku') || 'JORDAN-001';
    const timeframe = (searchParams.get('timeframe') as '7d' | '30d' | '90d') || '7d';

    // For now, return mock data
    // In production, this would query the PostgreSQL database from the scraper
    const productData = MOCK_PRICE_HISTORY[sku];

    if (!productData) {
      return NextResponse.json(
        { error: 'Product not found', sku },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        sku: productData.sku,
        name: productData.name,
        brand: productData.brand,
        imageUrl: productData.imageUrl,
        timeframe,
        prices: productData.timeframes[timeframe],
        summary: calculateSummary(productData.timeframes[timeframe]),
      },
    });
  } catch (error) {
    console.error('Price data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    );
  }
}

function calculateSummary(prices: PriceData[]) {
  if (prices.length === 0) return null;

  // Group by marketplace
  const byMarketplace = prices.reduce((acc, p) => {
    if (!acc[p.marketplace]) {
      acc[p.marketplace] = [];
    }
    acc[p.marketplace].push(p);
    return acc;
  }, {} as Record<string, PriceData[]>);

  const summary: Record<string, any> = {};

  for (const [marketplace, data] of Object.entries(byMarketplace)) {
    const asks = data.map(d => d.lowestAsk).filter((p): p is number => p !== null);
    const bids = data.map(d => d.highestBid).filter((p): p is number => p !== null);
    const sales = data.map(d => d.lastSalePrice).filter((p): p is number => p !== null);

    const avgAsk = asks.length > 0 ? asks.reduce((a, b) => a + b, 0) / asks.length : null;
    const avgBid = bids.length > 0 ? bids.reduce((a, b) => a + b, 0) / bids.length : null;
    const avgSale = sales.length > 0 ? sales.reduce((a, b) => a + b, 0) / sales.length : null;

    const minAsk = asks.length > 0 ? Math.min(...asks) : null;
    const maxAsk = asks.length > 0 ? Math.max(...asks) : null;

    const totalSupply = data.reduce((sum, d) => sum + d.supply, 0);
    const totalDemand = data.reduce((sum, d) => sum + d.demand, 0);

    summary[marketplace] = {
      avgAsk: avgAsk ? parseFloat(avgAsk.toFixed(2)) : null,
      avgBid: avgBid ? parseFloat(avgBid.toFixed(2)) : null,
      avgSalePrice: avgSale ? parseFloat(avgSale.toFixed(2)) : null,
      minAsk: minAsk ? parseFloat(minAsk.toFixed(2)) : null,
      maxAsk: maxAsk ? parseFloat(maxAsk.toFixed(2)) : null,
      totalSupply,
      totalDemand,
      dataPoints: data.length,
    };
  }

  return summary;
}
