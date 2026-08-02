import React, { useEffect } from 'react';
import { GOAT_TOKENS } from './tokens';

export interface GoatModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export const GoatModal: React.FC<GoatModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true
}) => {
  // Lock body scroll when open and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95vw] h-[90vh]'
  }[size];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Container */}
      <div
        className={`relative z-10 flex w-full max-h-[90vh] flex-col rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-100 shadow-2xl shadow-black sm:p-6 ${sizeClasses} ${GOAT_TOKENS.motion.reducedMotionClass}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800/80 pb-3">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <span className="h-5 w-1.5 -skew-x-12 rounded-sm bg-amber-500" />
                <h2 className="font-goat-display text-xl uppercase tracking-wider text-zinc-100 sm:text-2xl">
                  {title}
                </h2>
              </div>
            )}
            {subtitle && <p className="mt-1 text-xs text-zinc-400 sm:text-sm">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white ${GOAT_TOKENS.focusState}`}
            aria-label="Fechar modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar overflow-y-auto py-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
