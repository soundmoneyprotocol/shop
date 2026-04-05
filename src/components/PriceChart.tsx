'use client';

import { motion } from 'framer-motion';

interface PricePoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  timeframe: '7d' | '30d' | '90d';
  onTimeframeChange: (tf: '7d' | '30d' | '90d') => void;
}

export default function PriceChart({ data, timeframe, onTimeframeChange }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <p className="text-gray-600">No price history available</p>
      </div>
    );
  }

  // Calculate min/max for scaling
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Chart dimensions
  const width = 600;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points for line
  const points = data.map((d, i) => ({
    x: padding + (i / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - ((d.price - minPrice) / priceRange) * chartHeight,
  }));

  // Create path
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Calculate percentage change
  const startPrice = data[0].price;
  const endPrice = data[data.length - 1].price;
  const priceChange = endPrice - startPrice;
  const percentChange = (priceChange / startPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header with timeframe buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-light mb-1">Price History</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-black">${endPrice.toFixed(2)}</span>
            <span className={`text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Timeframe buttons */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-2 text-sm font-medium transition ${
                timeframe === tf
                  ? 'text-black font-bold border-b-2 border-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 overflow-x-auto">
        <svg
          width={Math.max(width, 800)}
          height={height}
          className="w-full"
          viewBox={`0 0 ${width} ${height}`}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (chartHeight / 4) * i;
            const gridPrice = maxPrice - (priceRange / 4) * i;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <text
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                  dominantBaseline="middle"
                >
                  ${gridPrice.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Axes */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#000"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#000"
            strokeWidth="1"
          />

          {/* Area under line */}
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? '#16a34a' : '#dc2626'} stopOpacity="0.1" />
              <stop offset="100%" stopColor={isPositive ? '#16a34a' : '#dc2626'} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Filled area */}
          <path
            d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
            fill="url(#priceGradient)"
          />

          {/* Price line */}
          <path
            d={pathD}
            fill="none"
            stroke={isPositive ? '#16a34a' : '#dc2626'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r="3"
              fill={isPositive ? '#16a34a' : '#dc2626'}
              opacity="0.5"
            />
          ))}

          {/* X-axis labels (first, middle, last) */}
          {[0, Math.floor(data.length / 2), data.length - 1].map((i) => (
            <text
              key={`label-${i}`}
              x={points[i].x}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {data[i].date}
            </text>
          ))}
        </svg>
      </div>

      {/* Price stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Highest</p>
          <p className="text-lg font-bold text-black">${maxPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Lowest</p>
          <p className="text-lg font-bold text-black">${minPrice.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Average</p>
          <p className="text-lg font-bold text-black">
            ${(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Change</p>
          <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}${priceChange.toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
