/**
 * Trending Products API
 * GET /api/marketplace/trending?limit=10
 */

export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    // Mock trending sneakers
    const trendingData = [
      {
        id: '1',
        sku: 'AIR-JORDAN-1',
        name: 'Jordan 1 Retro High OG',
        brand: 'Nike',
        imageUrl: '/Air-Jordan-1.png',
        demand: 8500,
        priceRange: '$150 - $280',
        trend: 'up',
      },
      {
        id: '2',
        sku: 'YEEZY-350',
        name: 'Yeezy 350 V2 Zebra',
        brand: 'Adidas',
        imageUrl: 'https://images.unsplash.com/photo-1552062407-c531452d93d8?w=400',
        demand: 7200,
        priceRange: '$180 - $320',
        trend: 'up',
      },
      {
        id: '3',
        sku: 'TRAVIS-SCOTT-1',
        name: 'Travis Scott Jordan 1 Low',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1514706267537-b85ef988b04b?w=400',
        demand: 6800,
        priceRange: '$220 - $450',
        trend: 'stable',
      },
      {
        id: '4',
        sku: 'NIKE-AF1',
        name: 'Nike Air Force 1 Low Supreme',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        demand: 5200,
        priceRange: '$80 - $150',
        trend: 'up',
      },
      {
        id: '5',
        sku: 'OFF-WHITE-1',
        name: 'Off-White Air Jordan 1 Chicago',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1504521155375-b1510eaea708?w=400',
        demand: 4800,
        priceRange: '$250 - $520',
        trend: 'down',
      },
      {
        id: '6',
        sku: 'SUPREME-JORDAN',
        name: 'Supreme Box Logo Jordan',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1556821552-5f9755de063a?w=400',
        demand: 4200,
        priceRange: '$120 - $280',
        trend: 'stable',
      },
      {
        id: '7',
        sku: 'DUNK-LOW-UNC',
        name: 'Nike Dunk Low UNC',
        brand: 'Nike',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        demand: 3900,
        priceRange: '$90 - $180',
        trend: 'up',
      },
      {
        id: '8',
        sku: 'NEW-BALANCE-990v6',
        name: 'New Balance 990v6',
        brand: 'New Balance',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        demand: 3100,
        priceRange: '$120 - $200',
        trend: 'down',
      },
      {
        id: '9',
        sku: 'ASICS-GEL-LYTE3',
        name: 'ASICS Gel-Lyte III',
        brand: 'ASICS',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        demand: 2800,
        priceRange: '$70 - $140',
        trend: 'stable',
      },
      {
        id: '10',
        sku: 'CONVERSE-CHUCK70',
        name: 'Converse Chuck 70',
        brand: 'Converse',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        demand: 2200,
        priceRange: '$40 - $100',
        trend: 'up',
      },
    ];

    return Response.json({
      success: true,
      data: {
        trending: trendingData.slice(0, limit),
      },
    });
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch trending products' },
      { status: 500 }
    );
  }
}
