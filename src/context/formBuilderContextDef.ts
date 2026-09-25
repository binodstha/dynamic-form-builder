import { createContext } from 'react';
import type { FormConfig, FieldType, BaseField } from '../types/form';

export interface FormBuilderContextType {
  defaultFormTypes: BaseField[];
  config: FormConfig;
  collapsedGroups: Record<string, boolean>;
  addField: (parentId: string | null, type: FieldType) => void;
  updateField: (id: string, updates: Partial<BaseField>) => void;
  deleteField: (id: string) => void;
  moveField: (id: string, direction: 'up' | 'down') => void;
  duplicateField: (id: string) => void;
  toggleGroupCollapse: (groupId: string) => void;
  collapseAllGroups: () => void;
  expandAllGroups: () => void;
  updateFormMeta: (title: string, description?: string) => void;
  importConfig: (newConfig: FormConfig) => void;
  resetConfig: (newConfig?: FormConfig) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextType | undefined>(undefined);
