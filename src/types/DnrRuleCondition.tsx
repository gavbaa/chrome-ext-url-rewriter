export type DnrRuleCondition = {
  urlFilter?: string;
  regexFilter?: string;
  isUrlFilterCaseSensitive?: boolean;
  resourceTypes?: string[];
  excludedResourceTypes?: string[];
  requestMethods?: string[];
  excludedRequestMethods?: string[];
  initiatorDomains?: string[];
  excludedInitiatorDomains?: string[];
  requestDomains?: string[];
  excludedRequestDomains?: string[];
};
