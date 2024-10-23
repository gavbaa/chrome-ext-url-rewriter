import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { RuleConditionForm } from "./ConditionForm";
import { RequestMethodForm } from "./inputs/RequestMethodForm";
import { DeclarativeNetRequestRule } from "./types/DnrRule";
import RuleDisplay from "./RuleDisplay";

const sampleRule: DeclarativeNetRequestRule = {
  id: 1,
  priority: 1,
  action: {
    type: "modifyHeaders",
    requestHeaders: [
      { header: "X-Custom-Header", operation: "set", value: "value" },
    ],
  },
  condition: {
    urlFilter: "https://example.com",
    requestMethods: ["GET"],
  },
};
const sampleRule2: DeclarativeNetRequestRule = {
  id: 2,
  priority: 2,
  action: {
    type: "block",
  },
  condition: {
    urlFilter: "https://example.com",
    requestMethods: ["GET", "POST", "HEAD"],
  },
};

function App() {
  return (
    <>
      <div>
        {false && (
          <RuleConditionForm
            initialCondition={{
              urlFilter: "https://example.com",
              requestDomains: ["example.com"],
            }}
            onSubmit={(condition) => {
              console.log("CONDITION", condition);
            }}
          />
        )}
        {false && (
          <RequestMethodForm
            initialCondition={{ type: "exclude", requestMethods: ["HEAD"] }}
            onSubmit={(condition) => {
              console.log("cindition", condition);
            }}
          />
        )}
        <div className="App">
          <RuleDisplay rule={sampleRule} />
          <RuleDisplay rule={sampleRule2} />
        </div>
      </div>
    </>
  );
}

export default App;
