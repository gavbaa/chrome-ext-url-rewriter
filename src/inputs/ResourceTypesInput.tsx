import React, { useState } from "react";
import "./ResourceTypesInput.css";

interface ResourceTypesCondition {
  type: "include" | "exclude";
  resourceTypes: string[];
}

const resourceTypesList = [
  "main_frame",
  "sub_frame",
  "stylesheet",
  "script",
  "image",
  "font",
  "object",
  "xmlhttprequest",
  "ping",
  "csp_report",
  "media",
  "websocket",
  "other",
];

export const ResourceTypesInput = (props: {
  initialCondition: ResourceTypesCondition;
  onSubmit: (condition: ResourceTypesCondition) => void;
}) => {
  const [condition, setCondition] = useState<ResourceTypesCondition>(
    props.initialCondition
  );

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition({
      ...condition,
      type: e.target.value as "include" | "exclude",
    });
  };

  const handleResourceTypeChange = (type: string) => {
    const updatedTypes = condition.resourceTypes.includes(type)
      ? condition.resourceTypes.filter((t) => t !== type)
      : [...condition.resourceTypes, type];
    setCondition({ ...condition, resourceTypes: updatedTypes });
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
        <label>Resource Types:</label>
        <div className="checkbox-group">
          {resourceTypesList.map((type) => (
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
      <button type="submit" className="submit-button">
        Submit
      </button>
    </>
  );
};
