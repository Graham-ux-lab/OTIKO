import { useState } from 'react';

interface ImageProps { src: string; alt: string; className?: string; fallback?: string; }

export default function OptimizedImage({ src, alt, fallback = 'OTIKO', className: _className }: ImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  if (error) return <div className="flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-700 text-lg font-black tracking-tight text-white">{fallback}</div>;
  return <div className="relative overflow-hidden">{loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse"><span className="text-sm font-bold text-gray-500">Loading event image</span></div>}<img src={src} alt={alt} className="w-full h-full object-cover transition-opacity duration-300" onLoad={() => setLoading(false)} onError={() => setError(true)} /></div>;
}
