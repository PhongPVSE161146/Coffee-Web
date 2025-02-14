import React, { useState, useEffect, useRef } from "react";
import "./Select.css";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

const Select = ({ topics, onSelect }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectedTopic);
    }
  }, [selectedTopic, onSelect]);

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

  const handleSelect = (topic) => {
    if (selectedTopic === topic) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
    }
  };

  // Loại bỏ các giá trị trùng trong topics
  const uniqueTopics = [...new Set(topics)];
  const filteredTopics = uniqueTopics.filter((topic) =>
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
          value={selectedTopic || ""}
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
            {filteredTopics.map((topic) => (
              <div key={topic} className="dropdown-item">
                <input
                  type="radio"
                  id={topic}
                  name="topic"
                  checked={selectedTopic === topic}
                  onChange={() => handleSelect(topic)}
                />
                <label htmlFor={topic}>{topic}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Select;
