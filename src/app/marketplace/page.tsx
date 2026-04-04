'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';

const CATEGORIES = ['All', 'Sneakers', 'Apparel', 'Books', 'Vinyl', 'Collectibles'];
const BRANDS = [
  { id: 'bezy-brand', name: 'BEZY', link: '/brand/bezy' },
  { id: 'stockx-brand', name: 'STOCKX', link: '/brand/stockx' },
  { id: 'stadiumgoods-brand', name: 'StadiumGoods', link: '/brand/stadiumgoods' },
  { id: 'yeezy-brand', name: 'YEEZY', link: '/brand/yeezy' },
  { id: 'supreme-brand', name: 'SUPREME', link: '/brand/supreme' },
  { id: 'sneakercred-brand', name: 'SneakerCred', link: '/brand/sneakercred' },
];

interface Product {
  id: string;
  title: string;
  price_usd: number;
  image_url: string;
  category: string;
  rating: number;
  stock: number;
  creator_id: string;
  review_count?: number;
}

interface Creator {
  id: string;
  name: string;
}

export default function Marketplace() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [creators, setCreators] = useState<Map<string, Creator>>(new Map());
  const [creatorsList, setCreatorsList] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCreator, setSelectedCreator] = useState('All');
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (searchQuery) params.append('search', searchQuery);

        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        const fetchedProducts = data.products || [];
        setAllProducts(fetchedProducts);

        let filtered = fetchedProducts;
        if (selectedCreator !== 'All') {
          filtered = fetchedProducts.filter((p: Product) => p.creator_id === selectedCreator);
        }
        setProducts(filtered);

        const creatorIds = [...new Set(fetchedProducts.map((p: Product) => p.creator_id))];
        const creatorMap = new Map<string, Creator>();
        const creatorArr: Creator[] = [];

        for (const creatorId of creatorIds) {
          try {
            const creatorRes = await fetch(`/api/creators/${creatorId}`);
            if (creatorRes.ok) {
              const creatorData = await creatorRes.json();
              creatorMap.set(creatorId, creatorData);
              creatorArr.push(creatorData);
            }
          } catch (err) {
            console.error(`Failed to fetch creator ${creatorId}:`, err);
          }
        }

        setCreators(creatorMap);
        setCreatorsList(creatorArr.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, selectedCreator]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    const creatorName = creators.get(product.creator_id)?.name || 'Creator';
    addItem({
      id: product.id,
      title: product.title,
      price: product.price_usd,
      image: product.image_url,
      creatorName,
      maxStock: product.stock,
    });
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    const brand = BRANDS.find(b => b.id === value);
    if (brand) {
      router.push(brand.link);
      return;
    }

    setSelectedCreator(value);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-light text-gray-900 mb-6">SoundMoney Market</h1>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 py-4 px-4">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-sm border-none bg-transparent focus:outline-none text-gray-700 cursor-pointer font-medium"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* All Brands Dropdown */}
          <select
            value={selectedCreator}
            onChange={handleBrandChange}
            className="text-sm border-none bg-transparent focus:outline-none text-gray-700 cursor-pointer font-medium"
          >
            <option value="All">All Brands</option>
            <optgroup label="Featured Brands">
              {BRANDS.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </optgroup>
            {creatorsList.length > 0 && (
              <optgroup label="Creators">
                {creatorsList.map((creator) => (
                  <option key={creator.id} value={creator.id}>
                    {creator.name}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 border border-gray-300 bg-gray-50 text-gray-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-sm">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4 text-sm">No products found</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedCreator('All');
              }}
              className="text-sm border border-gray-300 px-4 py-2 hover:border-gray-400 bg-white text-gray-900"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group">
                <Link href={`/product/${product.id}`}>
                  <div className="cursor-pointer">
                    {/* Image */}
                    <div className="aspect-square overflow-hidden bg-gray-100 mb-3 relative">
                      <img
                        src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:opacity-80 transition"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Out of Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <p className="text-xs text-gray-500 mb-1">
                      {creators.get(product.creator_id)?.name || 'Creator'}
                    </p>
                    <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 group-hover:underline">
                      {product.title}
                    </h3>
                    <div className="flex justify-between items-baseline text-sm mb-3">
                      <span className="font-semibold text-green-600">
                        ${(product.price_usd / 100).toFixed(2)}
                      </span>
                      {product.rating ? (
                        <span className="text-gray-500 text-xs">★ {product.rating.toFixed(1)}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">New</span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                  className="w-full py-2 border border-gray-300 rounded text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={14} />
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
