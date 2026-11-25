import React, { useState } from 'react';
import { PawPrintSvg } from './PawGraphics';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  loading?: 'eager' | 'lazy';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#F7F4ED] via-[#E8EFE6] to-[#F7F4ED] text-[#30483A]/70 p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <PawPrintSvg className="w-10 h-10 mb-2 text-[#A8BFA3]" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-[#30483A]/75 line-clamp-2 max-w-[160px]">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
