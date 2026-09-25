import React from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { FieldItem } from './FieldItem';
import { AddFieldMenu } from './AddFieldMenu';
import { RotateCcwIcon } from '../ui/Icons';

export const BuilderPanel: React.FC = () => {
  const {
    config,
    updateFormMeta,
    collapseAllGroups,
    expandAllGroups,
    resetConfig,
  } = useFormBuilder();

  const countTotalFields = (fields: typeof config.fields): number => {
    let count = 0;
    for (const f of fields) {
      count++;
      if (f.type === 'group' && f.fields) {
        count += countTotalFields(f.fields);
      }
    }
    return count;
  };

  const totalFields = countTotalFields(config.fields);

  return (
    <div className="builder-panel">
      {/* Panel Top Header */}
      <div className="builder-header">
        <div className="builder-title-section">
          <div className="builder-header-top">
            <span className="panel-section-title">Form Settings</span>
            <span className="field-count-label">
              {totalFields} {totalFields === 1 ? 'field' : 'fields'}
            </span>
          </div>

          <div className="builder-meta-inputs">
            <input
              type="text"
              className="builder-form-title-input"
              value={config.title}
              onChange={(e) => updateFormMeta(e.target.value, config.description)}
              placeholder="Form title"
            />
            <input
              type="text"
              className="builder-form-desc-input"
              value={config.description || ''}
              onChange={(e) => updateFormMeta(config.title, e.target.value)}
              placeholder="Add an optional description or instructions..."
            />
          </div>
        </div>

        {/* Global actions bar */}
        <div className="builder-toolbar">
          <AddFieldMenu />

          <div className="toolbar-group">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={expandAllGroups}
              title="Expand all groups"
            >
              Expand All
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={collapseAllGroups}
              title="Collapse all groups"
            >
              Collapse All
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm danger"
              onClick={() => {
                if (window.confirm('Clear all fields and start fresh?')) {
                  resetConfig({ ...config, fields: [] });
                }
              }}
              title="Clear all fields"
            >
              <RotateCcwIcon size={14} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Field List Container */}
      <div className="builder-field-tree">
        {config.fields.length === 0 ? (
          <div className="empty-state-builder">
            <h3>No fields added yet</h3>
            <p>Start building your form by adding a text input, number input, or group container.</p>
          </div>
        ) : (
          <div className="field-tree-list">
            {config.fields.map((field, idx) => (
              <FieldItem
                key={field.id}
                field={field}
                isFirst={idx === 0}
                isLast={idx === config.fields.length - 1}
                depth={0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
