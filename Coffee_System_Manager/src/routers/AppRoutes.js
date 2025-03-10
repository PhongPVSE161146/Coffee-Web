import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Unauthorized from "../components/Unauthorized/Unauthorized";
import LoginPage from "../pages/LoginPage/LoginPage";


//AdminRoutes
import MainPage from "../pages/AdminPage/MainPage";
import TrainerList from "../pages/AdminPage/AdminPageComponent/TrainerList/TrainerList";
import AddTrainer from "../pages/AdminPage/AdminPageComponent/AddTrainer/AddTrainer";
import ClassMangement from "../pages/AdminPage/AdminPageComponent/ClassManagement/ClassMangement";
import TraineeManagement from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeManagement";
import TrainerManagement from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerManagement";
import TrainerInformation from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerInformation/TrainerInformation";
import TrainerUnitPrice from "../pages/AdminPage/AdminPageComponent/TrainerManagement/TrainerUnitPrice/TrainerUnitPrice";
import ClassList from "../pages/AdminPage/AdminPageComponent/TrainerManagement/ClassList/ClassListHome/ClassList";
import Schedule from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Schedule/Schedule";
import Statistics from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Statistics/Statistics";
import GPA from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Statistics/GPA/GPA";
import LogWork from "../pages/AdminPage/AdminPageComponent/LogWork/LogWork";
import ContentManagement from "../pages/AdminPage/AdminPageComponent/ContentManagement/ContentManagement";
import FAQS from "../pages/AdminPage/AdminPageComponent/FAQS/FAQS";
import ScheduleTrackerReport from "../pages/AdminPage/AdminPageComponent/ClassManagement/ScheduleTrackerReport/ScheduleTrackerReport";
import FeedbackTemplate from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/CustomTemplate/components/FeedbackTemplate";
import AddTempalteHeader from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/CustomTemplate/components/AddnewTemplate/AddTempalteHeader";
//TrainerRoutes
import TrainerScheduleTracker from "../pages/TrainerPage/TrainerPageComponent/TrainerManagement/ScheduleTracker/TrainerScheduleTracker2";
import { AdminTrainerModuleDetail } from "../pages/AdminPage/AdminPageComponent/TrainerManagement/ClassList/AdminModuleDetail/AdminModuleDetail";
import { AdminModuleFeedback } from "../pages/AdminPage/AdminPageComponent/TrainerManagement/ClassList/AdminFeedback/AdminModuleFeedback";
import StatisticsPhase2 from "../pages/AdminPage/AdminPageComponent/StatisticsPhase2/StatisticsPhase2";
import FeedbackPhase2 from "../pages/AdminPage/AdminPageComponent/StatisticsPhase2/FeedbackPhase2/FeedbackPhase2";
import ClassTemplate from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/ClassTemplate/ClassTemplate";
import TraineeFeedback from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/TraineeFeedback";
import CustomTemplate from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeFeedback/CustomTemplate/CustomTemplate";
import NewClasslistHomePage from "../pages/AdminPage/AdminPageComponent/ClassManagement/NewClasslist/NewClasslistHomePage/NewClasslistHomePage";
import NewClassDetail from "../pages/AdminPage/AdminPageComponent/ClassManagement/NewClasslist/NewClassDetail/NewClassDetail";
import GeneralData from "../pages/AdminPage/AdminPageComponent/StatisticsPhase2/GeneralData/GeneralData";
import MouduleStatistic from "../pages/AdminPage/AdminPageComponent/StatisticsPhase2/MouduleStatistic/MouduleStatistic";
import StatisticGPA from "../pages/AdminPage/AdminPageComponent/StatisticsPhase2/GPA/StatisticGPA";
import Report from "../pages/AdminPage/AdminPageComponent/Report/Report";
import { ConfigEffortDeadline } from "../pages/AdminPage/AdminPageComponent/ConfigEffortDeadline/ConfigEffortDeadline";
import ScheduleDetail from "../pages/AdminPage/AdminPageComponent/TrainerManagement/Schedule/ScheduleDetail/ScheduleDetail";
import ProfilePage from "../pages/ProfilePage/Profile";
import FAMTrainerManagement from "../pages/AdminPage/AdminPageComponent/FAMTrainerManagement/FAMTrainerManagement";

