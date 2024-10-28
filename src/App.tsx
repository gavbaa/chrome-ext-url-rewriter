import { useState } from "react";
import "./App.css";
import { DeclarativeNetRequestRule } from "./types/DnrRule";
import RuleDisplay from "./RuleDisplay";

function App() {
  const [rules, setRules] = useState<DeclarativeNetRequestRule[]>([]);
  const getNewRuleID = () => {
    return rules.map((r) => r.id).reduce((a, b) => Math.max(a, b), 0) + 1;
  };
  const updateRule = (rule: DeclarativeNetRequestRule) => {
    const newRules = rules.map((r) => (r.id === rule.id ? rule : r));
    setRules(newRules);
  };
  const removeRule = (rule: DeclarativeNetRequestRule) => {
    const newRules = rules.filter((r) => r.id !== rule.id);
    setRules(newRules);
  };
  return (
    <>
      <div>
        <div className="App">
          {rules.length === 0 && (
            <div>
              <h2>No rules</h2>
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
                    requestDomains: ["example.com"],
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
