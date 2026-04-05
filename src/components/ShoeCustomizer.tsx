'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SHOE_PARTS, type ShoePart, getColorsForPart, SHOE_MODEL } from '@/lib/shoeAttributes';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface Customization {
  sole: string;
  swoosh: string;
  body: string;
  top: string;
  toe: string;
  back: string;
}

const PART_LABELS: Record<ShoePart, string> = {
  sole: 'Sole',
  swoosh: 'Swoosh',
  body: 'Body',
  top: 'Top',
  toe: 'Toe Box',
  back: 'Back/Heel',
};

const PART_DESCRIPTIONS: Record<ShoePart, string> = {
  sole: 'Bottom sole and laces',
  swoosh: 'Nike swoosh logo',
  body: 'Main shoe panels',
  top: 'Collar and top',
  toe: 'Toe box area',
  back: 'Heel and back panel',
};

export default function ShoeCustomizer() {
  const [customization, setCustomization] = useState<Customization>({
    sole: 'FFFFFF',
    swoosh: '000000',
    body: 'FF0000',
    top: '0000FF',
    toe: '00FF00',
    back: 'FFFF00',
  });

  const [selectedPart, setSelectedPart] = useState<ShoePart>('sole');
  const [imageUrl, setImageUrl] = useState<string>('/Air-Jordan-1.png');
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'customizer' | 'preview'>('customizer');

  const handleColorChange = useCallback(
    (part: ShoePart, color: string) => {
      setCustomization((prev) => ({
        ...prev,
        [part]: color,
      }));
    },
    []
  );

  const generatePreview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/shoes/customize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customization),
      });

      const result = await response.json();

      if (result.success && result.data.imageUrl) {
        setImageUrl(result.data.imageUrl);
        setPreviewMode('preview');
        toast.success('Shoe customization generated!');
      } else {
        toast.error('Failed to generate preview');
      }
    } catch (error) {
      toast.error('Error generating preview');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [customization]);

  const resetCustomization = useCallback(() => {
    setCustomization({
      sole: 'FFFFFF',
      swoosh: '000000',
      body: 'FF0000',
      top: '0000FF',
      toe: '00FF00',
      back: 'FFFF00',
    });
    setImageUrl('/Air-Jordan-1.png');
    setPreviewMode('customizer');
  }, []);

  const colors = getColorsForPart(selectedPart);
  const colorEntries = Object.entries(colors);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light mb-2">Customize Your {SHOE_MODEL}</h1>
          <p className="text-gray-600">Create your unique colorway. Mix and match to find your style.</p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setPreviewMode('customizer')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              previewMode === 'customizer'
                ? 'bg-black text-white'
                : 'bg-white text-black border-2 border-gray-300'
            }`}
          >
            Customizer
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              previewMode === 'preview'
                ? 'bg-black text-white'
                : 'bg-white text-black border-2 border-gray-300'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Customizer View */}
        {previewMode === 'customizer' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Shoe Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-sm aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Custom Shoe Preview"
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <p className="mt-4 text-gray-600 text-sm text-center">
                Live preview of your customization
              </p>
            </motion.div>

            {/* Customization Controls */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Shoe Parts Tabs */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Select a Part to Customize</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SHOE_PARTS.map((part) => (
                    <button
                      key={part}
                      onClick={() => setSelectedPart(part)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        selectedPart === part
                          ? 'bg-black text-white'
                          : 'bg-white text-black border-2 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {PART_LABELS[part]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <div className="mb-3">
                  <h3 className="text-base font-semibold mb-1">
                    {PART_LABELS[selectedPart]} Colors
                  </h3>
                  <p className="text-sm text-gray-600">{PART_DESCRIPTIONS[selectedPart]}</p>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {colorEntries.map(([name, hex]) => (
                    <button
                      key={hex}
                      onClick={() => handleColorChange(selectedPart, hex)}
                      className={`group relative w-full aspect-square rounded-lg overflow-hidden transition-all ${
                        customization[selectedPart] === hex
                          ? 'ring-4 ring-black scale-110'
                          : 'hover:scale-105'
                      }`}
                      title={name}
                    >
                      <div
                        className="w-full h-full border-2 border-gray-300"
                        style={{ backgroundColor: `#${hex}` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/50">
                        <span className="text-white text-xs font-semibold">{name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Current Selection Display */}
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Selected:</span>{' '}
                    <span className="font-mono">#{customization[selectedPart]}</span>
                  </p>
                  <div
                    className="w-full h-12 rounded mt-2 border border-gray-300"
                    style={{ backgroundColor: `#${customization[selectedPart]}` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={generatePreview}
                  disabled={loading}
                  className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition"
                >
                  {loading ? 'Generating...' : 'Generate Preview'}
                </button>
                <button
                  onClick={resetCustomization}
                  className="flex-1 py-3 bg-white text-black border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              </div>

              {/* Customization Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Your Customization</h4>
                <div className="space-y-1 text-sm font-mono text-blue-800">
                  {SHOE_PARTS.map((part) => (
                    <div key={part} className="flex justify-between">
                      <span>{PART_LABELS[part]}:</span>
                      <span className="flex items-center gap-2">
                        #{customization[part]}
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: `#${customization[part]}` }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Preview Mode */}
        {previewMode === 'preview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200 p-8 mb-8">
              <img
                src={imageUrl}
                alt="Custom Shoe"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-light">Your Custom Shoe</h2>

              {/* Customization Details */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg">
                {SHOE_PARTS.map((part) => (
                  <div key={part} className="text-center">
                    <p className="text-xs text-gray-600 mb-2">{PART_LABELS[part]}</p>
                    <div
                      className="w-full h-12 rounded mb-2 border-2 border-gray-300"
                      style={{ backgroundColor: `#${customization[part]}` }}
                    />
                    <p className="text-xs font-mono text-gray-800">#{customization[part]}</p>
                  </div>
                ))}
              </div>

              {/* Mint/Purchase Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setPreviewMode('customizer')}
                  className="flex-1 py-3 bg-white text-black border-2 border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Back to Customizer
                </button>
                <button className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition">
                  Mint as NFT
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
