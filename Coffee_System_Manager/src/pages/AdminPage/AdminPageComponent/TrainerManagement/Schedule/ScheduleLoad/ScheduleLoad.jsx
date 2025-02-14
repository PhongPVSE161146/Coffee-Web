import React from "react";
import "./ScheduleLoad.css";
import { BedtimeRounded, WbSunnyRounded } from "@mui/icons-material";

const ScheduleLoad = () => {
  return (
    <div className="schedule-loader-popup">
      <div className="schedule-loader-popup-content">
        <div>
            <span className="scheduleLoader"><WbSunnyRounded/><BedtimeRounded/></span>
        </div>
      </div>
    </div>
  );
};

export default ScheduleLoad;