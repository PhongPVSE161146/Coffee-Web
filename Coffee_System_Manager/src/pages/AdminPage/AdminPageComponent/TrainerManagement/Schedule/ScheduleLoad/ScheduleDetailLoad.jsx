import React from "react";
import "./ScheduleDetailLoad.css";
import { CalendarMonthRounded,  HorizontalRuleRounded,  TextSnippetRounded } from "@mui/icons-material";

const ScheduleDetailLoad = () => {
  return (
    <div className="scheduleDetail-loader-popup">
      <div className="scheduleDetail-loader-popup-content">
        <div>
            <span className="scheduleDetailLoader"><CalendarMonthRounded/></span>
        </div>
        <div>
            <span className="scheduleDataLoader"><TextSnippetRounded/></span>
        </div>
        <HorizontalRuleRounded className="scheduleDetailScanner"/>
        <div style={{position: 'absolute', color: '#555', fontSize: 16, fontWeight: 600, transform: 'translate(5%, 200%)'}}>Loading...</div>
      </div>
    </div>
  );
};

export default ScheduleDetailLoad;