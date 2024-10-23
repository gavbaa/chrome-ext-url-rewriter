import React, { useState } from "react";
import "./RequestURLFilterInput.css";

export const RequestURLFilterInput: React.FC = () => {
  const [inputType, setInputType] = useState<"urlFilter" | "regexFilter">(
    "urlFilter"
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(false);

  const handleInputTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputType(e.target.value as "urlFilter" | "regexFilter");
  };

  const handleInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCaseSensitiveChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsCaseSensitive(e.target.checked);
  };

  return (
    <div className="request-url-filter-input">
      <h3>URL Filter Input</h3>
      <div className="input-type-selection">
        <label>
          <input
            type="radio"
            name="inputType"
            value="urlFilter"
            checked={inputType === "urlFilter"}
            onChange={handleInputTypeChange}
          />
          URL Filter
          <a
            href="https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest#property-RuleCondition-urlFilter"
            target="_blank"
            rel="noopener noreferrer"
          >
            Syntax
          </a>
        </label>
        <label>
          <input
            type="radio"
            name="inputType"
            value="regexFilter"
            checked={inputType === "regexFilter"}
            onChange={handleInputTypeChange}
          />
          Regex Filter
          <a
            href="https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#type-RuleCondition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Syntax
          </a>
        </label>
      </div>
      <div className="input-field">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputValueChange}
          placeholder={`Enter ${
            inputType === "urlFilter" ? "URL" : "Regex"
          } Filter`}
        />
      </div>
      <div className="case-sensitive-checkbox">
        <label>
          <input
            type="checkbox"
            checked={isCaseSensitive}
            onChange={handleCaseSensitiveChange}
          />
          Case Sensitive
        </label>
      </div>
    </div>
  );
};
