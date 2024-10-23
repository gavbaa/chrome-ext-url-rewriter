import { DnrRuleAction } from "./DnrRuleAction";
import { DnrRuleCondition } from "./DnrRuleCondition";

export type DeclarativeNetRequestRule = {
  id: number;
  priority: number;
  action: DnrRuleAction;
  condition: DnrRuleCondition;
};
