import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import MainLayout from "../../components/MainLayout/MainLayout";
import { showSuccessNotification } from "../../components/Notifications/Notifications";

const MainPage = () => {

  const navigate = useNavigate();
  const auth = getAuth(); // Lấy instance của Firebase Auth

  const handleLogout = async () => {
    try {
      await signOut(auth);
      sessionStorage.clear();
      window.location.href = "/login"; // Chuyển hướng thay vì đóng cửa sổ
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
  };
  
  const role = sessionStorage.getItem("selectedRole");

  useEffect(() => {
    // Check if notification was already shown
    const notificationShown = sessionStorage.getItem("notificationShown");

    if (!notificationShown) {
      if (role === "admin") {
        showSuccessNotification("Login success with role Admin");
      }
      if (role === "managerStore") {
        showSuccessNotification("Login success with role managerStore");
      } 
      if (role === "manager") {
        showSuccessNotification("Login success with role manager");
      } 
      // else if (role === "trainer") {
      //   showSuccessNotification("Login success with role Trainer");
      // } else if (role === "deliverymanager") {
      //   showSuccessNotification("Login success with role Delivery Manager");
      // } else if (role === "trainermanager") {
      //   showSuccessNotification("Login success with role Trainer Manager");
      // } else if (role === "FAMadmin") {
      //   showSuccessNotification("Login success with role FAM Admin");
      // }

      // Set flag to prevent notification from showing again
      sessionStorage.setItem("notificationShown", "true");
    }
  }, [role]);

  return (
    <div>
      <MainLayout />;
      <button onClick={handleLogout} style={styles.button}>Đăng xuất</button>
    </div>
  );
};
const styles = {
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#ff4d4f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  }
};
export default MainPage;
