import type { FormConfig, FieldType, BaseField } from '../types/form';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedConfig?: FormConfig;
}

const VALID_FIELD_TYPES: FieldType[] = ['text', 'number', 'group'];

function validateField(field: unknown, path: string, errors: string[]): field is BaseField {
  if (typeof field !== 'object' || field === null) {
    errors.push(`${path}: must be an object.`);
    return false;
  }

  const f = field as Record<string, unknown>;

  if (typeof f.id !== 'string' || !f.id.trim()) {
    errors.push(`${path}.id: must be a non-empty string.`);
  }

  if (typeof f.label !== 'string') {
    errors.push(`${path}.label: must be a string.`);
  }

  if (typeof f.required !== 'boolean') {
    errors.push(`${path}.required: must be a boolean.`);
  }

  if (!VALID_FIELD_TYPES.includes(f.type as FieldType)) {
    errors.push(`${path}.type: must be one of: ${VALID_FIELD_TYPES.join(', ')}.`);
    return false;
  }

  if (f.type === 'number') {
    if (f.min !== undefined && f.min !== null && typeof f.min !== 'number') {
      errors.push(`${path}.min: must be a number if specified.`);
    }
    if (f.max !== undefined && f.max !== null && typeof f.max !== 'number') {
      errors.push(`${path}.max: must be a number if specified.`);
    }
    if (typeof f.min === 'number' && typeof f.max === 'number' && f.min > f.max) {
      errors.push(`${path}: min (${f.min}) cannot be greater than max (${f.max}).`);
    }
  }

  if (f.type === 'group') {
    if (!Array.isArray(f.fields)) {
      errors.push(`${path}.fields: group must have an array of child fields.`);
    } else {
      f.fields.forEach((child, index) => {
        validateField(child, `${path}.fields[${index}]`, errors);
      });
    }
  }

  return errors.length === 0;
}

export function validateFormConfig(jsonStringOrObj: string | unknown): ValidationResult {
  const errors: string[] = [];
  let parsed: unknown;

  if (typeof jsonStringOrObj === 'string') {
    try {
      parsed = JSON.parse(jsonStringOrObj);
    } catch (err) {
      return {
        isValid: false,
        errors: [`Invalid JSON syntax: ${(err as Error).message}`],
      };
    }
  } else {
    parsed = jsonStringOrObj;
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return {
      isValid: false,
      errors: ['Configuration root must be an object.'],
    };
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.id !== 'string' || !obj.id.trim()) {
    errors.push('root.id: must be a non-empty string.');
  }

  if (typeof obj.title !== 'string' || !obj.title.trim()) {
    errors.push('root.title: must be a non-empty string.');
  }

  if (!Array.isArray(obj.fields)) {
    errors.push('root.fields: must be an array of fields.');
  } else {
    obj.fields.forEach((field, index) => {
      validateField(field, `root.fields[${index}]`, errors);
    });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    sanitizedConfig: parsed as FormConfig,
  };
}
