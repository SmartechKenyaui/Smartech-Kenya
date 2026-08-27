'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageCropperModalProps {
  imageSrc: string;
  title?: string;
  aspectRatio?: number | null; // e.g. 1 (1:1), 4/3, 16/9, or null for free
  onCrop: (croppedBase64: string) => void;
  onClose: () => void;
}

export function ImageCropperModal({
  imageSrc,
  title = 'Crop Product Image',
  aspectRatio: initialAspectRatio = 1,
  onCrop,
  onClose,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(initialAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Rotate 90 deg clockwise
  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Drag / Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Execute Crop
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Output dimension: high resolution square or aspect
    const outputSize = 1200;
    const targetWidth = outputSize;
    const targetHeight = aspectRatio ? outputSize / aspectRatio : outputSize;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Fill white background for clean presentation
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Center transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate source drawing scale
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = targetWidth / targetHeight;

    let drawWidth = targetWidth;
    let drawHeight = targetHeight;

    if (imgAspect > canvasAspect) {
      drawWidth = targetHeight * imgAspect;
    } else {
      drawHeight = targetWidth / imgAspect;
    }

    // Apply panning relative to canvas scale
    const panScaleX = targetWidth / (containerRef.current?.clientWidth || targetWidth);
    const panScaleY = targetHeight / (containerRef.current?.clientHeight || targetHeight);

    ctx.drawImage(
      img,
      -drawWidth / 2 + (pan.x * panScaleX) / zoom,
      -drawHeight / 2 + (pan.y * panScaleY) / zoom,
      drawWidth,
      drawHeight
    );

    ctx.restore();

    // Export high-quality JPEG
    const base64 = canvas.toDataURL('image/jpeg', 0.92);
    onCrop(base64);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#12161F] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F97316]/20 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-bold">{title}</h3>
              <p className="text-[11px] text-gray-400">Crop, zoom, pan & adjust product image</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop Viewport */}
        <div className="relative flex-1 bg-[#090C12] p-6 flex items-center justify-center overflow-hidden min-h-[320px] max-h-[440px]">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            className={`relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#F97316] select-none ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              width: aspectRatio ? `${Math.min(360, 360 * aspectRatio)}px` : '360px',
              height: aspectRatio ? `${Math.min(360, 360 / aspectRatio)}px` : '360px',
              background: '#FFFFFF',
            }}
          >
            {/* Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-30 border border-white/20">
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-r border-b border-white" />
              <div className="border-b border-white" />
              <div className="border-r border-white" />
              <div className="border-r border-white" />
              <div />
            </div>

            {/* Render Target Image */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              crossOrigin="anonymous"
              className="absolute max-w-none origin-center pointer-events-none transition-transform duration-75"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        {/* Toolbar & Controls */}
        <div className="p-5 border-t border-white/10 bg-[#0E121A] space-y-4">
          {/* Aspect Ratios & Tools */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Ratio options */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <span className="text-gray-400 text-[11px] px-2 font-medium">Aspect:</span>
              <button
                type="button"
                onClick={() => setAspectRatio(1)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  aspectRatio === 1 ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                1:1 Square
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio(4 / 3)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  aspectRatio === 4 / 3 ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                4:3
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio(16 / 9)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  aspectRatio === 16 / 9 ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                16:9
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio(null)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  aspectRatio === null ? 'bg-[#F97316] text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                Free
              </button>
            </div>

            {/* Transform buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white font-medium transition-colors"
                title="Rotate 90 degrees"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Rotate</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium transition-colors"
                title="Reset zoom and position"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 w-12">Zoom:</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[#F97316] cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
            <span className="text-xs font-mono text-gray-300 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-[#EA580C] shadow-lg shadow-[#F97316]/25 transition-all active:scale-98 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Apply Crop & Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
