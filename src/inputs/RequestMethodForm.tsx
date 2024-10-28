import React, { useState } from "react";
import "./RequestMethodForm.css";

export type RequestMethodConditionInput = {
  type: "include" | "exclude";
  requestMethods: string[];
};

const requestMethodsList = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "HEAD",
];

interface RequestMethodFormProps {
  initialCondition: RequestMethodConditionInput;
  onChange: (condition: RequestMethodConditionInput) => void;
}

export const RequestMethodForm = ({
  initialCondition,
  onChange,
}: RequestMethodFormProps) => {
  const [condition, setCondition] =
    useState<RequestMethodConditionInput>(initialCondition);

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCondition = {
      ...condition,
      type: e.target.value as "include" | "exclude",
    };
    setCondition(newCondition);
    onChange(newCondition);
  };

  const handleRequestMethodChange = (method: string) => {
    const updatedMethods = condition.requestMethods.includes(method)
      ? condition.requestMethods.filter((m) => m !== method)
      : [...condition.requestMethods, method];
    const newCondition = { ...condition, requestMethods: updatedMethods };
    setCondition(newCondition);
    onChange(newCondition);
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
    </>
  );
};
