// TypeScript module declaration for import resolution
// This is a workaround for missing type declaration errors in sibling imports
// Remove if/when a .d.ts file is generated for this file
declare module './SpellCheckPluginProvider';
import React, { useState, useEffect, useRef } from 'react';
import {
  scanDocumentForMisspellings,
  getSpellCheckStats,
  highlightMisspelledWords,
  clearSpellCheckHighlights,
  getSuggestions,
  replaceWord,
  ignoreWord,
  addToDictionary,
  attachSpellCheckContextMenu
} from './SpellCheckPlugin';

/**
 * Spell Check Stats Panel
 */
const SpellCheckStatsPanel: React.FC<{
  isVisible: boolean;
  onClose?: () => void;
}> = ({ isVisible, onClose }) => {
  const [stats, setStats] = useState({ total: 0, misspelled: 0, accuracy: 100 });

  useEffect(() => {
    if (isVisible) {
      const updateStats = () => {
        setStats(getSpellCheckStats());
      };

      updateStats();
      const interval = setInterval(updateStats, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="rte-spell-check-panel">
      <div className="spellcheck-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Spell Check</h3>
        <button
          className="rte-spellcheck-close"
          onClick={onClose}
          aria-label="Close spell check panel"
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', marginLeft: 8 }}
        >
          ✕
        </button>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="label">Total Words:</span>
          <span className="value">{stats.total}</span>
        </div>
        <div className="stat">
          <span className="label">Misspelled:</span>
          <span className="value error">{stats.misspelled}</span>
        </div>
        <div className="stat">
          <span className="label">Accuracy:</span>
          <span className="value success">{stats.accuracy.toFixed(1)}%</span>
        </div>
      </div>
      <MisspellingsList isVisible={isVisible} />
    </div>
  );
};

/**
 * Misspellings List
 */
const MisspellingsList: React.FC<{
  isVisible: boolean;
}> = ({ isVisible }) => {
  const [misspellings, setMisspellings] = useState<any[]>([]);
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isVisible) {
      const updateMisspellings = () => {
        const results = scanDocumentForMisspellings();
        setMisspellings(results);
      };

      updateMisspellings();
      const interval = setInterval(updateMisspellings, 1000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const toggleExpanded = (word: string) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(word)) {
      newExpanded.delete(word);
    } else {
      newExpanded.add(word);
    }
    setExpandedWords(newExpanded);
  };

  const handleReplace = (issue: any, newWord: string) => {
    replaceWord(issue, newWord);
    setMisspellings(scanDocumentForMisspellings());
  };

  const handleIgnore = (word: string) => {
    ignoreWord(word);
    setMisspellings(scanDocumentForMisspellings());
  };

  const handleAddToDictionary = (word: string) => {
    addToDictionary(word);
    setMisspellings(scanDocumentForMisspellings());
  };

  return (
    <div className="misspellings-list">
      {misspellings.length === 0 ? (
        <div className="empty">No spelling errors found</div>
      ) : (
        misspellings.map((result, idx) => (
          <div key={idx} className="misspelling-item">
            <div className="word-header">
              <span className="word">{result.word}</span>
              <button
                className="expand"
                onClick={() => toggleExpanded(result.word)}
              >
                {expandedWords.has(result.word) ? '▼' : '▶'}
              </button>
            </div>

            {expandedWords.has(result.word) && (
              <div className="suggestions">
                {result.suggestions.length > 0 ? (
                  <>
                    <div className="suggestions-label">Suggestions:</div>
                    {result.suggestions.map((suggestion: string, i: number) => (
                      <button
                        key={i}
                        className="suggestion-btn"
                        onClick={() => handleReplace(result, suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="no-suggestions">No suggestions</div>
                )}

                <div className="actions">
                  <button
                    className="action-btn ignore"
                    onClick={() => handleIgnore(result.word)}
                  >
                    Ignore
                  </button>
                  <button
                    className="action-btn add"
                    onClick={() => handleAddToDictionary(result.word)}
                  >
                    Add to Dictionary
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

/**
 * Spell Check Plugin Provider
 */
interface SpellCheckPluginProviderProps {
  children?: React.ReactNode;
}

export const SpellCheckPluginProvider: React.FC<SpellCheckPluginProviderProps> = ({ children }) => {
  const [isSpellCheckEnabled, setIsSpellCheckEnabled] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);

  // Attach context menu once
  useEffect(() => {
    attachSpellCheckContextMenu();
  }, []);

  // Debounced highlight function
  const debouncedHighlight = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (isSpellCheckEnabled) highlightMisspelledWords();
    }, 350);
  };

  // MutationObserver for incremental spell check
  useEffect(() => {
    const editor = document.querySelector('[contenteditable="true"]');
    if (!editor) return;
    if (observerRef.current) observerRef.current.disconnect();
    if (!isSpellCheckEnabled) return;
    observerRef.current = new MutationObserver((mutations) => {
      // Only trigger on text/content changes
      if (mutations.some(m => m.type === 'characterData' || m.type === 'childList')) {
        debouncedHighlight();
      }
    });
    observerRef.current.observe(editor, {
      characterData: true,
      childList: true,
      subtree: true
    });
    return () => observerRef.current?.disconnect();
  }, [isSpellCheckEnabled]);

  // Register toggle command and initial highlight
  useEffect(() => {
    (window as any).registerEditorCommand?.('toggleSpellCheck', () => {
      setIsSpellCheckEnabled(prev => {
        const next = !prev;
        if (next) highlightMisspelledWords();
        else clearSpellCheckHighlights();
        return next;
      });
    });
    // Initial highlight if enabled
    if (isSpellCheckEnabled) highlightMisspelledWords();
    else clearSpellCheckHighlights();
  }, [isSpellCheckEnabled]);

  // Handler for close button
  const handleClosePanel = () => {
    setIsSpellCheckEnabled(false);
  };

  return (
    <>
      {children}
      <SpellCheckStatsPanel isVisible={isSpellCheckEnabled} onClose={handleClosePanel} />
      <style>{`
        .rte-spell-check-panel {
          position: absolute;
          right: 0;
          top: 0;
          width: 350px;
          height: 100%;
          background: white;
          border-left: 1px solid #ddd;
          box-shadow: -2px 0 4px rgba(0,0,0,0.1);
          overflow-y: auto;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
        }
        .rte-spellcheck-close:hover {
          color: #d32f2f;
        }

        .rte-spell-check-panel h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 600;
        }

        .stats {
          display: flex;
          gap: 24px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat .label {
          font-size: 12px;
          color: #999;
        }

        .stat .value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .stat .value.error {
          color: #d32f2f;
        }

        .stat .value.success {
          color: #388e3c;
        }

        .misspellings-list {
          max-height: 100%;
          overflow-y: auto;
        }

        .misspelling-item {
          padding: 8px;
          margin-bottom: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }

        .word-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }

        .word {
          font-weight: 600;
          color: #d32f2f;
        }

        .expand {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
        }

        .suggestions {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ddd;
        }

        .suggestions-label {
          font-size: 12px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
        }

        .suggestion-btn {
          display: inline-block;
          margin-right: 6px;
          margin-bottom: 6px;
          padding: 4px 8px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
        }

        .suggestion-btn:hover {
          background-color: #1565c0;
        }

        .no-suggestions {
          font-size: 12px;
          color: #999;
          margin-bottom: 8px;
        }

        .actions {
          margin-top: 8px;
          display: flex;
          gap: 6px;
        }

        .action-btn {
          font-size: 12px;
          padding: 4px 8px;
          background-color: white;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
        }

        .action-btn:hover {
          background-color: #f0f0f0;
        }

        .empty {
          padding: 12px;
          text-align: center;
          color: #999;
          font-size: 13px;
        }

        .rte-misspelled {
          position: relative;
          cursor: pointer;
        }

        .rte-misspelled:hover {
          background-color: #ffe082;
        }
      `}</style>
    </>
  );
};

export default SpellCheckStatsPanel;
