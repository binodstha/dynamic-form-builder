import { useState, useCallback, useMemo } from 'react';
import type { BaseField, FormConfig, ValidationErrors } from '../types/form';

export interface UseFormPreviewReturn {
  values: Record<string, string>;
  errors: ValidationErrors;
  touched: Record<string, boolean>;
  isSubmitted: boolean;
  submittedPayload: Record<string, unknown> | null;
  handleChange: (fieldId: string, val: string) => void;
  handleBlur: (fieldId: string) => void;
  handleSubmit: (e?: React.FormEvent) => boolean;
  resetForm: () => void;
  clearSubmission: () => void;
}

function validateFieldRecursive(
  field: BaseField,
  values: Record<string, string>,
  errors: ValidationErrors
) {
  const rawValue = values[field.id] !== undefined ? values[field.id].trim() : '';

  if (field.type === 'group') {
    // Validate all child fields recursively
    (field.fields || []).forEach((child) => validateFieldRecursive(child, values, errors));
    return;
  }

  // Required check
  if (field.required && rawValue === '') {
    errors[field.id] = `${field.label || 'Field'} is required.`;
    return;
  }

  // Type-specific validation for numbers
  if (field.type === 'number' && rawValue !== '') {
    const num = Number(rawValue);
    if (isNaN(num)) {
      errors[field.id] = 'Must be a valid number.';
      return;
    }

    if (field.min !== undefined && num < field.min) {
      errors[field.id] = `Value must be at least ${field.min}.`;
      return;
    }

    if (field.max !== undefined && num > field.max) {
      errors[field.id] = `Value cannot exceed ${field.max}.`;
      return;
    }
  }
}

function computeAllErrors(fields: BaseField[], values: Record<string, string>): ValidationErrors {
  const errors: ValidationErrors = {};
  fields.forEach((field) => validateFieldRecursive(field, values, errors));
  return errors;
}

function buildNestedSubmissionPayload(
  fields: BaseField[],
  values: Record<string, string>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const key = field.name || field.id;

    if (field.type === 'group') {
      payload[key] = buildNestedSubmissionPayload(field.fields || [], values);
    } else {
      const val = values[field.id];
      if (val === undefined || val === '') {
        payload[key] = null;
      } else if (field.type === 'number') {
        const num = Number(val);
        payload[key] = isNaN(num) ? val : num;
      } else {
        payload[key] = val;
      }
    }
  }

  return payload;
}

export function useFormPreview(config: FormConfig): UseFormPreviewReturn {
  const [values, setValues] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedPayload, setSubmittedPayload] = useState<Record<string, unknown> | null>(null);

  // Compute live validation errors whenever values or form structure change
  const errors = useMemo(() => {
    return computeAllErrors(config.fields, values);
  }, [config.fields, values]);

  const handleChange = useCallback((fieldId: string, val: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: val,
    }));
  }, []);

  const handleBlur = useCallback((fieldId: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldId]: true,
    }));
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent): boolean => {
      if (e) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const markAllTouched: Record<string, boolean> = {};
      const collectAllFieldIds = (fields: BaseField[]) => {
        for (const f of fields) {
          markAllTouched[f.id] = true;
          if (f.type === 'group') {
            collectAllFieldIds(f.fields || []);
          }
        }
      };
      collectAllFieldIds(config.fields);
      setTouched(markAllTouched);
      setIsSubmitted(true);

      const currentErrors = computeAllErrors(config.fields, values);
      const hasErrors = Object.keys(currentErrors).length > 0;

      if (!hasErrors) {
        const payload = buildNestedSubmissionPayload(config.fields, values);
        setSubmittedPayload(payload);
        return true;
      }

      setSubmittedPayload(null);
      return false;
    },
    [config.fields, values]
  );

  const resetForm = useCallback(() => {
    setValues({});
    setTouched({});
    setIsSubmitted(false);
    setSubmittedPayload(null);
  }, []);

  const clearSubmission = useCallback(() => {
    setSubmittedPayload(null);
  }, []);

  return {
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
  };
}
