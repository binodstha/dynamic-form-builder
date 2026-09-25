import { useState } from "react";
import { useFormBuilder } from "../../hooks/useFormBuilder";
import type { BaseField, FieldType } from "../../types/form";
import { PlusIcon, ChevronDownIcon } from "../ui/Icons";
import React from "react";

interface AddFieldMenuProps {
  fieldId?: string | null;
}

export const AddFieldMenu: React.FC<AddFieldMenuProps> = React.memo(
  ({ fieldId = null }) => {
    const { defaultFormTypes, addField } = useFormBuilder();

    const [showAddMenu, setShowAddMenu] = useState(false);

    const handleAddRootField = (type: FieldType) => {
      addField(fieldId, type);
      setShowAddMenu(false);
    };

    const isNested = fieldId !== null;

    return (
      <div className="relative">
        <button
          type="button"
          className={`btn ${isNested ? "btn-sm btn-secondary" : "btn-primary"}`}
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          <PlusIcon size={isNested ? 12 : 16} />
          <span>{isNested ? "Add Inside Group" : "Add Field"}</span>
          <ChevronDownIcon size={isNested ? 12 : 16} />
        </button>

        {showAddMenu && (
          <div className="dropdown-menu">
            {defaultFormTypes.map((fieldType: BaseField) => (
              <button
                key={fieldType.id}
                type="button"
                className="dropdown-item"
                onClick={() => handleAddRootField(fieldType.type)}
              >
                <div>
                  {(isNested && fieldType.type==="group")? `Nested ${fieldType.label}`: fieldType.label}
                  {!isNested && <div className="item-hint">{fieldType.description}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
