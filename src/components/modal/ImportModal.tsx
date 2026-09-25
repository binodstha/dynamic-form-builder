import React, { useState } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { validateFormConfig } from '../../utils/schemaValidator';
import {
  CloseIcon,
  UploadIcon,
  CheckIcon,
  AlertCircleIcon,
} from '../ui/Icons';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importConfig } = useFormBuilder();
  const [jsonInput, setJsonInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonInput(text);
    setSuccessMessage('');

    if (!text.trim()) {
      setValidationErrors([]);
      setIsValidated(false);
      return;
    }

    const result = validateFormConfig(text);
    setIsValidated(true);
    setValidationErrors(result.errors);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      const result = validateFormConfig(content);
      setIsValidated(true);
      setValidationErrors(result.errors);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const result = validateFormConfig(jsonInput);
    if (!result.isValid || !result.sanitizedConfig) {
      setIsValidated(true);
      setValidationErrors(result.errors);
      return;
    }

    importConfig(result.sanitizedConfig);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <UploadIcon size={18} />
            </div>
            <div>
              <h3>Import Form Configuration</h3>
              <p className="modal-subtitle">
                Paste JSON, upload a configuration file, or choose from ready-to-use templates.
              </p>
            </div>
          </div>
          <button type="button" className="icon-button" onClick={onClose} title="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* JSON Textarea */}
          <div className="json-editor-wrap">
            <div className="json-editor-toolbar">
              <span className="json-badge">JSON Input</span>
              <label className="file-upload-btn">
                <UploadIcon size={13} />
                <span>Upload .json file</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            <textarea
              className={`json-textarea monospace ${
                isValidated && validationErrors.length > 0 ? 'input-error' : ''
              }`}
              value={jsonInput}
              onChange={handleTextChange}
              placeholder="Paste your form configuration JSON here..."
              rows={14}
            />
          </div>

          {/* Validation Feedback */}
          {isValidated && validationErrors.length === 0 && (
            <div className="validation-alert success">
              <CheckIcon size={16} />
              <span>Valid JSON schema! Ready to import.</span>
            </div>
          )}

          {successMessage && (
            <div className="validation-alert info">
              <span>{successMessage}</span>
            </div>
          )}

          {isValidated && validationErrors.length > 0 && (
            <div className="validation-alert error">
              <AlertCircleIcon size={16} />
              <div>
                <strong>Configuration Errors ({validationErrors.length}):</strong>
                <ul className="error-list">
                  {validationErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!jsonInput.trim() || validationErrors.length > 0}
          >
            <CheckIcon size={16} />
            <span>Import Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
