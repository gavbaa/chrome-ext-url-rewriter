import React, { useState } from "react";
import "./RequestMethodForm.css";

interface RequestMethodCondition {
  type: "include" | "exclude";
  requestMethods: string[];
}

const requestMethodsList = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
];

export const RequestMethodForm = (props: {
  initialCondition: RequestMethodCondition;
  onSubmit: (condition: RequestMethodCondition) => void;
}) => {
  const [condition, setCondition] = useState<RequestMethodCondition>(
    props.initialCondition
  );

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCondition({
      ...condition,
      type: e.target.value as "include" | "exclude",
    });
  };

  const handleRequestMethodChange = (method: string) => {
    const updatedMethods = condition.requestMethods.includes(method)
      ? condition.requestMethods.filter((m) => m !== method)
      : [...condition.requestMethods, method];
    setCondition({ ...condition, requestMethods: updatedMethods });
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
        <label>Request Methods:</label>
        <div className="checkbox-group">
          {requestMethodsList.map((method) => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={condition.requestMethods.includes(method)}
                onChange={() => handleRequestMethodChange(method)}
              />
              {method}
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