// Feedback Routes
import VerifyEmail from "../pages/FeedbackPage/VerifyEmail";
import UserFeedback from "../pages/FeedbackPage/UserFeedback";
import SuccessPage from "../pages/FeedbackPage/Success";
import { ViewCV } from "../pages/ProfilePage/components/ViewCV/ViewCV";
import InProgressClass from "../pages/AdminPage/AdminPageComponent/ClassManagement/InProgressClass";
import Checkpoint from "../pages/AdminPage/AdminPageComponent/ClassManagement/Checkpoint";
import TraineeList from "../pages/AdminPage/AdminPageComponent/TraineeManagement/TraineeList";
import ConfigHoliday from "../pages/AdminPage/AdminPageComponent/ConfigEffortDeadline/ConfigHoliday";
import ConfigSlotTime from "../pages/AdminPage/AdminPageComponent/ConfigEffortDeadline/ConfigSlotTime";
import ConfigUnitPrice from "../pages/AdminPage/AdminPageComponent/ConfigEffortDeadline/ConfigUnitPrice";
import MyEffort from "../pages/AdminPage/AdminPageComponent/LogWork/MyEffort";
import DeclareEfforts from "../pages/AdminPage/AdminPageComponent/LogWork/DeclareEfforts";
import AddExtensionEfforts from "../pages/AdminPage/AdminPageComponent/LogWork/AddExtendsion";
import ConfirmEfforts from "../pages/AdminPage/AdminPageComponent/LogWork/ConfirmEfforts";
import TrainingCourseProgram from "../pages/AdminPage/AdminPageComponent/ContentManagement/TrainingCourseProgram";
import TrainingProgram from "../pages/AdminPage/AdminPageComponent/ContentManagement/TrainningProgam";
import Topic from "../pages/AdminPage/AdminPageComponent/ContentManagement/Topic";
import Exportdate from "../pages/AdminPage/AdminPageComponent/Report/Exportdate";
import AppCodeConfig from "../pages/AdminPage/AdminPageComponent/FAMSSetting/AppCodeConfig";
import EmailTemplate from "../pages/AdminPage/AdminPageComponent/FAMSSetting/EmailTemplate";
import UserManagement from "../pages/AdminPage/AdminPageComponent/FAMSSetting/UserManagement";
import SchedulerManagement from "../pages/AdminPage/AdminPageComponent/FAMSSetting/SchedulerManagement";
import ClassConfirmationTable from "../pages/TrainerPage/TrainerPageComponent/TrainerConfirmation/TrainerConfirmation";
import ClassDetail from "../pages/TrainerPage/TrainerPageComponent/ClassDetails/ClassDetail";
import ClassInfo from "../pages/TrainerPage/TrainerPageComponent/ClassDetails/ClassInfo/ClassInfo";

