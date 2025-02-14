import React from "react";
import "./NetworkError.css";
import { SignalWifiOffRounded } from "@mui/icons-material";

const NetworkError = () => {
  return (
    <div className="networkError-container">
        <div className="networkError-popup">
            <span>Connection Error!</span><span></span><span></span>
            <div><SignalWifiOffRounded /></div>
        </div>
    </div>
  );
};

export default NetworkError;