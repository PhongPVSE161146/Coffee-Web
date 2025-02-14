import React, { useEffect } from "react";
import MainLayout from "../../components/MainLayout/MainLayout";
// import { showSuccessNotification } from "../../components/Notifications/Notifications";

const MainPage = () => {
  // const role = sessionStorage.getItem("selectedRole");

  // useEffect(() => {
  //   // Check if notification was already shown
  //   const notificationShown = sessionStorage.getItem("notificationShown");

  //   if (!notificationShown) {
  //     if (role === "admin") {
  //       showSuccessNotification("Login success with role Admin");
  //     } else if (role === "trainer") {
  //       showSuccessNotification("Login success with role Trainer");
  //     } else if (role === "deliverymanager") {
  //       showSuccessNotification("Login success with role Delivery Manager");
  //     } else if (role === "trainermanager") {
  //       showSuccessNotification("Login success with role Trainer Manager");
  //     } else if (role === "FAMadmin") {
  //       showSuccessNotification("Login success with role FAM Admin");
  //     }

  //     // Set flag to prevent notification from showing again
  //     sessionStorage.setItem("notificationShown", "true");
  //   }
  // }, [role]);

  return (
    <div>
      <MainLayout />;
    </div>
  );
};

export default MainPage;
