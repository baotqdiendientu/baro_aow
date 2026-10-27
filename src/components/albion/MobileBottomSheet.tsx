'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCurrentY(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    const diff = e.touches[0].clientY - startY;
    if (diff > 0) {
      // Only drag down
      setCurrentY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (currentY > 80) {
      onClose();
    }
    setStartY(null);
    setCurrentY(0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 md:hidden bg-black/65 backdrop-blur-sm flex flex-col justify-end animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateY(${currentY}px)`,
          transition: startY === null ? 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
        }}
        className="relative w-full max-h-[85vh] bg-bg-surface rounded-t-3xl border-t-2 border-border-gold/50 shadow-2xl flex flex-col overflow-hidden pb-safe"
      >
        {/* Drag Handle Bar */}
        <div className="pt-3 pb-2 flex flex-col items-center cursor-grab active:cursor-grabbing border-b border-border-subtle/40">
          <div className="w-12 h-1.5 rounded-full bg-border-subtle hover:bg-border-gold/60 transition-colors" />
          {title && (
            <div className="mt-2 text-xs font-display font-bold uppercase tracking-wider text-accent-primary">
              {title}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-4 w-7 h-7 rounded-full bg-bg-secondary flex items-center justify-center text-text-muted hover:text-text-primary border border-border-subtle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-50px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

