/**
 * Autosave Hook
 * Handles automatic saving of editor content to localStorage or API
 */

import { useEffect, useRef } from 'react';

interface AutosaveConfig {
  enabled?: boolean;
  intervalMs?: number;
  storageKey?: string;
  provider?: 'localStorage' | 'api';
  apiUrl?: string;
}

export function useAutosave(
  getContent: () => string,
  config?: AutosaveConfig
) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!config?.enabled) return;

    const interval = config.intervalMs || 30000; // Default 30 seconds
    const storageKey = config.storageKey || 'rte-autosave';
    const provider = config.provider || 'localStorage';

    const save = async () => {
      const content = getContent();
      
      // Only save if content changed
      if (content === lastSavedRef.current) return;
      
      lastSavedRef.current = content;

      if (provider === 'localStorage') {
        try {
          localStorage.setItem(storageKey, content);
          localStorage.setItem(`${storageKey}-timestamp`, Date.now().toString());
          console.log('[Autosave] Content saved to localStorage');
        } catch (error) {
          console.error('[Autosave] Failed to save to localStorage:', error);
        }
      } else if (provider === 'api' && config.apiUrl) {
        try {
          await fetch(config.apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content, timestamp: Date.now() }),
          });
          console.log('[Autosave] Content saved to API');
        } catch (error) {
          console.error('[Autosave] Failed to save to API:', error);
        }
      }
    };

    // Start autosave interval
    intervalRef.current = setInterval(save, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [config?.enabled, config?.intervalMs, config?.storageKey, config?.provider, config?.apiUrl, getContent]);

  // Function to restore autosaved content
  const restore = (): string | null => {
    if (!config?.enabled) return null;

    const storageKey = config.storageKey || 'rte-autosave';
    const provider = config.provider || 'localStorage';

    if (provider === 'localStorage') {
      try {
        const content = localStorage.getItem(storageKey);
        const timestamp = localStorage.getItem(`${storageKey}-timestamp`);
        
        if (content && timestamp) {
          console.log('[Autosave] Restored from localStorage, saved at:', new Date(parseInt(timestamp)));
          return content;
        }
      } catch (error) {
        console.error('[Autosave] Failed to restore from localStorage:', error);
      }
    }

    return null;
  };

  return { restore };
}
