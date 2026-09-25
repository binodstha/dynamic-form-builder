import React from 'react';
import type { BaseField } from '../../types/form';
import { AlertCircleIcon, FolderIcon } from '../ui/Icons';

interface PreviewFieldProps {
  field: BaseField;
  values: Record<string, string>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onChange: (fieldId: string, val: string) => void;
  onBlur: (fieldId: string) => void;
  depth?: number;
}

export const PreviewField: React.FC<PreviewFieldProps> = React.memo(
  ({ field, values, errors, touched, onChange, onBlur, depth = 0 }) => {
    const error = errors[field.id];
    const isTouched = touched[field.id];
    const showError = isTouched && !!error;
    const value = values[field.id] ?? '';

    if (field.type === 'group') {
      return (
        <fieldset
          className={`preview-group-fieldset depth-${Math.min(depth, 4)}`}
          style={{
            marginLeft: depth > 0 ? `${depth * 10}px` : undefined,
          }}
        >
          <legend className="preview-group-legend">
            <FolderIcon size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{field.label || 'Untitled Group'}</span>
            {field.required && <span className="required-star">*</span>}
          </legend>

          <div className="preview-group-content">
            {!field.fields || field.fields.length === 0 ? (
              <div className="preview-empty-group">
                <em>Empty group (no child fields)</em>
              </div>
            ) : (
              field.fields.map((child) => (
                <PreviewField
                  key={child.id}
                  field={child}
                  values={values}
                  errors={errors}
                  touched={touched}
                  onChange={onChange}
                  onBlur={onBlur}
                  depth={depth + 1}
                />
              ))
            )}
          </div>
        </fieldset>
      );
    }

    return (
      <div className={`preview-field-container ${showError ? 'has-error' : ''}`}>
        <label className="preview-label" htmlFor={`preview-${field.id}`}>
          <span className="label-text">{field.label || 'Untitled Field'}</span>
          {field.required && <span className="required-star" title="Required">*</span>}
          {field.type === 'number' && (field.min !== undefined || field.max !== undefined) && (
            <span className="preview-range-hint">
              {field.min !== undefined && field.max !== undefined
                ? `[${field.min} to ${field.max}]`
                : field.min !== undefined
                ? `[min ${field.min}]`
                : `[max ${field.max}]`}
            </span>
          )}
        </label>

        {field.type === 'text' && (
          <input
            id={`preview-${field.id}`}
            type="text"
            className={`preview-input ${showError ? 'input-error' : ''}`}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            aria-invalid={showError}
            aria-describedby={showError ? `err-${field.id}` : undefined}
          />
        )}

        {field.type === 'number' && (
          <input
            id={`preview-${field.id}`}
            type="number"
            className={`preview-input ${showError ? 'input-error' : ''}`}
            placeholder={field.placeholder || (field.min !== undefined ? `Min ${field.min}` : '0')}
            min={field.min}
            max={field.max}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            aria-invalid={showError}
            aria-describedby={showError ? `err-${field.id}` : undefined}
          />
        )}

        {field.type === 'textarea' && (
          <textarea
            id={`preview-${field.id}`}
            className={`preview-input ${showError ? 'input-error' : ''}`}
            placeholder={field.placeholder || ''}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            rows={3}
            aria-invalid={showError}
            aria-describedby={showError ? `err-${field.id}` : undefined}
          />
        )}

        {field.type === 'select' && (
          <select
            id={`preview-${field.id}`}
            className={`preview-input ${showError ? 'input-error' : ''}`}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            aria-invalid={showError}
            aria-describedby={showError ? `err-${field.id}` : undefined}
          >
            <option value="">{field.placeholder || '-- Select an option --'}</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {field.type === 'radio' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {(!field.options || field.options.length === 0) ? (
              <em style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No options defined</em>
            ) : (
              field.options.map((opt, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                  <input
                    type="radio"
                    name={`radio-${field.id}`}
                    value={opt}
                    checked={value === opt}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    onBlur={() => onBlur(field.id)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        )}

        {field.type === 'checkbox' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {(!field.options || field.options.length === 0) ? (
              <em style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No options defined</em>
            ) : (
              field.options.map((opt, i) => {
                const selected = value ? value.split(',').filter(Boolean) : [];
                const isChecked = selected.includes(opt);
                return (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input
                      type="checkbox"
                      value={opt}
                      checked={isChecked}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selected, opt]
                          : selected.filter((v) => v !== opt);
                        onChange(field.id, updated.join(','));
                      }}
                      onBlur={() => onBlur(field.id)}
                    />
                    <span>{opt}</span>
                  </label>
                );
              })
            )}
          </div>
        )}

        {showError && (
          <div className="preview-error-message" id={`err-${field.id}`} role="alert">
            <AlertCircleIcon size={14} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
PreviewField.displayName = 'PreviewField';
