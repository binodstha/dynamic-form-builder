import React, { useState } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { useFormPreview } from '../../hooks/useFormPreview';
import { PreviewField } from './PreviewField';
import {
  EyeIcon,
  CheckIcon,
  RotateCcwIcon,
  AlertCircleIcon,
  CopyIcon,
  CloseIcon,
  CodeIcon,
} from '../ui/Icons';

export const LivePreviewPanel: React.FC = () => {
  const { config } = useFormBuilder();
  const {
    values,
    errors,
    touched,
    isSubmitted,
    submittedPayload,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    clearSubmission,
  } = useFormPreview(config);

  const [copiedPayload, setCopiedPayload] = useState(false);

  const totalErrors = Object.keys(errors).length;
  const hasFields = config.fields.length > 0;

  const handleCopyPayload = () => {
    if (submittedPayload) {
      navigator.clipboard.writeText(JSON.stringify(submittedPayload, null, 2));
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div className="preview-panel">
      {/* Preview Header */}
      <div className="preview-header">
        <div className="preview-header-left">
          <div className="preview-badge-live">
            <span className="dot pulse green" />
            <EyeIcon size={15} />
            <span>Live Preview</span>
          </div>
          <span className="preview-mode-tag">Interactive Client Form</span>
        </div>

        <div className="preview-header-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={resetForm}
            title="Reset preview form values"
          >
            <RotateCcwIcon size={14} />
            <span>Reset Form</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="preview-scroll-area">
        <div className="preview-card">
          <div className="preview-form-header">
            <h2 className="preview-title">{config.title || 'Untitled Form'}</h2>
            {config.description && (
              <p className="preview-description">{config.description}</p>
            )}
          </div>

          {!hasFields ? (
            <div className="preview-empty-state">
              <EyeIcon size={32} />
              <h4>No form fields to display</h4>
              <p>Add some fields in the Form Builder on the left to see them render here live.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="preview-form">
              <div className="preview-fields-stack">
                {config.fields.map((field) => (
                  <PreviewField
                    key={field.id}
                    field={field}
                    values={values}
                    errors={errors}
                    touched={touched}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    depth={0}
                  />
                ))}
              </div>

              {/* Form Validation Feedback Banner */}
              {isSubmitted && totalErrors > 0 && (
                <div className="preview-validation-banner error" role="alert">
                  <AlertCircleIcon size={16} />
                  <span>
                    Please correct the {totalErrors} highlighted error
                    {totalErrors > 1 ? 's' : ''} before submitting.
                  </span>
                </div>
              )}

              {/* Form Actions */}
              <div className="preview-submit-actions">
                <button type="submit" className="btn btn-primary btn-lg">
                  <CheckIcon size={16} />
                  <span>Submit Form</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={resetForm}
                >
                  <RotateCcwIcon size={16} />
                  <span>Clear</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Successful Submission Preview Card */}
        {submittedPayload && (
          <div className="submission-result-card animate-slide-up">
            <div className="submission-result-header">
              <div className="submission-result-title">
                <span className="success-icon-badge">
                  <CheckIcon size={16} />
                </span>
                <div>
                  <strong>Form Submitted Successfully!</strong>
                  <div className="sub-text">Validation passed. Submitted payload:</div>
                </div>
              </div>

              <div className="submission-result-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={handleCopyPayload}
                  title="Copy JSON payload"
                >
                  {copiedPayload ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  <span>{copiedPayload ? 'Copied!' : 'Copy JSON'}</span>
                </button>

                <button
                  type="button"
                  className="icon-button"
                  onClick={clearSubmission}
                  title="Dismiss"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>

            <div className="submission-json-preview">
              <div className="json-code-header">
                <CodeIcon size={14} />
                <span>Payload Data</span>
              </div>
              <pre>
                <code>{JSON.stringify(submittedPayload, null, 2)}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
