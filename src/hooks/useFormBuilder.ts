import { useContext } from 'react';
import { FormBuilderContext } from '../context/formBuilderContextDef';
import type { FormBuilderContextType } from '../context/formBuilderContextDef';

export function useFormBuilder(): FormBuilderContextType {
  const context = useContext(FormBuilderContext);
  if (!context) {
    throw new Error('useFormBuilder must be used within a FormBuilderProvider');
  }
  return context;
}

export type { FormBuilderContextType };
