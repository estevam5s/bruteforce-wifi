import React from 'react';
import '../styles/CodeEditor.css';

const CodeEditor = ({ value, onChange, language = 'python', readOnly = false }) => {
  const handleChange = (e) => {
    if (!readOnly && onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e) => {
    if (readOnly) return;

    // Tab key support
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      // Set cursor position after tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className={`code-editor ${readOnly ? 'read-only' : ''}`}>
      <div className="editor-header">
        <span className="language-badge">{language}</span>
        {readOnly && <span className="read-only-badge">Somente Leitura</span>}
      </div>
      <textarea
        className="code-textarea"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        readOnly={readOnly}
        spellCheck={false}
        placeholder={readOnly ? '' : '# Digite seu código aqui...'}
      />
      <div className="editor-footer">
        <span className="line-count">{value.split('\n').length} linhas</span>
        <span className="char-count">{value.length} caracteres</span>
      </div>
    </div>
  );
};

export default CodeEditor;
