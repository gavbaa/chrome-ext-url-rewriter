import { useEffect, useState } from "react";
import "./App.css";
import { DeclarativeNetRequestRule } from "./types/DnrRule";
import RuleDisplay from "./RuleDisplay";
import { ResourceTypesList } from "./types/ResourceTypes";

declare var chrome: any;

const isInExtensionMode =
  (window as any).chrome && (window as any).chrome.declarativeNetRequest;

function App() {
  useEffect(() => {
    if (isInExtensionMode) {
      chrome.declarativeNetRequest.getDynamicRules(
        (rules: DeclarativeNetRequestRule[]) => {
          setRules(
            rules.map((r) => {
              return {
                ...r,
                condition: {
                  ...r.condition,
                  resourceTypes:
                    r.condition.resourceTypes?.length ==
                    ResourceTypesList.length
                      ? []
                      : r.condition.resourceTypes,
                },
              };
            })
          );
        }
      );
    }
  }, []);

  const [rules, setRules] = useState<DeclarativeNetRequestRule[]>([]);
  const getNewRuleID = () => {
    return rules.map((r) => r.id).reduce((a, b) => Math.max(a, b), 0) + 1;
  };
  const updateRule = (rule: DeclarativeNetRequestRule) => {
    const newRules = rules.map((r) => (r.id === rule.id ? rule : r));
    setRules(newRules);
    addUpdateDynamicRule(rule);
  };
  const removeRule = (rule: DeclarativeNetRequestRule) => {
    const newRules = rules.filter((r) => r.id !== rule.id);
    setRules(newRules);
    deleteDynamicRule(rule);
  };

  async function addUpdateDynamicRule(rule: DeclarativeNetRequestRule) {
    console.log("before adding/updating rule", rule);

    const condition = Object.fromEntries(
      Object.entries({
        urlFilter: rule.condition.urlFilter || undefined,
        regexFilter: rule.condition.regexFilter || undefined,
        isUrlFilterCaseSensitive:
          rule.condition.isUrlFilterCaseSensitive || undefined,
        resourceTypes: rule.condition.excludedResourceTypes?.length
          ? undefined
          : rule.condition.resourceTypes || ResourceTypesList.slice(),
        excludedResourceTypes:
          rule.condition.excludedResourceTypes || undefined,
        requestMethods: rule.condition.requestMethods || undefined,
        excludedRequestMethods:
          rule.condition.excludedRequestMethods || undefined,
        initiatorDomains: rule.condition.initiatorDomains || undefined,
        excludedInitiatorDomains:
          rule.condition.excludedInitiatorDomains || undefined,
        requestDomains: rule.condition.requestDomains || undefined,
        excludedRequestDomains:
          rule.condition.excludedRequestDomains || undefined,
      }).filter(([_, v]) => v !== undefined)
    );
    console.log("updating condition", condition);

    if (isInExtensionMode) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [rule.id],
        addRules: [
          {
            id: rule.id,
            action: Object.fromEntries(
              Object.entries({
                type: rule.action.type,
                redirect: rule.action.redirect || undefined,
                requestHeaders: rule.action.requestHeaders || undefined,
              }).filter(([_, v]) => v !== undefined)
            ),
            condition,
          },
        ],
      });
    }
    console.log("after adding/updating rule", rule);
  }

  async function deleteDynamicRule(rule: DeclarativeNetRequestRule) {
    if (isInExtensionMode) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [rule.id],
      });
    }
  }

  return (
    <>
      <div>
        <div className="App">
          <h2>Request Rewriter</h2>
          {rules.length === 0 && (
            <div>
              <h3>No rules</h3>
            </div>
          )}
          {rules.map((rule) => (
            <div key={`rule_${rule.id}`} className="rule-wrapper">
              <RuleDisplay key={rule.id} rule={rule} updateRule={updateRule} />
              <button
                key={`remove-button_${rule.id}`}
                className="remove-button"
                onClick={() => removeRule(rule)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              setRules([
                ...rules,
                {
                  id: getNewRuleID(),
                  priority: 1,
                  action: {
                    type: "block",
                  },
                  condition: {
                    urlFilter: "https://example.com",
                    resourceTypes: ResourceTypesList.slice(),
                  },
                },
              ]);
            }}
          >
            Add a Rule
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
