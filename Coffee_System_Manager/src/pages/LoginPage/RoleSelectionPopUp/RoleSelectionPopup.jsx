import React from "react";
import "./RoleSelectionPopUp.css";
import { DeliveredProcedureOutlined, LaptopOutlined, ReadOutlined, SolutionOutlined } from "@ant-design/icons";

const iconMap = {
  admin: { icon: <LaptopOutlined />, roleName: "Admin" },
  FAMadmin: { icon: <LaptopOutlined />, roleName: "FAM Admin" },
  trainer: { icon: <ReadOutlined />, roleName: "Trainer" },
  deliverymanager: { icon: <DeliveredProcedureOutlined />, roleName: "Delivery Manager" },
  trainermanager: { icon: <SolutionOutlined />, roleName: "Trainer Manager" }
}


const RoleSelectionPopup = ({ onSelectRole, roles = [], }) => {
  return (
    <div className="role-popup">
      <div className="role-popup-content">
        <h3>Select Role</h3>
        <div className="role-choice">
          {roles.map((role) => (
            iconMap[role] ? (
            <button key={role} onClick={() => onSelectRole(role)}>
              {iconMap[role].icon} {iconMap[role].roleName}
            </button>
            ) : (
              <div className="dontRender"></div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPopup;
