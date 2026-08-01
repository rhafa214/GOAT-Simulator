import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { IconButton } from './IconButton';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div 
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl p-6 motion-safe:animate-in motion-safe:fade-in-90 motion-safe:zoom-in-95",
          className
        )}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between mb-4">
            {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
            <IconButton 
              icon={<X size={18} />} 
              aria-label="Close modal" 
              variant="ghost" 
              onClick={onClose}
              className="ml-auto -mr-2 -mt-2"
            />
          </div>
        )}
        <div className="text-white/80">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
