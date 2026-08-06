import { useEffect } from 'react';
import { BRANDING } from '../core/constants/branding';

export function usePageTitle(pageName?: string) {
  useEffect(() => {
    if (pageName) {
      document.title = `${BRANDING.name} • ${pageName}`;
    } else {
      document.title = BRANDING.name;
    }
  }, [pageName]);
}
