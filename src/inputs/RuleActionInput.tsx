import React, { useEffect, useState } from "react";
import "./RuleActionInput.css";
import { DnrRuleAction, ModifyHeaderInfo, Redirect } from "../types/DnrRuleAction";
import { RuleActionHeaderInput } from "./RuleActionHeaderInput";

interface RuleActionInputProps {
  initialAction: DnrRuleAction;
  onActionChange: (action: DnrRuleAction) => void;
  setSaveEnabled: (enabled: boolean) => void;
}

const ReplacementTypeURL = "url";
const ReplacementTypeRegex = "regex";

export const RuleActionInput: React.FC<RuleActionInputProps> = ({
  initialAction,
  onActionChange,
  setSaveEnabled,
}) => {
  const [action, setAction] = useState<DnrRuleAction>(initialAction);
  const [replacementType, setReplacementType] = useState<string>(initialAction.redirect?.regexSubstitution ? ReplacementTypeRegex : ReplacementTypeURL);
  const [redirectValue, setRedirectValue] = useState<string>(initialAction.redirect?.regexSubstitution ?? initialAction.redirect?.url ?? "");

  useEffect(() => {
    setSaveEnabled(true);
  }, []);

  const handleHeaderChange = (headers: ModifyHeaderInfo[]) => {
    const newAction = { ...action, requestHeaders: headers };
    setAction(newAction);
    onActionChange(newAction);
  };

  useEffect(() => {
    let redirect: Redirect;
    if (replacementType == ReplacementTypeRegex) {
      redirect = { regexSubstitution: redirectValue };
    }
    else {
      redirect = { url: redirectValue };
    }
    
    const newAction = {
      ...action,
      redirect,
    };
    setAction(newAction);
    onActionChange(newAction);
  }, [replacementType, redirectValue]);

  return (
    <div className="rule-action-input">
      <div className="rule-action-type">
        <label>Action Type:</label>
        <select
          value={action.type}
          onChange={(e) => {
            const newAction = {
              ...action,
              type: e.target.value as DnrRuleAction["type"],
            };
            setAction(newAction);
            onActionChange(newAction);
          }}
        >
          <option value="redirect">Redirect</option>
          <option value="modifyHeaders">Modify Headers</option>
          <option value="block">Block</option>
          <option value="allow">Allow</option>
          <option value="upgradeScheme">Upgrade Scheme</option>
        </select>
      </div>

      {action.type === "redirect" && (
        <div>
          <div className="rule-action-replacement">
            <label>Replacement Type:</label>
            <select
              value={replacementType}
              onChange={(e) => {
                setReplacementType(e.target.value);
              }}
                >
              <option value={ReplacementTypeURL}>Plain URL</option>
              <option value={ReplacementTypeRegex}>Regex Substitution</option>
            </select>
            </div>
            <div className="rule-action-redirect">
            <label>Redirect URL:</label>
            <input
              type="text"
              value={redirectValue}
              onChange={(e) => {
                setRedirectValue(e.target.value);
              }}
            />
          </div>
        </div>
      )}

      {action.type === "modifyHeaders" && (
        <div className="rule-action-modify-headers">
          <label>Modify Headers:</label>
          <RuleActionHeaderInput
            initialHeaders={action.requestHeaders || []}
            onHeaderChange={handleHeaderChange}
            setSaveEnabled={setSaveEnabled}
          />
        </div>
      )}
    </div>
  );
};

export default RuleActionInput;
