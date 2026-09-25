export type FieldType = 'text' | 'number' | 'textarea' | 'checkbox' | 'radio' | 'select' | 'group';

export interface BaseField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  description?: string;
  options?: string[];
  fields?: BaseField[];
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: BaseField[];
}

export type FormValuePrimitive = string | number | undefined | null;

export interface FormValues {
  [key: string]: FormValuePrimitive | FormValues;
}

export interface ValidationErrors {
  [fieldId: string]: string;
}
