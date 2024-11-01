import React, { useEffect, useState } from "react";
import "./ResourceTypesInput.css";
import { ResourceTypesList } from "../types/ResourceTypes";

interface ResourceTypesCondition {
  type: "include" | "exclude";
  resourceTypes: string[];
}

interface ResourceTypesInputProps {
  initialCondition: ResourceTypesCondition;
  onChange: (condition: ResourceTypesCondition) => void;
  setSaveEnabled: (enabled: boolean) => void;
}

export const ResourceTypesInput = ({
  initialCondition,
  onChange,
  setSaveEnabled,
}: ResourceTypesInputProps) => {
  const [condition, setCondition] =
    useState<ResourceTypesCondition>(initialCondition);

  useEffect(() => {
    setSaveEnabled(condition.resourceTypes.length > 0);
  }, []);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition({
      ...condition,
      type: e.target.value as "include" | "exclude",
    });
    onChange({
      ...condition,
      type: e.target.value as "include" | "exclude",
    });
    setSaveEnabled(condition.resourceTypes.length > 0);
  };

  const handleResourceTypeChange = (type: string) => {
    const updatedTypes = condition.resourceTypes.includes(type)
      ? condition.resourceTypes.filter((t) => t !== type)
      : [...condition.resourceTypes, type];
    setCondition({ ...condition, resourceTypes: updatedTypes });
    onChange({ ...condition, resourceTypes: updatedTypes });
    setSaveEnabled(updatedTypes.length > 0);
  };

  const selectAll = () => {
    setCondition({ ...condition, resourceTypes: ResourceTypesList });
    onChange({ ...condition, resourceTypes: ResourceTypesList });
    setSaveEnabled(true);
  };

  const selectNone = () => {
    setCondition({ ...condition, resourceTypes: [] });
    onChange({ ...condition, resourceTypes: [] });
    setSaveEnabled(false);
  };

  return (
    <>
      <div className="form-group">
        <label>
          <input
            type="radio"
            name="type"
            value="include"
            checked={condition.type === "include"}
            onChange={handleTypeChange}
          />
          Include
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="exclude"
            checked={condition.type === "exclude"}
            onChange={handleTypeChange}
          />
          Exclude
        </label>
      </div>
      <div className="form-group">
        <label>
          Resource Types: <a onClick={() => selectAll()}>(all)</a>{" "}
          <a onClick={() => selectNone()}>(none)</a>
        </label>
        <div className="checkbox-group">
          {ResourceTypesList.map((type) => (
            <label key={type} className="checkbox-label">
              <input
                type="checkbox"
                checked={condition.resourceTypes.includes(type)}
                onChange={() => handleResourceTypeChange(type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </>
  );
};
