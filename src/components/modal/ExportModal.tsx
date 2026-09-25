import React, { useState } from 'react';
import type { FormConfig } from '../../types/form';
import { CloseIcon, CopyIcon, CheckIcon, DownloadIcon, CodeIcon } from '../ui/Icons';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FormConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, config }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(config, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.id || 'form-config'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <CodeIcon size={18} />
            </div>
            <div>
              <h3>Export Form Configuration</h3>
              <p className="modal-subtitle">
                Complete JSON schema representation of the current form structure and fields.
              </p>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} title="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="json-editor-wrap">
            <div className="json-editor-toolbar">
              <span className="json-badge">JSON Schema</span>
              <span className="json-meta">{jsonString.length} characters</span>
            </div>
            <textarea
              className="json-textarea readonly monospace"
              readOnly
              value={jsonString}
              rows={16}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleDownload}>
            <DownloadIcon size={16} />
            <span>Download JSON</span>
          </button>

          <button type="button" className="btn btn-primary" onClick={handleCopy}>
            {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
