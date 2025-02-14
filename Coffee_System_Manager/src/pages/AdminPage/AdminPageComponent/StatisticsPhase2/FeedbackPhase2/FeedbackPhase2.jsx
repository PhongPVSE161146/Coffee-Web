import React from "react";
import CourseOrganization from "./FeedbackPhase2Component/CourseOrganization/CourseOrganization";
import TrainerProgramContent from "./FeedbackPhase2Component/TrainerProgram&Content/TrainerProgramContent";
import Trainer from "./FeedbackPhase2Component/Trainer/Trainer";
import "./FeedbackPhase2.css";

const FeedbackPhase2 = () => {
  return (
    <div>
      <Trainer />
      <TrainerProgramContent />
      <CourseOrganization />
    </div>
  );
};

export default FeedbackPhase2;
