// // AdminRoutes.js
// import React from "react";
// import { Route } from "react-router-dom";
// import AdminPage from "../pages/AdminPage/AdminPage";
// import TrainerManagement from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerManagement";
// import Statistics from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Statistics/Statistics";
// import GPA from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Statistics/GPA/GPA";
// import FeedBack from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Statistics/Feedback/Feedback";
// import TrainerList from "../pages/AdminPage/AdminPageComponent/TrainerList/TrainerList";
// import AddTrainer from "../pages/AdminPage/AdminPageComponent/AddTrainer/AddTrainer";
// import ScheduleTracker from "../pages/AdminPage/AdminPageComponent/ScheduleTracker/ScheduleTracker";
// import TrainerInformation from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerInformation/TrainerInformation";
// import TrainerUnitPrice from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerUnitPrice/TrainerUnitPrice";
// import ClassList from "../pages/AdminPage/AdminPageComponent/TrainerManagement/ClassList/ClassList";
// import Schedule from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Schedule/Schedule";
// import TraineeManagement from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeManagement";
// import ClassMangement from "../pages/AdminPage/AdminPageComponent/ClaasManagement/ClassMangement";
// import LogWork from "../pages/AdminPage/AdminPageComponent/LogWork/LogWork";
// import ContentManagement from "../pages/AdminPage/AdminPageComponent/ContentManagement/ContentManagement";
// import FAQS from "../pages/AdminPage/AdminPageComponent/FAQS/FAQS";
// import PrivateRoutes from "./PrivateRoutes";

// const AdminRoutes = () => (
//   <>
//     <Route path="/adminPage/*" element={<PrivateRoutes requiredRole="admin" />}>
//       <Route index element={<AdminPage />} />
//       <Route element={<AdminPage />}>
//         <Route path="trainerList" element={<TrainerList />} />
//         <Route path="addTrainer" element={<AddTrainer />} />
//         <Route path="scheduleTracker" element={<ScheduleTracker />} />
//         <Route path="traineeManagement" element={<TraineeManagement />} />
//         <Route path="logWork" element={<LogWork />} />
//         <Route path="contentManagement" element={<ContentManagement />} />
//         <Route path="faqs" element={<FAQS />} />
//         <Route path="classManagement" element={<ClassMangement />} />
//         <Route
//           path="trainerManagement/:trainerId"
//           element={<TrainerManagement />}
//         >
//           <Route path="trainerInformation" element={<TrainerInformation />} />
//           <Route path="trainerUnitPrice" element={<TrainerUnitPrice />} />
//           <Route path="classList" element={<ClassList />} />
//           <Route path="schedule" element={<Schedule />} />
//           <Route path="statistics" element={<Statistics />}>
//             <Route path="gpa" element={<GPA />} />
//             <Route path="feedback" element={<FeedBack />} />
//           </Route>
//         </Route>
//       </Route>
//     </Route>
//   </>
// );

// export default AdminRoutes;
