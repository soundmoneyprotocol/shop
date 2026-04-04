export async function GET(request: Request) {
  try {
    // Mock products for now
    const mockProducts = [
      {
        id: '1',
        title: 'Jordan 1 Retro High OG',
        price_usd: 15999,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        category: 'Sneakers',
        rating: 4.8,
        stock: 5,
        creator_id: 'creator-1',
      },
      {
        id: '2',
        title: 'Nike Air Force 1',
        price_usd: 11999,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        category: 'Sneakers',
        rating: 4.5,
        stock: 12,
        creator_id: 'creator-2',
      },
      {
        id: '3',
        title: 'Yeezy 350 V2',
        price_usd: 18999,
        image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        category: 'Sneakers',
        rating: 4.9,
        stock: 3,
        creator_id: 'creator-3',
      },
    ];

    return Response.json({
      products: mockProducts,
      total: mockProducts.length,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
