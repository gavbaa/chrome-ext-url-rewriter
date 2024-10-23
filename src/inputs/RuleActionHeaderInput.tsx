import React, { useState } from "react";
import "./RuleActionHeaderInput.css";
import { ModifyHeaderInfo } from "../types/DnrRuleAction";

interface RuleActionHeaderInputProps {
  initialHeaders: ModifyHeaderInfo[];
  onHeaderChange: (headers: ModifyHeaderInfo[]) => void;
}

export const RuleActionHeaderInput: React.FC<RuleActionHeaderInputProps> = ({
  initialHeaders,
  onHeaderChange,
}) => {
  const [headers, setHeaders] = useState<ModifyHeaderInfo[]>(initialHeaders);

  const handleHeaderChange = (
    index: number,
    field: keyof ModifyHeaderInfo,
    value: string
  ) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    setHeaders(updatedHeaders);
    onHeaderChange(updatedHeaders);
  };

  const handleAddHeader = () => {
    const newHeader: ModifyHeaderInfo = {
      header: "",
      operation: "set",
      value: "",
    };
    const newHeaders = [...headers, newHeader];
    setHeaders(newHeaders);
    onHeaderChange(newHeaders);
  };

  const handleRemoveHeader = (index: number) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
    onHeaderChange(updatedHeaders);
  };

  return (
    <div className="rule-action-header-input">
      <h3>Header Management</h3>
      {headers.map((header, index) => (
        <div key={index} className="header-item">
          <input
            type="text"
            placeholder="Header Name"
            value={header.header}
            onChange={(e) =>
              handleHeaderChange(index, "header", e.target.value)
            }
          />
          <select
            value={header.operation}
            onChange={(e) =>
              handleHeaderChange(index, "operation", e.target.value)
            }
          >
            <option value="append">Append</option>
            <option value="set">Set</option>
            <option value="remove">Remove</option>
          </select>
          {header.operation !== "remove" && (
            <input
              type="text"
              placeholder="Value"
              value={header.value || ""}
              onChange={(e) =>
                handleHeaderChange(index, "value", e.target.value)
              }
            />
          )}
          <button type="button" onClick={() => handleRemoveHeader(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddHeader}>
        Add Header
      </button>
    </div>
  );
};
