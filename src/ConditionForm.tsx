import React, { useState } from "react";
import { RequestMethodForm } from "./inputs/RequestMethodForm";
import { RequestDomainInput } from "./inputs/RequestDomainInput";
import { RequestURLFilterInput } from "./inputs/RequestURLFilterInput";
import { ResourceTypesInput } from "./inputs/ResourceTypesInput";
import { DnrRuleCondition } from "./types/DnrRuleCondition";
import RuleActionInput from "./inputs/RuleActionInput";

interface RuleConditionFormProps {
  initialCondition: DnrRuleCondition;
  onSubmit: (condition: DnrRuleCondition) => void;
}

export const RuleConditionForm: React.FC<RuleConditionFormProps> = ({
  initialCondition,
  onSubmit,
}) => {
  const [condition, setCondition] =
    useState<DnrRuleCondition>(initialCondition);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(condition);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <RequestURLFilterInput />
      </div>
      <div>
        <ResourceTypesInput
          initialCondition={{
            type: "exclude",
            resourceTypes: ["stylesheet", "script"],
          }}
          onSubmit={(condition) => {
            console.log("cindition", condition);
          }}
        />
      </div>
      <div>
        <label>Request Methods Filter</label>
        <RequestMethodForm
          initialCondition={{ type: "exclude", requestMethods: ["HEAD"] }}
          onSubmit={(condition) => {
            console.log("cindition", condition);
          }}
        />
      </div>

      <div>
        <label>Initiator Domains:</label>
        <RequestDomainInput />
      </div>
      <div>
        <label>Excluded Initiator Domains:</label>
        <RequestDomainInput />
      </div>
      <div>
        <label>Request Domains:</label>
        <RequestDomainInput />
      </div>
      <div>
        <label>Excluded Request Domains:</label>
        <RequestDomainInput />
      </div>

      <div>
        <RuleActionInput
          initialAction={{ type: "redirect" }}
          onSubmit={(action) => {
            console.log("action", action);
          }}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RuleConditionForm;