const AppRoutes = () => (
  <Routes>
    <Route path="/unauthorized" element={<Unauthorized />}></Route>
    <Route path="/" element={<LoginPage />} />
    <Route path="/adminPage" element={<PrivateRoutes requiredRole="admin" />}>
      <Route index element={<MainPage />} />
      <Route element={<MainPage />}>
        <Route path="Profile" element={<ProfilePage />}></Route>
        <Route path="trainerList" element={<TrainerList />} />
        <Route path="addTrainer" element={<AddTrainer />} />
        <Route path="classManagement" element={<ClassMangement />} />
        <Route path="feedback-template/:templateId" element={<FeedbackTemplate />} />
        <Route path="traineeManagement" element={<TraineeManagement />}>
          <Route path="traineeFeedback" element={<TraineeFeedback />} />
          <Route path="feedback/:templateId" element={<AdminModuleFeedback />} />
          <Route path="customTemplate" element={<CustomTemplate />} />
          <Route path="classTemplate" element={<ClassTemplate />} />
          <Route
            path="traineeManagement/feedback-template"
            element={<FeedbackTemplate />}
          />
        </Route>
        <Route
          path="moduleDetail/:moduleId"
          element={<AdminTrainerModuleDetail />}
        />

        <Route path="statisticsPhase2" element={<StatisticsPhase2 />}>
          <Route path="feedback" element={<FeedbackPhase2 />} />
          <Route path="generaldata" element={<GeneralData />} />
          <Route path="modulestatistic" element={<MouduleStatistic />} />
          <Route path="gpa" element={<StatisticGPA />} />
        </Route>
        <Route path="Exportdate" element={<Exportdate />} />
        <Route path="Topic" element={<Topic />} />
        <Route path="TrainingProgram" element={<TrainingProgram />} />
        <Route path="TrainingCourseProgram" element={<TrainingCourseProgram />} />
        <Route path="ConfirmEfforts" element={<ConfirmEfforts />} />
        <Route path="AddExtensionEfforts" element={<AddExtensionEfforts />} />
        <Route path="DeclareEfforts" element={<DeclareEfforts />} />
        <Route path="MyEffort" element={<MyEffort />} />
        <Route path="traineelist" element={<TraineeList />} />
        <Route path="CheckPoint" element={<Checkpoint />} />
        <Route path="newclasslist" element={<NewClasslistHomePage />} />
        <Route path="classDetail/:id" element={<NewClassDetail />} />
        <Route path="inProgressClass" element={<InProgressClass />} />
        <Route
          path="trainerManagement/:account"
          element={<TrainerManagement />}
        >
          <Route path="Profile" element={<ProfilePage />} />
          <Route path="trainerUnitPrice" element={<TrainerUnitPrice />} />
          <Route path="classList" element={<ClassList />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="statistics" element={<Statistics />}>
            <Route path="gpa" element={<GPA />} />
          </Route>
        </Route>
        <Route path="scheduleTrackerReport" element={<ScheduleTrackerReport />} />
        <Route path="logWork" element={<LogWork />} />
        <Route path="contentManagement" element={<ContentManagement />} />
        <Route path="faqs" element={<FAQS />} />
        <Route path="report" element={<Report />} />
      </Route>
    </Route>

    <Route
      path="/trainerPage"
      element={<PrivateRoutes requiredRole="trainer" />}
    >
      <Route element={<MainPage />}>
        <Route path="scheduleDetail" element={<ScheduleDetail />} /> {/*temporary set up for design*/}
      </Route>
      <Route index element={<MainPage />} />
      <Route element={<MainPage />}>
        <Route path="Profile" element={<ProfilePage />}></Route>
        <Route path="TrainerConfirmation" element={<ClassConfirmationTable />} ></Route>
        <Route path="classdetailConfirm/:className" element={<ClassDetail />} ></Route>
        <Route path="traineeManagement" element={<TraineeManagement />} >
          <Route path="traineeFeedback" element={<TraineeFeedback />} />
          <Route path="customTemplate" element={<CustomTemplate />} />
          <Route path="classTemplate" element={<ClassTemplate />} />
        </Route>
        <Route
          path="trainerManagement/:account"
          element={<TrainerManagement />}
        ></Route>
        <Route
          path="moduleDetail/:moduleId"
          element={<AdminTrainerModuleDetail />}
        />
        <Route path="statisticsPhase2" element={<StatisticsPhase2 />}>
          <Route path="feedback" element={<FeedbackPhase2 />} />
          <Route path="generaldata" element={<GeneralData />} />
          <Route path="modulestatistic" element={<MouduleStatistic />} />
          <Route path="gpa" element={<StatisticGPA />} />
        </Route>
        <Route path="ConfirmEfforts" element={<ConfirmEfforts />} />
        <Route path="AddExtensionEfforts" element={<AddExtensionEfforts />} />
        <Route path="DeclareEfforts" element={<DeclareEfforts />} />
        <Route path="MyEffort" element={<MyEffort />} />
        <Route path="inProgressClass" element={<InProgressClass />} />
        <Route path="feedback/:templateId" element={<AdminModuleFeedback />} />
        <Route path="NewClassList" element={<NewClasslistHomePage />} />
        <Route path="classDetail/:id" element={<NewClassDetail />} />
        <Route path="trainerManagement" element={<TrainerManagement />}>
          <Route path="Profile" element={<ProfilePage />} />
          <Route path="trainerInformation" element={<TrainerInformation />} />
          <Route path="trainerUnitPrice" element={<TrainerUnitPrice />} />
          <Route path="classList" element={<ClassList />} />
          <Route path="schedule" element={<Schedule />} />
          <Route
            path="scheduleTracker"
            element={<TrainerScheduleTracker />}
          ></Route>
          <Route path="statistics" element={<Statistics />}>
            <Route path="gpa" element={<GPA />} />
          </Route>
        </Route>
        <Route path="logWork" element={<LogWork />} />
        <Route path="contentManagement" element={<ContentManagement />} />
        <Route path="faqs" element={<FAQS />} />
      </Route>
    </Route>

    <Route
      path="/DeliveryManagerPage"
      element={<PrivateRoutes requiredRole="deliverymanager" />}
    >
      <Route index element={<MainPage />} />
      <Route element={<MainPage />}>
        <Route path="scheduleTrackerReport" element={<ScheduleTrackerReport />} />
        <Route path="Profile" element={<ProfilePage />} />
        <Route path="addTrainer" element={<AddTrainer />} />
        <Route path="statisticsPhase2" element={<StatisticsPhase2 />}>
          <Route path="feedback" element={<FeedbackPhase2 />} />
          <Route path="generaldata" element={<GeneralData />} />
          <Route path="modulestatistic" element={<MouduleStatistic />} />
          <Route path="gpa" element={<StatisticGPA />} />
        </Route>
        <Route path="ConfigUnitPrice" element={<ConfigUnitPrice />} />
        <Route path="ConfigSlotTime" element={<ConfigSlotTime />} />
        <Route path="ConfigHoliday" element={<ConfigHoliday />} />
        <Route path="traineelist" element={<TraineeList />} />
        <Route path="classManagement" element={<ClassMangement />} />
        <Route path="NewClassList" element={<NewClasslistHomePage />} />
        <Route path="inProgressClass" element={<InProgressClass />} />
        <Route path="CheckPoint" element={<Checkpoint />} />
        <Route path="classDetail/:id" element={<NewClassDetail />} />
        <Route path="feedback-template/:templateId" element={<FeedbackTemplate />} />
        <Route
          path="trainerManagement/:account"
          element={<TrainerManagement />}
        >

          <Route path="Profile" element={<ProfilePage />} />
          <Route path="trainerUnitPrice" element={<TrainerUnitPrice />} />
          <Route path="classList" element={<ClassList />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="statistics" element={<Statistics />}>
            <Route path="gpa" element={<GPA />} />
          </Route>
        </Route>
        <Route path="scheduleDetail" element={<ScheduleDetail />} />
        <Route path="trainerList" element={<TrainerList />} />
        <Route path="add-template" element={<AddTempalteHeader />} />
        <Route path="traineeManagement" element={<TraineeManagement />}>

          <Route path="traineeFeedback" element={<TraineeFeedback />} />
          <Route path="feedback/:templateId" element={<AdminModuleFeedback />} />
          <Route path="customTemplate" element={<CustomTemplate />} />
          <Route path="classTemplate" element={<ClassTemplate />} />
          <Route path="schedule" element={<Schedule />} />
          <Route
            path="traineeManagement/feedback-template"
            element={<FeedbackTemplate />}
          />

        </Route>
        <Route path="configeffortdeadline" element={<ConfigEffortDeadline />} />
        <Route path="logWork" element={<LogWork />} />
        <Route path="contentManagement" element={<ContentManagement />} />
        <Route path="report" element={<Report />} />
        <Route path="faqs" element={<FAQS />} />
        <Route path="scheduleTrackerReport" element={<ScheduleTrackerReport />} />
      </Route>
    </Route>

    <Route
      path="/TrainermanagerPage"
      element={<PrivateRoutes requiredRole="trainermanager" />}
    >
      <Route index element={<MainPage />} />
      <Route element={<MainPage />}>
        <Route path="Profile" element={<ProfilePage />}></Route>
        <Route path="Newclasslist" element={<NewClasslistHomePage />} />
        <Route path="classDetail/:id" element={<NewClassDetail />} />
        <Route path="traineeManagement" element={<TraineeManagement />} >
          <Route path="traineeFeedback" element={<TraineeFeedback />} />
          <Route path="customTemplate" element={<CustomTemplate />} />
          <Route path="classTemplate" element={<ClassTemplate />} />
        </Route>
        <Route path="feedback-template" element={<FeedbackTemplate />} />
        <Route path="statisticsPhase2" element={<StatisticsPhase2 />}>
          <Route path="feedback" element={<FeedbackPhase2 />} />
          <Route path="generaldata" element={<GeneralData />} />
          <Route path="modulestatistic" element={<MouduleStatistic />} />
          <Route path="gpa" element={<StatisticGPA />} />
        </Route>
        <Route path="Topic" element={<Topic />} />
        <Route path="TrainingProgram" element={<TrainingProgram />} />
        <Route path="TrainingCourseProgram" element={<TrainingCourseProgram />} />
        <Route path="ConfirmEfforts" element={<ConfirmEfforts />} />
        <Route path="AddExtensionEfforts" element={<AddExtensionEfforts />} />
        <Route path="DeclareEfforts" element={<DeclareEfforts />} />
        <Route path="MyEffort" element={<MyEffort />} />
        <Route path="CheckPoint" element={<Checkpoint />} />
        <Route path="inProgressClass" element={<InProgressClass />} />
        <Route path="logWork" element={<LogWork />} />
        <Route path="contentManagement" element={<ContentManagement />} />
        <Route path="faqs" element={<FAQS />} />
        <Route path="scheduleTrackerReport" element={<ScheduleTrackerReport />} />
      </Route>
    </Route>

    <Route
      path="/FAMAdminPage"
      element={<PrivateRoutes requiredRole="FAMadmin" />}
    >
      <Route index element={<MainPage />} />
      <Route element={<MainPage />}>
        <Route path="CVHistory" element={<ViewCV />} />   {/*note*/}
        <Route path="Profile" element={<ProfilePage />}></Route>
        <Route path="Newclasslist" element={<NewClasslistHomePage />} />
        <Route path="classDetail/:id" element={<NewClassDetail />} >
          <Route path="classinfo" element={<ClassInfo />} />
          <Route path="TraineeList" element={<TraineeList />} />
        </Route>
        <Route
          path="scheduleTrackerReport"
          element={<ScheduleTrackerReport />}
        />
        <Route path="FAMtrainermanagement" element={<FAMTrainerManagement />} />
        <Route path="traineeManagement" element={<TraineeManagement />}>
          <Route path="traineeFeedback" element={<TraineeFeedback />} />
          <Route path="customTemplate" element={<CustomTemplate />} />
          <Route path="classTemplate" element={<ClassTemplate />} />
        </Route>
        <Route path="statisticsPhase2" element={<StatisticsPhase2 />}>
          <Route path="feedback" element={<FeedbackPhase2 />} />
          <Route path="generaldata" element={<GeneralData />} />
          <Route path="modulestatistic" element={<MouduleStatistic />} />
          <Route path="gpa" element={<StatisticGPA />} />
        </Route>
        <Route path="logWork" element={<LogWork />} />
        <Route path="faqs" element={<FAQS />} />
        <Route path="ConfirmEfforts" element={<ConfirmEfforts />} />
        <Route path="AddExtensionEfforts" element={<AddExtensionEfforts />} />
        <Route path="DeclareEfforts" element={<DeclareEfforts />} />
        <Route path="MyEffort" element={<MyEffort />} />
        <Route path="CheckPoint" element={<Checkpoint />} />
        <Route path="inProgressClass" element={<InProgressClass />} />
        <Route path="AppCodeConfig" element={<AppCodeConfig />} />
        <Route path="EmailTemplate" element={<EmailTemplate />} />
        <Route path="UserManagement" element={<UserManagement />} />
        <Route path="SchedulerManagement" element={<SchedulerManagement />} />
        <Route path="TrainerManagement" element={<TrainerManagement />} />
      </Route>
    </Route>

    {/* <Route path="/feedback">
      <Route index path="verify-email" element={<VerifyEmail />} />
      <Route path="form" element={<UserFeedback />} />
      <Route path="success" element={<SuccessPage />} />
    </Route> */}
  </Routes>
);

export default AppRoutes;
