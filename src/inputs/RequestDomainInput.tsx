import { useState } from "react";
import "./RequestDomainInput.css";

const isValidDomain = (domain: string) => {
  const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,6}$/;
  return domainPattern.test(domain);
};

interface RequestDomainInputProps {
  initialDomains: string[];
  onChange: (domains: string[]) => void;
}

export const RequestDomainInput = ({
  initialDomains,
  onChange,
}: RequestDomainInputProps) => {
  const [domains, setDomains] = useState<string[]>(initialDomains);
  const [newDomain, setNewDomain] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleAddDomain = () => {
    if (isValidDomain(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain("");
      setError("");
      onChange([...domains, newDomain]);
    } else {
      setError("Invalid domain");
    }
  };

  const handleRemoveDomain = (index: number) => {
    console.trace("handleRemoveDomain");
    const updatedDomains = domains.filter((_, i) => i !== index);
    setDomains(updatedDomains);
    onChange(updatedDomains);
  };

  return (
    <div className="request-domain-input">
      <div className="domain-list">
        {domains.map((domain, index) => (
          <div key={index} className="domain-item">
            <span>{domain}</span>
            <button onClick={() => handleRemoveDomain(index)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="domain-input">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleAddDomain();
            }
          }}
          placeholder="Enter domain"
        />
        <button onClick={handleAddDomain}>Add Domain</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
