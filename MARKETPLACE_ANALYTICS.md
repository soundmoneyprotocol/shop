# Marketplace Analytics Integration

## Overview

The SoundMoney shop now includes a complete marketplace analytics system that:
- Fetches price data from GOAT, StockX, Grailed and other platforms
- Displays real-time price comparisons across marketplaces
- Shows supply/demand indicators
- Tracks price trends over 7, 30, and 90 day periods
- Helps sellers understand market conditions for competitive pricing

## Components

### 1. API Endpoint: `/src/app/api/marketplace-prices/route.ts`

**Purpose**: Query price history data for products

**Endpoint**: `GET /api/marketplace-prices?sku={sku}&timeframe={timeframe}`

**Parameters**:
- `sku` (string): Product SKU (e.g., "JORDAN-001")
- `timeframe` (string): '7d', '30d', or '90d'

**Response**:
```json
{
  "success": true,
  "data": {
    "sku": "JORDAN-001",
    "name": "Jordan 1 Retro High OG",
    "brand": "Nike",
    "imageUrl": "...",
    "timeframe": "7d",
    "prices": [
      {
        "marketplace": "GOAT",
        "lowestAsk": 159.99,
        "highestBid": 155.00,
        "lastSalePrice": 157.50,
        "supply": 45,
        "demand": 120,
        "timestamp": "2026-04-04",
        "condition": "DS",
        "size": "10.5"
      }
    ],
    "summary": {
      "GOAT": {
        "avgAsk": 162.50,
        "avgBid": 157.50,
        "avgSalePrice": 160.00,
        "minAsk": 159.99,
        "maxAsk": 166.75,
        "totalSupply": 305,
        "totalDemand": 840,
        "dataPoints": 7
      }
    }
  }
}
```

### 2. Analytics Dashboard: `/src/app/marketplace-analytics/page.tsx`

**URL**: `/marketplace-analytics`

**Features**:
- Product selector dropdown
- Timeframe selector (7d, 30d, 90d)
- Real-time price comparison across marketplaces
- Supply/demand indicators with trending badges
- Summary statistics grid
- Price range visualization
- Condition and size information

**UI Elements**:
- Price bars showing relative positioning
- Green highlight for lowest price
- TrendingUp/TrendingDown indicators for supply/demand
- Condition badges (DS, New, Used, etc.)
- Summary statistics for each marketplace

### 3. Seller Dashboard Integration

**Location**: Seller dashboard header

**New Button**: Analytics button linking to `/marketplace-analytics`

**Access**: Click "Analytics" button in `/seller/dashboard`

## Database Schema (From Scraper)

The data comes from PostgreSQL tables in the sneaker-scraper-marketplace:

### `sneakers` table
```sql
- id (PK)
- sku (unique)
- name
- brand
- image_url
- description
- created_at
- updated_at
```

### `price_history` table
```sql
- id (PK)
- sneaker_id (FK)
- marketplace (GOAT, StockX, Grailed, etc.)
- size (US shoe size or apparel size)
- condition (DS, New, Like New, Used)
- lowest_ask (current asking price)
- highest_bid (current bid)
- last_sale_price (last transaction)
- supply (number of listings)
- demand (watchers/interest)
- timestamp (UTC)
- raw_data (JSON)
```

## Integration with Real Data

### To connect to the actual scraper database:

**Edit `/src/app/api/marketplace-prices/route.ts`:**

1. Replace mock data with real database queries
2. Connect to PostgreSQL with the scraper database credentials

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.SCRAPER_DATABASE_URL,
});

