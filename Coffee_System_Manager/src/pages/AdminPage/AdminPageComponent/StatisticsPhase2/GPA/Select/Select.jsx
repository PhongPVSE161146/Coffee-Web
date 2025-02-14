import React, { useState, useEffect, useRef } from "react";
import "./Select.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const Select = ({ topics, onSelect, selected }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedTopics);
      selected = selectedTopics;
    } 
    
  }, [selectedTopics, onSelect]);

  useEffect(() => {
    if (Array.isArray(selected) && selected.length === 0 && selectedTopics.length > 0) {
      setSelectedTopics([]);
    }
  }, [selected, selectedTopics]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const isAllSelected = selectedTopics.length === topics.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTopics([]);

    } else {
      setSelectedTopics(topics);
    }
  };

  const handleCheckboxChange = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const filteredTopics = topics.filter((topic) =>
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          value={selectedTopics.length > 0 ? selectedTopics.join(", ") : ""}
          readOnly
          className="dropdown-input"
        />
        <span className="dropdown-arrow">
          {isOpen ? <CaretUpOutlined style={{ color: "rgba(170, 170, 170, 1)" }} /> : <CaretDownOutlined style={{ color: "rgba(170, 170, 170, 1)" }} />}
        </span>
      </div>

      {isOpen && (
        <div className="dropdown-body">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dropdown-search"
          />
          <div className="dropdown-list">
            {filteredTopics.length > 1 && (
              <div className="dropdown-item">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                />
                <label>Select All</label>
              </div>
            )}
            {filteredTopics.map((topic) => (
              <div key={topic} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedTopics.includes(topic)}
                  onChange={() => handleCheckboxChange(topic)}
                />
                <label>{topic}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
