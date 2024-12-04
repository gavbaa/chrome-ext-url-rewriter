import React, { useState, Fragment } from "react";
import {
  Menu,
  Transition,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { DeclarativeNetRequestRule } from "./types/DnrRule";
import { DnrRuleAction } from "./types/DnrRuleAction";
import { DnrRuleCondition } from "./types/DnrRuleCondition";
import RuleActionInput from "./inputs/RuleActionInput";
import { RequestMethodForm } from "./inputs/RequestMethodForm";
import { ResourceTypesInput } from "./inputs/ResourceTypesInput";
import { RequestDomainInput } from "./inputs/RequestDomainInput";
import "./RuleDisplay.css";
import { EditIcon } from "./EditIcon";
import { RequestURLFilterInput } from "./inputs/RequestURLFilterInput";
import { ResourceTypesList } from "./types/ResourceTypes";

interface RuleDisplayProps {
  rule: DeclarativeNetRequestRule;
  updateRule: (rule: DeclarativeNetRequestRule) => void;
}

const RuleDisplay: React.FC<RuleDisplayProps> = ({ rule, updateRule }) => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentRule, setCurrentRule] =
    useState<DeclarativeNetRequestRule>(rule);
  const [tempCurrentRule, setTempCurrentRule] =
    useState<DeclarativeNetRequestRule>(rule);
  const [conditionType, setConditionType] = useState<string>("");
  const [saveEnabled, setSaveEnabled] = useState(false);

  const handleEditActionClick = () => {
    setSaveEnabled(false);
    setTempCurrentRule(currentRule);
    setIsActionModalOpen(true);
  };

  const handleActionModalCancel = () => {
    setTempCurrentRule(currentRule);
    setIsActionModalOpen(false);
  };

  const handleActionModalSave = () => {
    setSaveEnabled(false);
    setCurrentRule(tempCurrentRule);
    updateRule(tempCurrentRule);
    setIsActionModalOpen(false);
  };

  const handleConditionModalCancel = () => {
    setTempCurrentRule(currentRule);
    setIsConditionModalOpen(false);
  };

  const handleConditionModalSave = () => {
    setCurrentRule(tempCurrentRule);
    updateRule(tempCurrentRule);
    setIsConditionModalOpen(false);
  };

  const handleConditionSubmit = (newCondition: DnrRuleCondition) => {
    console.log("handling condition submit", newCondition);
    const updatedCondition = { ...tempCurrentRule.condition, ...newCondition };
    setTempCurrentRule({ ...tempCurrentRule, condition: updatedCondition });
  };

  const handleConditionEditClick = (type: string) => {
    setConditionType(type);
    setIsConditionModalOpen(true);
    setModalTitle(type);
  };

  const handleActionRuleInputUpdate = (newAction: DnrRuleAction) => {
    const updatedAction = { ...tempCurrentRule.action, ...newAction };
    setTempCurrentRule({ ...tempCurrentRule, action: updatedAction });
  };

  const renderConditionForm = () => {
    switch (conditionType) {
      case "URL Matching":
        return (
          <RequestURLFilterInput
            initialCondition={{
              filterType: currentRule.condition.urlFilter
                ? "urlFilter"
                : "regexFilter",
              filter:
                currentRule.condition.urlFilter ||
                currentRule.condition.regexFilter ||
                "",
              isCaseSensitive:
                currentRule.condition.isUrlFilterCaseSensitive || false,
            }}
            onChange={(condition) => {
              if (condition.filterType === "urlFilter") {
                handleConditionSubmit({
                  urlFilter: condition.filter,
                  regexFilter: "",
                  isUrlFilterCaseSensitive: condition.isCaseSensitive,
                });
              } else {
                handleConditionSubmit({
                  urlFilter: "",
                  regexFilter: condition.filter,
                  isUrlFilterCaseSensitive: condition.isCaseSensitive,
                });
              }
            }}
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Request Methods":
        return (
          <RequestMethodForm
            initialCondition={{
              type: currentRule.condition.excludedRequestMethods?.length
                ? "exclude"
                : "include",

              requestMethods: currentRule.condition.excludedRequestMethods
                ?.length
                ? currentRule.condition.excludedRequestMethods
                : currentRule.condition.requestMethods || [],
            }}
            onChange={(condition) => {
              if (condition.type === "include") {
                handleConditionSubmit({
                  requestMethods: condition.requestMethods,
                  excludedRequestMethods: [],
                });
              } else {
                handleConditionSubmit({
                  requestMethods: [],
                  excludedRequestMethods: condition.requestMethods,
                });
              }
            }}
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Resource Types":
        return (
          <ResourceTypesInput
            initialCondition={{
              type: currentRule.condition.excludedResourceTypes?.length
                ? "exclude"
                : "include",
              resourceTypes: currentRule.condition.excludedResourceTypes?.length
                ? currentRule.condition.excludedResourceTypes
                : currentRule.condition.resourceTypes || [],
            }}
            onChange={(condition) => {
              if (condition.type === "include") {
                handleConditionSubmit({
                  resourceTypes: condition.resourceTypes,
                  excludedResourceTypes: [],
                });
              } else {
                handleConditionSubmit({
                  resourceTypes: [],
                  excludedResourceTypes: condition.resourceTypes,
                });
              }
            }}
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Initiator Domains":
        return (
          <RequestDomainInput
            initialDomains={currentRule.condition.initiatorDomains || []}
            onChange={(domains: string[]) =>
              handleConditionSubmit({
                initiatorDomains: domains,
              })
            }
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Excluded Initiator Domains":
        return (
          <RequestDomainInput
            initialDomains={
              currentRule.condition.excludedInitiatorDomains || []
            }
            onChange={(domains: string[]) =>
              handleConditionSubmit({
                excludedInitiatorDomains: domains,
              })
            }
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Request Domains":
        return (
          <RequestDomainInput
            initialDomains={currentRule.condition.requestDomains || []}
            onChange={(domains: string[]) =>
              handleConditionSubmit({
                requestDomains: domains,
              })
            }
            setSaveEnabled={setSaveEnabled}
          />
        );
      case "Excluded Request Domains":
        return (
          <RequestDomainInput
            initialDomains={currentRule.condition.excludedRequestDomains || []}
            onChange={(domains: string[]) =>
              handleConditionSubmit({
                excludedRequestDomains: domains,
              })
            }
            setSaveEnabled={setSaveEnabled}
          />
        );
      default:
        return null;
    }
  };

  const conditionText = [
    currentRule.condition.urlFilter && (
      <span key="urlFilter">
        <span className="label">URL Filter:</span>{" "}
        <span className="value">{currentRule.condition.urlFilter}</span>
      </span>
    ),
    currentRule.condition.regexFilter && (
      <span key="regexFilter">
        <span className="label">Regex Filter:</span>{" "}
        <span className="value">{currentRule.condition.regexFilter}</span>
      </span>
    ),
    currentRule.condition.isUrlFilterCaseSensitive !== undefined && (
      <span key="isUrlFilterCaseSensitive">
        <span className="label">Case Sensitive:</span>{" "}
        <span className="value">
          {currentRule.condition.isUrlFilterCaseSensitive ? "Yes" : "No"}
        </span>
      </span>
    ),
    currentRule.condition.resourceTypes?.length && (
      <span key="resourceTypes">
        <span className="label">Resource Types:</span>{" "}
        {currentRule.condition.resourceTypes.length ===
        ResourceTypesList.length ? (
          "(all)"
        ) : (
          <span className="value">
            {currentRule.condition.resourceTypes.join(", ")}
          </span>
        )}
      </span>
    ),
    currentRule.condition.excludedResourceTypes?.length && (
      <span key="excludedResourceTypes">
        <span className="label">Excluded Resource Types:</span>{" "}
        {currentRule.condition.excludedResourceTypes.length ===
        ResourceTypesList.length ? (
          "(all)"
        ) : (
          <span className="value">
            {currentRule.condition.excludedResourceTypes.join(", ")}
          </span>
        )}
      </span>
    ),
    currentRule.condition.requestMethods?.length && (
      <span key="requestMethods">
        <span className="label">Request Methods:</span>{" "}
        <span className="value">
          {currentRule.condition.requestMethods.join(", ")}
        </span>
      </span>
    ),
    currentRule.condition.excludedRequestMethods?.length && (
      <span key="excludedRequestMethods">
        <span className="label">Excluded Request Methods:</span>{" "}
        <span className="value">
          {currentRule.condition.excludedRequestMethods.join(", ")}
        </span>
      </span>
    ),
    currentRule.condition.initiatorDomains?.length && (
      <span key="initiatorDomains">
        <span className="label">Initiator Domains:</span>{" "}
        <span className="value">
          {currentRule.condition.initiatorDomains.join(", ")}
        </span>
      </span>
    ),
    currentRule.condition.excludedInitiatorDomains?.length && (
      <span key="excludedInitiatorDomains">
        <span className="label">Excluded Initiator Domains:</span>{" "}
        <span className="value">
          {currentRule.condition.excludedInitiatorDomains.join(", ")}
        </span>
      </span>
    ),
    currentRule.condition.requestDomains?.length && (
      <span key="requestDomains">
        <span className="label">Request Domains:</span>{" "}
        <span className="value">
          {currentRule.condition.requestDomains.join(", ")}
        </span>
      </span>
    ),
    currentRule.condition.excludedRequestDomains?.length && (
      <span key="excludedRequestDomains">
        <span className="label">Excluded Request Domains:</span>{" "}
        <span className="value">
          {currentRule.condition.excludedRequestDomains.join(", ")}
        </span>
      </span>
    ),
  ].filter(Boolean);

  const actionText = [
    <span key="type">
      <span className="label">Type:</span>{" "}
      <span className="value">{currentRule.action.type}</span>
    </span>,
    currentRule.action.type === "redirect" &&
      (currentRule.action.redirect?.url || currentRule.action.redirect?.regexSubstitution) && (
        <span key="redirectUrl">
          <span className="label">Redirect {currentRule.action.redirect.regexSubstitution ? "Regex" : "URL"}:</span>{" "}
          <span className="value">{currentRule.action.redirect.regexSubstitution ?? currentRule.action.redirect.url}</span>
        </span>
      ),
    currentRule.action.type === "modifyHeaders" &&
      currentRule.action.requestHeaders && (
        <span key="modifyHeaders">
          <span className="label">Modify Headers:</span>{" "}
          <span className="value">
            {currentRule.action.requestHeaders
              .map(
                (header) =>
                  `${header.operation} ${header.header}${
                    header.value ? `: ${header.value}` : ""
                  }`
              )
              .join(", ")}
          </span>
        </span>
      ),
  ].filter(Boolean);

  return (
    <div className="rule-display">
      <div>
        <span className="label">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="menu-button">
              {" "}
              <EditIcon />
              &nbsp;Condition
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="menu-items">
                <div style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => handleConditionEditClick("URL Matching")}
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        URL Matching
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Request Methods")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Request Methods
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Resource Types")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Resource Types
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Initiator Domains")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Initiator Domains
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Excluded Initiator Domains")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Excluded Initiator Domains
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Request Domains")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Request Domains
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          handleConditionEditClick("Excluded Request Domains")
                        }
                        className={`menu-item ${active ? "active" : ""}`}
                      >
                        Excluded Request Domains
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </span>{" "}
        {conditionText.map((text, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="separator">; </span>}
            {text}
          </React.Fragment>
        ))}{" "}
      </div>
      <div>
        <span className="label">
          <button
            type="button"
            className="menu-button"
            onClick={handleEditActionClick}
          >
            <EditIcon />
            &nbsp;Action
          </button>
        </span>{" "}
        {actionText.map((text, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="separator">; </span>}
            {text}
          </React.Fragment>
        ))}
      </div>
      <Dialog
        open={isActionModalOpen}
        onClose={handleActionModalCancel}
        className="dialog"
      >
        <div className="dialog-backdrop" aria-hidden="true" />
        <div className="dialog-container">
          <div className="dialog-spacer" />
          <DialogPanel className="dialog-panel">
            <DialogTitle className="dialog-title">Edit Rule Action</DialogTitle>
            <div className="dialog-content">
              <RuleActionInput
                initialAction={currentRule.action}
                onActionChange={handleActionRuleInputUpdate}
                setSaveEnabled={setSaveEnabled}
              />
            </div>
            <div className="dialog-actions">
              <button
                onClick={handleActionModalCancel}
                className="dialog-close-button"
              >
                Cancel
              </button>
              <button
                onClick={handleActionModalSave}
                className={`dialog-close-button ${
                  saveEnabled ? "" : "dialog-close-button-disabled"
                }`}
                disabled={!saveEnabled}
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog
        open={isConditionModalOpen}
        onClose={handleConditionModalCancel}
        className="dialog"
      >
        <div className="dialog-backdrop" aria-hidden="true" />
        <div className="dialog-container">
          <div className="dialog-spacer" />
          <DialogPanel className="dialog-panel">
            <DialogTitle className="dialog-title">
              Edit Condition for {modalTitle}
            </DialogTitle>
            <div className="dialog-content">{renderConditionForm()}</div>
            <div className="dialog-actions">
              <button
                onClick={handleConditionModalCancel}
                className="dialog-close-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConditionModalSave}
                className={`dialog-close-button ${
                  saveEnabled ? "" : "dialog-close-button-disabled"
                }`}
                disabled={!saveEnabled}
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default RuleDisplay;
