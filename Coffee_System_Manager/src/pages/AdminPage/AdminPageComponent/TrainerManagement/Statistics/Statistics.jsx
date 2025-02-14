import React, { useState } from "react";
import "./Statistics.css";
import { useNavigate, Outlet } from "react-router-dom";
import GPA from "./GPA/GPA"

const Statistics = () => {
  const [activeTag, setActiveTag] = useState(null);
  const navigate = useNavigate();

  const handleClick = (tag) => {
    setActiveTag((prevActiveTag) => (prevActiveTag === tag ? null : tag));
    if (tag === "GPA") {
      navigate("gpa");
    }
  };

  return (
    <div className="statistics-content">
      <GPA/>
    </div>
  );
};

export default Statistics;