export async function GET(request: NextRequest) {
  const client = await pool.connect();
  try {
    const { searchParams } = new URL(request.url);
    const sku = searchParams.get('sku');
    const timeframe = searchParams.get('timeframe');

    // Query sneaker
    const sneakerResult = await client.query(
      'SELECT * FROM sneakers WHERE sku = $1',
      [sku]
    );

    if (sneakerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const sneaker = sneakerResult.rows[0];

    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    if (timeframe === '7d') startDate.setDate(startDate.getDate() - 7);
    else if (timeframe === '30d') startDate.setDate(startDate.getDate() - 30);
    else if (timeframe === '90d') startDate.setDate(startDate.getDate() - 90);

    // Query price history
    const pricesResult = await client.query(
      `SELECT * FROM price_history
       WHERE sneaker_id = $1 AND timestamp BETWEEN $2 AND $3
       ORDER BY timestamp ASC`,
      [sneaker.id, startDate, endDate]
    );

    return NextResponse.json({
      success: true,
      data: {
        sku: sneaker.sku,
        name: sneaker.name,
        brand: sneaker.brand,
        imageUrl: sneaker.image_url,
        timeframe,
        prices: pricesResult.rows.map(p => ({
          marketplace: p.marketplace,
          lowestAsk: p.lowest_ask,
          highestBid: p.highest_bid,
          lastSalePrice: p.last_sale_price,
          supply: p.supply,
          demand: p.demand,
          timestamp: p.timestamp.toISOString(),
          condition: p.condition,
          size: p.size,
        })),
        summary: calculateSummary(pricesResult.rows),
      },
    });
  } finally {
    client.release();
  }
}
```

### Environment Variables

Add to `.env.local`:
```
SCRAPER_DATABASE_URL=postgresql://user:password@host:5432/sneaker_marketplace
```

## Using the Analytics Dashboard

1. **Navigate to Analytics**:
   - From seller dashboard, click "Analytics" button
   - Or visit `/marketplace-analytics`

2. **Select Product**: Choose from dropdown
   - Shows available products with price data
   - Updates chart immediately

3. **Choose Timeframe**: Select 7d, 30d, or 90d
   - Changes displayed price history
   - Recalculates summary statistics

4. **Analyze Results**:
   - **Price Bars**: Visual comparison of pricing across markets
   - **Green = Lowest Price**: Best deal for buyers
   - **Supply/Demand**: Indicators show market interest
   - **Summary Stats**: Average ask/bid, ranges, totals

## Key Metrics

### Supply/Demand Indicators
- **High Supply (>40 listings)**: More stock available, possibly lower prices
- **High Demand (>100 interest)**: More buyers interested, possible price increase
- **Low Supply + High Demand**: Scarcity, price pressure up

### Price Metrics
- **Lowest Ask**: Minimum selling price currently on market
- **Highest Bid**: Maximum buyers willing to pay
- **Last Sale Price**: Most recent transaction price
- **Spread**: Ask - Bid indicates market liquidity

## Example Use Cases

### For Sellers
- Set competitive pricing based on marketplace comparisons
- Identify hot products with high demand
- Track price trends to understand market timing
- Monitor supply levels to adjust inventory

### For Buyers
- Find best prices across platforms
- See where to get better deals
- Understand fair market value
- Check market interest/demand

### For the Platform
- Display trending products on marketplace
- Show price badges (Lowest Price, Price Drop)
- Power recommendation engine
- Analyze market segments

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for live price updates
2. **Alerts**: Notify sellers when prices change >5%
3. **Forecasting**: ML model to predict price trends
4. **Market Insights**: Most searched, trending, price volatility
5. **Mobile App**: Price checking on the go
6. **Price Recommendations**: Suggest optimal pricing for new products
7. **Export**: Download analytics as CSV/PDF
8. **Advanced Filters**: Filter by condition, size, seller rating

## Troubleshooting

**No data showing?**
- Check if `SCRAPER_DATABASE_URL` is set
- Verify scraper is running and collecting data
- Check database connection permissions

**Stale data?**
- Verify scraper schedule is running
- Check scraper logs for errors
- Make sure data collection is happening

**API errors?**
- Check browser console for error messages
- Verify SKU is correct
- Check `/api/marketplace-prices` endpoint directly

## Files Modified/Created

- `/src/app/api/marketplace-prices/route.ts` - New price data API
- `/src/app/marketplace-analytics/page.tsx` - New analytics dashboard
- `/src/app/seller/dashboard/page.tsx` - Added Analytics button
