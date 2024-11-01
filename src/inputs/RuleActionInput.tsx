import React, { useEffect, useState } from "react";
import { DnrRuleAction, ModifyHeaderInfo } from "../types/DnrRuleAction";
import { RuleActionHeaderInput } from "./RuleActionHeaderInput";

interface RuleActionInputProps {
  initialAction: DnrRuleAction;
  onActionChange: (action: DnrRuleAction) => void;
  setSaveEnabled: (enabled: boolean) => void;
}

export const RuleActionInput: React.FC<RuleActionInputProps> = ({
  initialAction,
  onActionChange,
  setSaveEnabled,
}) => {
  const [action, setAction] = useState<DnrRuleAction>(initialAction);

  useEffect(() => {
    setSaveEnabled(true);
  }, []);

  const handleHeaderChange = (headers: ModifyHeaderInfo[]) => {
    const newAction = { ...action, requestHeaders: headers };
    setAction(newAction);
    onActionChange(newAction);
  };

  return (
    <>
      <div>
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
          <label>Redirect URL:</label>
          <input
            type="text"
            value={action.redirect?.url || ""}
            onChange={(e) => {
              const newAction = {
                ...action,
                redirect: { ...action.redirect, url: e.target.value },
              };
              setAction(newAction);
              onActionChange(newAction);
            }}
          />
        </div>
      )}

      {action.type === "modifyHeaders" && (
        <div>
          <label>Modify Headers:</label>
          <RuleActionHeaderInput
            initialHeaders={action.requestHeaders || []}
            onHeaderChange={handleHeaderChange}
            setSaveEnabled={setSaveEnabled}
          />
        </div>
      )}
    </>
  );
};

export default RuleActionInput;
