import React, { useState, useMemo } from 'react';
import './EmojisDialog.css';

interface EmojisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (emoji: string) => void;
}
import { emojisSets, descriptions, type EmojiCategory } from './Constants';

export const EmojisDialog: React.FC<EmojisDialogProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [activeTab, setActiveTab] = useState<EmojiCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentEmojis = useMemo(() => {
    const emojis = emojisSets[activeTab].emojis;

    if (!searchQuery.trim()) {
      return emojis;
    }

    // Filter emojis based on search query
    return emojis.filter(emoji => {
      // Search by emoji itself
      if (emoji.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }

      // Search by Unicode name/description (comprehensive)
      const description = descriptions[emoji] || '';
      return description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeTab, searchQuery]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="emojis-overlay" onClick={handleOverlayClick}>
      <div className="emojis-dialog">
        <div className="emojis-header">
          <h2>Insert Emojis</h2>
          <button className="emojis-close" onClick={onClose}>×</button>
        </div>

        <div className="emojis-content">
          <div className="emojis-tabs">
            {(Object.keys(emojisSets) as EmojiCategory[]).map((category) => (
              <button
                key={category}
                className={`emojis-tab ${activeTab === category ? 'active' : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {emojisSets[category].name}
              </button>
            ))}
          </div>

          <div className="emojis-main-content">
            <div className="emojis-search">
              <input
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="emojis-search-input"
              />
            </div>

            <div className="emojis-grid">
              {currentEmojis.map((emoji, index) => (
                <button
                  key={`${activeTab}-${index}`}
                  className="emojis-item"
                  onClick={() => onInsert(emoji)}
                  title={`Insert ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
              {currentEmojis.length === 0 && searchQuery && (
                <div className="emojis-no-results">
                  No emojis found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
