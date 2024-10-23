export type Redirect = {
  url?: string;
  regexSubstitution?: string;
};

export type ModifyHeaderInfo = {
  header: string;
  operation: "append" | "set" | "remove";
  value?: string;
};

export type DnrRuleAction = {
  type: "redirect" | "block" | "allow" | "upgradeScheme" | "modifyHeaders";
  redirect?: Redirect;
  requestHeaders?: ModifyHeaderInfo[];
  // responseHeaders?: ModifyHeaderInfo[];
};
