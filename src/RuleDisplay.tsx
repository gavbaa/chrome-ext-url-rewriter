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

interface RuleDisplayProps {
  rule: DeclarativeNetRequestRule;
}

const RuleDisplay: React.FC<RuleDisplayProps> = ({ rule }) => {
  const { id, priority, action, condition } = rule;
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [currentAction, setCurrentAction] = useState<DnrRuleAction>(action);
  const [tempCurrentAction, setTempCurrentAction] =
    useState<DnrRuleAction>(action);
  const [currentCondition, setCurrentCondition] =
    useState<DnrRuleCondition>(condition);
  const [conditionType, setConditionType] = useState<string>("");

  const handleEditActionClick = () => {
    setTempCurrentAction(currentAction);
    setIsActionModalOpen(true);
  };

  const handleActionModalCancel = () => {
    setTempCurrentAction(currentAction);
    setIsActionModalOpen(false);
  };

  const handleActionModalSave = () => {
    setCurrentAction(tempCurrentAction);
    setIsActionModalOpen(false);
  };

  const handleConditionModalClose = () => {
    setIsConditionModalOpen(false);
  };

  const handleConditionSubmit = (newCondition: DnrRuleCondition) => {
    setCurrentCondition({ ...currentCondition, ...newCondition });
    setIsConditionModalOpen(false);
  };

  const handleConditionEditClick = (type: string) => {
    setConditionType(type);
    setIsConditionModalOpen(true);
    setModalTitle(type);
  };

  const handleActionRuleInputUpdate = (newAction: DnrRuleAction) => {
    setTempCurrentAction(newAction);
  };

  const renderConditionForm = () => {
    switch (conditionType) {
      case "Request Methods":
        return (
          <RequestMethodForm
            initialCondition={{
              type: currentCondition.excludedRequestMethods?.length
                ? "exclude"
                : "include",

              requestMethods: currentCondition.excludedRequestMethods?.length
                ? currentCondition.excludedRequestMethods
                : currentCondition.requestMethods || [],
            }}
            onSubmit={(condition) =>
              handleConditionSubmit({
                requestMethods: condition.requestMethods,
              })
            }
          />
        );
      case "Resource Types":
        return (
          <ResourceTypesInput
            initialCondition={{
              type: currentCondition.excludedResourceTypes?.length
                ? "exclude"
                : "include",
              resourceTypes: currentCondition.excludedResourceTypes?.length
                ? currentCondition.excludedResourceTypes
                : currentCondition.resourceTypes || [],
            }}
            onSubmit={(condition) => {
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
          />
        );
      case "Initiator Domains":
        return (
          <RequestDomainInput
            initialDomains={currentCondition.initiatorDomains || []}
            onSubmit={(domains: string[]) =>
              handleConditionSubmit({
                initiatorDomains: domains,
              })
            }
          />
        );
      case "Excluded Initiator Domains":
        return (
          <RequestDomainInput
            initialDomains={currentCondition.excludedInitiatorDomains || []}
            onSubmit={(domains: string[]) =>
              handleConditionSubmit({
                excludedInitiatorDomains: domains,
              })
            }
          />
        );
      case "Request Domains":
        return (
          <RequestDomainInput
            initialDomains={currentCondition.requestDomains || []}
            onSubmit={(domains: string[]) =>
              handleConditionSubmit({
                requestDomains: domains,
              })
            }
          />
        );
      case "Excluded Request Domains":
        return (
          <RequestDomainInput
            initialDomains={currentCondition.excludedRequestDomains || []}
            onSubmit={(domains: string[]) =>
              handleConditionSubmit({
                excludedRequestDomains: domains,
              })
            }
          />
        );
      default:
        return null;
    }
  };

  const conditionText = [
    condition.urlFilter && (
      <span key="urlFilter">
        <span className="label">URL Filter:</span>{" "}
        <span className="value">{condition.urlFilter}</span>
      </span>
    ),
    condition.regexFilter && (
      <span key="regexFilter">
        <span className="label">Regex Filter:</span>{" "}
        <span className="value">{condition.regexFilter}</span>
      </span>
    ),
    condition.isUrlFilterCaseSensitive !== undefined && (
      <span key="isUrlFilterCaseSensitive">
        <span className="label">Case Sensitive:</span>{" "}
        <span className="value">
          {condition.isUrlFilterCaseSensitive ? "Yes" : "No"}
        </span>
      </span>
    ),
    condition.resourceTypes && (
      <span key="resourceTypes">
        <span className="label">Resource Types:</span>{" "}
        <span className="value">{condition.resourceTypes.join(", ")}</span>
      </span>
    ),
    condition.excludedResourceTypes && (
      <span key="excludedResourceTypes">
        <span className="label">Excluded Resource Types:</span>{" "}
        <span className="value">
          {condition.excludedResourceTypes.join(", ")}
        </span>
      </span>
    ),
    condition.requestMethods && (
      <span key="requestMethods">
        <span className="label">Request Methods:</span>{" "}
        <span className="value">{condition.requestMethods.join(", ")}</span>
      </span>
    ),
    condition.excludedRequestMethods && (
      <span key="excludedRequestMethods">
        <span className="label">Excluded Request Methods:</span>{" "}
        <span className="value">
          {condition.excludedRequestMethods.join(", ")}
        </span>
      </span>
    ),
    condition.initiatorDomains && (
      <span key="initiatorDomains">
        <span className="label">Initiator Domains:</span>{" "}
        <span className="value">{condition.initiatorDomains.join(", ")}</span>
      </span>
    ),
    condition.excludedInitiatorDomains && (
      <span key="excludedInitiatorDomains">
        <span className="label">Excluded Initiator Domains:</span>{" "}
        <span className="value">
          {condition.excludedInitiatorDomains.join(", ")}
        </span>
      </span>
    ),
    condition.requestDomains && (
      <span key="requestDomains">
        <span className="label">Request Domains:</span>{" "}
        <span className="value">{condition.requestDomains.join(", ")}</span>
      </span>
    ),
    condition.excludedRequestDomains && (
      <span key="excludedRequestDomains">
        <span className="label">Excluded Request Domains:</span>{" "}
        <span className="value">
          {condition.excludedRequestDomains.join(", ")}
        </span>
      </span>
    ),
  ].filter(Boolean);

  const actionText = [
    <span key="type">
      <span className="label">Type:</span>{" "}
      <span className="value">{currentAction.type}</span>
    </span>,
    currentAction.type === "redirect" && currentAction.redirect?.url && (
      <span key="redirectUrl">
        <span className="label">Redirect URL:</span>{" "}
        <span className="value">{currentAction.redirect.url}</span>
      </span>
    ),
    currentAction.type === "modifyHeaders" && currentAction.requestHeaders && (
      <span key="modifyHeaders">
        <span className="label">Modify Headers:</span>{" "}
        <span className="value">
          {currentAction.requestHeaders
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
                initialAction={currentAction}
                onActionChange={handleActionRuleInputUpdate}
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
                className="dialog-close-button"
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <Dialog
        open={isConditionModalOpen}
        onClose={handleConditionModalClose}
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
                onClick={handleConditionModalClose}
                className="dialog-close-button"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default RuleDisplay;
