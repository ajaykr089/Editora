import React, { useState, useMemo } from 'react';
import './SpecialCharactersDialog.css';

interface SpecialCharactersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (character: string) => void;
}
import { characterSets, descriptions, type CharacterCategory } from './Constants';

export const SpecialCharactersDialog: React.FC<SpecialCharactersDialogProps> = ({
  isOpen,
  onClose,
  onInsert
}) => {
  const [activeTab, setActiveTab] = useState<CharacterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentCharacters = useMemo(() => {
    const characters = characterSets[activeTab].characters;

    if (!searchQuery.trim()) {
      return characters;
    }

    // Filter characters based on search query
    return characters.filter(char => {
      // Search by character itself
      if (char.toLowerCase().includes(searchQuery.toLowerCase())) {
        return true;
      }

      // Search by Unicode name/description (comprehensive)


      const description = descriptions[char] || '';
      return description.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [activeTab, searchQuery]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="special-characters-overlay" onClick={handleOverlayClick}>
      <div className="special-characters-dialog">
        <div className="special-characters-header">
          <h2>Insert Special Characters</h2>
          <button className="special-characters-close" onClick={onClose}>×</button>
        </div>

        <div className="special-characters-content">
          <div className="special-characters-tabs">
            {(Object.keys(characterSets) as CharacterCategory[]).map((category) => (
              <button
                key={category}
                className={`special-characters-tab ${activeTab === category ? 'active' : ''}`}
                onClick={() => setActiveTab(category)}
              >
                {characterSets[category].name}
              </button>
            ))}
          </div>

          <div className="special-characters-main-content">
            <div className="special-characters-search">
              <input
                type="text"
                placeholder="Search characters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="special-characters-search-input"
              />
            </div>

            <div className="special-characters-grid">
              {currentCharacters.map((char, index) => (
                <button
                  key={`${activeTab}-${index}`}
                  className="special-characters-item"
                  onClick={() => onInsert(char)}
                  title={`Insert ${char}`}
                >
                  {char}
                </button>
              ))}
              {currentCharacters.length === 0 && searchQuery && (
                <div className="special-characters-no-results">
                  No characters found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
