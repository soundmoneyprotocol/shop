'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SneakerData {
  name: string;
  platforms: {
    [key: string]: number;
  };
  trend: number;
}

export const SneakerTicker: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  const sneakers: SneakerData[] = [
    { name: 'Jordan 1 Retro', platforms: { GOAT: 159.99, STOCKX: 162.50, StadiumGoods: 160.00, YEEZY: 155.00 }, trend: 3.2 },
    { name: 'Nike Air Force 1', platforms: { GOAT: 89.99, STOCKX: 92.00, StadiumGoods: 90.00, SUPREME: 95.00 }, trend: -1.5 },
    { name: 'Yeezy 350 V2', platforms: { GOAT: 189.99, STOCKX: 192.50, YEEZY: 199.00, StadiumGoods: 188.00 }, trend: 5.8 },
    { name: 'Travis Scott Jordan', platforms: { GOAT: 299.99, STOCKX: 305.00, StadiumGoods: 298.00, SUPREME: 320.00 }, trend: 8.4 },
    { name: 'Supreme Dunk Low', platforms: { GOAT: 249.99, STOCKX: 255.00, SUPREME: 250.00, StadiumGoods: 248.00 }, trend: 2.1 },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ borderTop: '1.5px solid black', borderBottom: '1.5px solid black' }} className='sticky top-16 z-40 bg-white'>
      <div className='max-w-full overflow-hidden'>
        <div className='flex gap-4 sm:gap-8 md:gap-12 px-2 sm:px-4 md:px-6 py-2 sm:py-3 animate-scroll whitespace-nowrap'>
          {/* Render twice for seamless loop */}
          {[...sneakers, ...sneakers].map((sneaker, index) => (
            <div
              key={`${sneaker.name}-${index}`}
              className='flex items-center gap-2 sm:gap-4 flex-shrink-0 hover:opacity-100 opacity-80 transition'
            >
              <div className='flex items-center gap-2'>
                <span className='font-bold text-xs sm:text-sm text-gray-900 min-w-[80px] sm:min-w-[140px]'>{sneaker.name}</span>
              </div>
              <div className='hidden sm:flex items-center gap-3 sm:gap-6 text-xs'>
                {Object.entries(sneaker.platforms).map(([platform, price]) => (
                  <div key={platform} className='flex flex-col items-center'>
                    <span className='text-gray-600 font-medium text-xs'>{platform}</span>
                    <span className='text-green-600 font-semibold'>${price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className='flex items-center gap-1'>
                {sneaker.trend > 0 ? (
                  <>
                    <TrendingUp className='w-3 h-3 sm:w-4 sm:h-4 text-green-600' />
                    <span className='text-green-600 font-medium text-xs sm:text-sm min-w-[35px] sm:min-w-[45px]'>+{sneaker.trend.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className='w-3 h-3 sm:w-4 sm:h-4 text-red-600' />
                    <span className='text-red-600 font-medium text-xs sm:text-sm min-w-[35px] sm:min-w-[45px]'>{sneaker.trend.toFixed(1)}%</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 80s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default SneakerTicker;
