// // TrainerRoutes.js
// import React from "react";
// import { Route } from "react-router-dom";
// import TrainerPage from "../pages/TrainerPage/TrainerPage";
// import TrainerTrainerManagement from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/TrainerTrainerManagement";
// import TrainerTrainerInformation from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/TrainerInformation/TrainerTrainerTrainerInformation";
// import TrainerTrainerUnitPrice from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/TrainerUnitPrice/TrainerTrainerUnitPrice";
// import TrainerClassList from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/ClassList/TrainerClassList";
// import TrainerSchedule from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/Schedule/TrainerTrainerSchedule";
// import TrainerScheduleTracker from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/ScheduleTracker/TrainerScheduleTracker";
// import TrainerStatistics from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/Statistics/TrainerStatistics";
// import TrainerConfirmation from "../pages/TrainerPage/TrainerPageComponent/TrainerConfirmation/TrainerConfirmation";
// import TraineeManagement from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeManagement";
// import PrivateRoutes from "./PrivateRoutes";

// const TrainerRoutes = () => (
//   <>
//     <Route
//       path="/trainerPage/*"
//       element={<PrivateRoutes requiredRole="trainer" />}
//     >
//       <Route index element={<TrainerPage />} />
//       <Route element={<TrainerPage />}>
//         <Route path="trainerConfirmation" element={<TrainerConfirmation />} />
//         <Route path="traineeManagement" element={<TraineeManagement />} />
//         <Route path="trainerManagement" element={<TrainerTrainerManagement />}>
//           <Route
//             path="trainerInformation"
//             element={<TrainerTrainerInformation />}
//           />
//           <Route
//             path="trainerUnitPrice"
//             element={<TrainerTrainerUnitPrice />}
//           />
//           <Route path="classList" element={<TrainerClassList />} />
//           <Route path="schedule" element={<TrainerSchedule />} />
//           <Route path="scheduleTracker" element={<TrainerScheduleTracker />} />
//           <Route path="statistics" element={<TrainerStatistics />} />
//         </Route>
//       </Route>
//     </Route>
//   </>
// );

// export default TrainerRoutes;
