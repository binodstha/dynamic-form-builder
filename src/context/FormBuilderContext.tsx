import React, { useState, useCallback, useMemo } from "react";
import type { FormConfig, FieldType, BaseField } from "../types/form";
import {
  DEFAULT_FORM_CONFIG,
  DEFAULT_FORM_TYPES,
} from "../utils/defaultTemplates";
import { FormBuilderContext } from "./formBuilderContextDef";

function generateId(prefix: string = "f"): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}

function createDefaultField(type: FieldType): BaseField {
  const id = generateId();

  const newField = DEFAULT_FORM_TYPES.find((field) => field.type === type);

  if (!newField) {
    throw new Error(`Field type ${type} not found`);
  }
  return { ...newField, id } as BaseField;
}

function cloneNodeWithNewIds(node: BaseField): BaseField {
  const newId = generateId();
  if (node.type === "group") {
    return {
      ...node,
      id: newId,
      name: `${node.name}_copy`,
      label: `${node.label} (Copy)`,
      fields: (node.fields || []).map(cloneNodeWithNewIds),
    };
  }
  return {
    ...node,
    id: newId,
    name: `${node.name}_copy`,
    label: `${node.label} (Copy)`,
  };
}

// Recursive tree helpers
function addNodeRecursive(
  nodes: BaseField[],
  parentId: string | null,
  newNode: BaseField,
): BaseField[] {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map((node) => {
    if (node.id === parentId && node.type === "group") {
      return {
        ...node,
        fields: [...(node.fields || []), newNode],
      };
    }
    if (node.type === "group") {
      return {
        ...node,
        fields: addNodeRecursive(node.fields || [], parentId, newNode),
      };
    }
    return node;
  });
}

function updateNodeRecursive(
  nodes: BaseField[],
  id: string,
  updates: Partial<BaseField>,
): BaseField[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates } as BaseField;
    }
    if (node.type === "group") {
      return {
        ...node,
        fields: updateNodeRecursive(node.fields || [], id, updates),
      };
    }
    return node;
  });
}

function deleteNodeRecursive(nodes: BaseField[], id: string): BaseField[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.type === "group") {
        return {
          ...node,
          fields: deleteNodeRecursive(node.fields || [], id),
        };
      }
      return node;
    });
}

function moveNodeRecursive(
  nodes: BaseField[],
  id: string,
  direction: "up" | "down",
): BaseField[] {
  const index = nodes.findIndex((node) => node.id === id);
  if (index !== -1) {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= nodes.length) {
      return nodes; // cannot move beyond bounds
    }
    const newNodes = [...nodes];
    const [moved] = newNodes.splice(index, 1);
    newNodes.splice(targetIndex, 0, moved);
    return newNodes;
  }

  return nodes.map((node) => {
    if (node.type === "group") {
      return {
        ...node,
        fields: moveNodeRecursive(node.fields || [], id, direction),
      };
    }
    return node;
  });
}

function duplicateNodeRecursive(nodes: BaseField[], id: string): BaseField[] {
  const index = nodes.findIndex((node) => node.id === id);
  if (index !== -1) {
    const cloned = cloneNodeWithNewIds(nodes[index]);
    const newNodes = [...nodes];
    newNodes.splice(index + 1, 0, cloned);
    return newNodes;
  }

  return nodes.map((node) => {
    if (node.type === "group") {
      return {
        ...node,
        fields: duplicateNodeRecursive(node.fields || [], id),
      };
    }
    return node;
  });
}

function collectGroupIds(nodes: BaseField[]): string[] {
  const ids: string[] = [];
  for (const node of nodes) {
    if (node.type === "group") {
      ids.push(node.id);
      ids.push(...collectGroupIds(node.fields || []));
    }
  }
  return ids;
}

export const FormBuilderProvider: React.FC<{
  initialConfig?: FormConfig;
  children: React.ReactNode;
}> = ({ initialConfig = DEFAULT_FORM_CONFIG, children }) => {
  const [config, setConfig] = useState<FormConfig>(initialConfig);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});

  const addField = useCallback((parentId: string | null, type: FieldType) => {
    const newField = createDefaultField(type);
    setConfig((prev) => ({
      ...prev,
      fields: addNodeRecursive(prev.fields, parentId, newField),
    }));
    // If adding to a collapsed group, uncollapse it automatically
    if (parentId) {
      setCollapsedGroups((prev) => ({ ...prev, [parentId]: false }));
    }
  }, []);

  const updateField = useCallback((id: string, updates: Partial<BaseField>) => {
    setConfig((prev) => ({
      ...prev,
      fields: updateNodeRecursive(prev.fields, id, updates),
    }));
  }, []);

  const deleteField = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: deleteNodeRecursive(prev.fields, id),
    }));
  }, []);

  const moveField = useCallback((id: string, direction: "up" | "down") => {
    setConfig((prev) => ({
      ...prev,
      fields: moveNodeRecursive(prev.fields, id, direction),
    }));
  }, []);

  const duplicateField = useCallback((id: string) => {
    setConfig((prev) => ({
      ...prev,
      fields: duplicateNodeRecursive(prev.fields, id),
    }));
  }, []);

  const toggleGroupCollapse = useCallback((groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  }, []);

  const collapseAllGroups = useCallback(() => {
    const allGroupIds = collectGroupIds(config.fields);
    const newMap: Record<string, boolean> = {};
    for (const gid of allGroupIds) {
      newMap[gid] = true;
    }
    setCollapsedGroups(newMap);
  }, [config.fields]);

  const expandAllGroups = useCallback(() => {
    setCollapsedGroups({});
  }, []);

  const updateFormMeta = useCallback((title: string, description?: string) => {
    setConfig((prev) => ({
      ...prev,
      title,
      description,
    }));
  }, []);

  const importConfig = useCallback((newConfig: FormConfig) => {
    setConfig(newConfig);
    setCollapsedGroups({});
  }, []);

  const resetConfig = useCallback(
    (newConfig: FormConfig = DEFAULT_FORM_CONFIG) => {
      setConfig(newConfig);
      setCollapsedGroups({});
    },
    [],
  );

  const value = useMemo(
    () => ({
      defaultFormTypes: DEFAULT_FORM_TYPES,
      config,
      collapsedGroups,
      addField,
      updateField,
      deleteField,
      moveField,
      duplicateField,
      toggleGroupCollapse,
      collapseAllGroups,
      expandAllGroups,
      updateFormMeta,
      importConfig,
      resetConfig,
    }),
    [
      config,
      collapsedGroups,
      addField,
      updateField,
      deleteField,
      moveField,
      duplicateField,
      toggleGroupCollapse,
      collapseAllGroups,
      expandAllGroups,
      updateFormMeta,
      importConfig,
      resetConfig,
    ],
  );

  return (
    <FormBuilderContext.Provider value={value}>
      {children}
    </FormBuilderContext.Provider>
  );
};
