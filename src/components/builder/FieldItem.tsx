import React from "react";
import type { BaseField } from "../../types/form";
import { useFormBuilder } from "../../hooks/useFormBuilder";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  CopyIcon,
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "../ui/Icons";
import { AddFieldMenu } from "./AddFieldMenu";

interface FieldItemProps {
  field: BaseField;
  isFirst: boolean;
  isLast: boolean;
  depth?: number;
}

export const FieldItem: React.FC<FieldItemProps> = React.memo(
  ({ field, isFirst, isLast, depth = 0 }) => {
    const {
      updateField,
      deleteField,
      moveField,
      duplicateField,
      collapsedGroups,
      toggleGroupCollapse,
    } = useFormBuilder();

    const isGroup = field.type === "group";
    const isGroupCollapsed = isGroup ? !!collapsedGroups[field.id] : false;
    const groupFields = field.fields || [];

    const handleAddOption = () => {
      const currentOptions = field.options || [];
      const newOption = `Option ${currentOptions.length + 1}`;
      updateField(field.id, { options: [...currentOptions, newOption] });
    };

    const handleUpdateOption = (index: number, value: string) => {
      const currentOptions = [...(field.options || [])];
      currentOptions[index] = value;
      updateField(field.id, { options: currentOptions });
    };

    const handleDeleteOption = (index: number) => {
      const currentOptions = (field.options || []).filter(
        (_, i) => i !== index,
      );
      updateField(field.id, { options: currentOptions });
    };

    return (
      <div
        className={`field-item-card ${isGroup ? "is-group" : ""} depth-${Math.min(depth, 4)}`}
        style={{ marginLeft: depth > 0 ? `${depth * 14}px` : undefined }}
      >
        {/* Header Bar */}
        <div className="field-item-header">
          <div className="field-item-left">
            {isGroup ? (
              <button
                type="button"
                className="icon-button collapse-btn"
                onClick={() => toggleGroupCollapse(field.id)}
                title={isGroupCollapsed ? "Expand group" : "Collapse group"}
              >
                {isGroupCollapsed ? (
                  <ChevronRightIcon size={14} />
                ) : (
                  <ChevronDownIcon size={14} />
                )}
              </button>
            ) : null}

            <span className="field-title-preview" title={field.label}>
              {field.label || <em>Untitled field</em>}
            </span>

            <span className="field-type-tag">{field.type}</span>

            {field.required && (
              <span className="field-required-tag">Required</span>
            )}

            {isGroup && (
              <span className="field-group-count">
                {(field.fields || []).length}{" "}
                {(field.fields || []).length === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          <div className="field-item-actions">
            {/* Move Up */}
            <button
              type="button"
              className="icon-button"
              onClick={() => moveField(field.id, "up")}
              disabled={isFirst}
              title="Move field up"
            >
              <ArrowUpIcon size={14} />
            </button>

            {/* Move Down */}
            <button
              type="button"
              className="icon-button"
              onClick={() => moveField(field.id, "down")}
              disabled={isLast}
              title="Move field down"
            >
              <ArrowDownIcon size={14} />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              className="icon-button"
              onClick={() => duplicateField(field.id)}
              title="Duplicate field"
            >
              <CopyIcon size={14} />
            </button>

            {/* Delete */}
            <button
              type="button"
              className="icon-button danger"
              onClick={() => deleteField(field.id)}
              title="Delete field"
            >
              <TrashIcon size={14} />
            </button>
          </div>
        </div>

        {/* Field Property Editor */}
        <div className="field-item-body">
          <div className="form-grid">
            {/* Label input */}
            <div className="form-field-group">
              <label className="form-label" htmlFor={`label-${field.id}`}>
                Field Label
              </label>
              <input
                id={`label-${field.id}`}
                type="text"
                className="input-text"
                value={field.label}
                onChange={(e) =>
                  updateField(field.id, { label: e.target.value })
                }
                placeholder="Enter field label..."
              />
            </div>

            {/* Programmatic Key / Name */}
            <div className="form-field-group">
              <label className="form-label" htmlFor={`name-${field.id}`}>
                Key / Name
              </label>
              <input
                id={`name-${field.id}`}
                type="text"
                className="input-text monospace"
                value={field.name}
                onChange={(e) =>
                  updateField(field.id, {
                    name: e.target.value.replace(/\s+/g, "_"),
                  })
                }
                placeholder="uniqueKey"
              />
            </div>

            {/* Required Checkbox / Toggle */}
            <div className="form-field-group checkbox-group">
              <label className="checkbox-label" htmlFor={`req-${field.id}`}>
                <input
                  id={`req-${field.id}`}
                  type="checkbox"
                  className="checkbox-input"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(field.id, { required: e.target.checked })
                  }
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">Required field</span>
              </label>
            </div>

            {/* Number Specific Properties: Min & Max */}
            {field.type === "number" && (
              <>
                <div className="form-field-group">
                  <label className="form-label" htmlFor={`min-${field.id}`}>
                    Minimum Value (Optional)
                  </label>
                  <input
                    id={`min-${field.id}`}
                    type="number"
                    className="input-text"
                    value={field.min !== undefined ? field.min : ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      updateField(field.id, { min: val });
                    }}
                    placeholder="e.g. 0"
                  />
                </div>

                <div className="form-field-group">
                  <label className="form-label" htmlFor={`max-${field.id}`}>
                    Maximum Value (Optional)
                  </label>
                  <input
                    id={`max-${field.id}`}
                    type="number"
                    className="input-text"
                    value={field.max !== undefined ? field.max : ""}
                    onChange={(e) => {
                      const val =
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value);
                      updateField(field.id, { max: val });
                    }}
                    placeholder="e.g. 100"
                  />
                </div>
              </>
            )}

            {(field.type === "checkbox" ||
              field.type === "radio" ||
              field.type === "select") && (
              <div className="form-field-group full-width">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Options ({field.options?.length || 0})
                  </label>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={handleAddOption}
                  >
                    <PlusIcon size={12} />
                    <span>Add Option</span>
                  </button>
                </div>

                {!field.options || field.options.length === 0 ? (
                  <div className="empty-group-box">
                    <span>No options configured yet.</span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {field.options.map((option, idx) => (
                      <div key={idx} className="option-item">
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            minWidth: "20px",
                            textAlign: "center",
                          }}
                        >
                          {idx + 1}.
                        </span>
                        <input
                          type="text"
                          className="input-text"
                          value={option}
                          onChange={(e) =>
                            handleUpdateOption(idx, e.target.value)
                          }
                          placeholder={`Option ${idx + 1}`}
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="icon-button danger"
                          onClick={() => handleDeleteOption(idx)}
                          title="Remove option"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Placeholder for non-group fields */}
            {field.type !== "group" && (
              <div className="form-field-group full-width">
                <label
                  className="form-label"
                  htmlFor={`placeholder-${field.id}`}
                >
                  Placeholder
                </label>
                <input
                  id={`placeholder-${field.id}`}
                  type="text"
                  className="input-text"
                  value={field.placeholder || ""}
                  onChange={(e) =>
                    updateField(field.id, { placeholder: e.target.value })
                  }
                  placeholder="e.g. Placeholder hint..."
                />
              </div>
            )}
          </div>

          {/* Group Children Section */}
          {isGroup && (
            <div
              className={`group-children-container ${isGroupCollapsed ? "collapsed" : ""}`}
            >
              {!isGroupCollapsed && (
                <>
                  <div className="group-children-header">
                    <span className="group-children-title">
                      Group Fields ({groupFields.length})
                    </span>

                    <AddFieldMenu fieldId={field.id} />
                  </div>

                  {groupFields.length === 0 ? (
                    <div className="empty-group-box">
                      <p>This group has no fields yet.</p>
                    </div>
                  ) : (
                    <div className="group-field-list">
                      {groupFields.map((child, idx) => (
                        <FieldItem
                          key={child.id}
                          field={child}
                          isFirst={idx === 0}
                          isLast={idx === groupFields.length - 1}
                          depth={depth + 1}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  },
);
FieldItem.displayName = "FieldItem";
