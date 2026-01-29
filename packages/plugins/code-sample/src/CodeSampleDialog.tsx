import React, { useState, useRef, useEffect } from 'react';
import { toast } from '@editora/toast';
import './CodeSampleDialog.css';

interface CodeSampleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (code: string, language: string) => void;
  editingCodeId?: string;
  editingCode?: string;
  editingLanguage?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'shell', label: 'Shell' },
  { value: 'plaintext', label: 'Plain Text' }
];

export const CodeSampleDialog: React.FC<CodeSampleDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCodeId,
  editingCode = '',
  editingLanguage = 'javascript'
}) => {
  const [language, setLanguage] = useState(editingLanguage);
  const [code, setCode] = useState(editingCode);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!editingCodeId;

  useEffect(() => {
    if (isOpen) {
      setLanguage(editingLanguage);
      setCode(editingCode);
      setError(null);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen, editingCode, editingLanguage]);

  const handleSave = () => {
    if (!code.trim()) {
      setError('Code cannot be empty');
      toast.error('Code cannot be empty');
      return;
    }

    try {
      onSave(code, language);
      setCode('');
      setLanguage('javascript');
      setError(null);
      toast.success(isEditing ? 'Code sample updated' : 'Code sample inserted');
      onClose();
    } catch (err) {
      const errorMsg = 'Failed to save code sample';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error(err);
    }
  };

  const handleCancel = () => {
    setCode('');
    setLanguage('javascript');
    setError(null);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="code-sample-overlay">
      <div className="code-sample-dialog">
        <div className="code-sample-header">
          <h2>{isEditing ? 'Edit Code Sample' : 'Insert Code Sample'}</h2>
          <button className="close-btn" onClick={handleCancel} aria-label="Close">×</button>
        </div>

        <div className="code-sample-body">
          <div className="form-group">
            <label htmlFor="language-select">Language</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="code-textarea">Code</label>
            <textarea
              ref={textareaRef}
              id="code-textarea"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Paste or type your code here..."
              className={`code-textarea ${error ? 'error' : ''}`}
              spellCheck="false"
            />
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="code-sample-help">
            <small>💡 Tip: Press Ctrl+Enter (or Cmd+Enter on Mac) to save, or Escape to cancel</small>
          </div>
        </div>

        <div className="code-sample-footer">
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEditing ? 'Update Code Sample' : 'Insert Code Sample'}
          </button>
        </div>
      </div>
    </div>
  );
};
