import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/useAuth";
import "./LoginPage.css";
import RoleSelectionPopup from "./RoleSelectionPopUp/RoleSelectionPopup";
import kohicoffee from "../../assets/kohicoffee.png";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import LoginLoader from "./RoleSelectionPopUp/LoginLoader/LoginLoader";
import NetworkError from "./RoleSelectionPopUp/LoginNetworkError/NetworkError";
import { auth, provider } from "../../config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import MainPage from "../AdminPage/MainPage";
import { axiosInstance } from "../../axios/Axios"

const adminRoles = ["admin"];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [ShowLoaderPopup, setShowLoaderPopup] = useState(false);
  const [noConnectionPopup, setNoConnectionPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Xử lý đăng nhập bằng Google
  const handleGoogleLogin = async () => {
    try {
      console.log("🛠 Bắt đầu đăng nhập Google...");
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
  
      console.log("✅ Đăng nhập thành công:", result.user);
  
      // Lưu email vào localStorage
      setEmail(userEmail);
      sessionStorage.setItem("email", userEmail);
  
      // 📌 Set cứng role admin & manager
      if (userEmail === "nguyentuananh200904@gmail.com") {
        sessionStorage.setItem("selectedRole", "admin");
        navigate("/adminPage");
        return;
      } 
      
      if (userEmail === "hadntse171721@fpt.edu.vn") {
        sessionStorage.setItem("selectedRole", "manager");
        navigate("/managerPage");
        return;
      }
      // if (userEmail === "phongpvse161146@fpt.edu.vn") {
      //   sessionStorage.setItem("selectedRole", "manager");
      //   navigate("/managerPage");
      //   return;
      // } 
      // 🔹 Gọi API để kiểm tra danh sách managerStore
      try {
        const response = await axiosInstance.get("https://coffeeshop.ngrok.app/api/managers?sortBy=ManagerId&isAscending=true&page=1&pageSize=10");
        const managers = response.data.managers; // Lấy danh sách managers từ API
  
        console.log("🎯 Danh sách managerStore từ API:", managers);
  
        // Kiểm tra xem email có trong danh sách managerStore không
        console.log("📩 Email đăng nhập:", userEmail);
        console.log("🎯 Danh sách managers từ API:", managers);

        // Kiểm tra danh sách managers có chứa email đăng nhập hay không
        const isManagerStore = managers.some(manager => {
          console.log(`🔍 So sánh ${manager.email.toLowerCase()} với ${userEmail.toLowerCase()}`);
          return manager.email.toLowerCase() === userEmail.toLowerCase();
        });

        console.log("✅ Kết quả kiểm tra managerStore:", isManagerStore);

  
        if (isManagerStore) {
          sessionStorage.setItem("selectedRole", "managerStore");
          console.log(sessionStorage.getItem("email"));
          console.log(sessionStorage.getItem("selectedRole"));

          navigate("/managerStorePage");
          return;
        }
  
      } catch (error) {
        console.error("❌ Lỗi khi gọi API managerStore:", error);
      }
  
      // Mặc định nếu không thuộc các role trên thì set "user"
      sessionStorage.setItem("selectedRole", "user");
      navigate("/userPage");
  
    } catch (error) {
      console.error("❌ Lỗi đăng nhập Google:", error.code, error.message);
    }
  };


  // Xử lý đăng nhập bằng username/password
  const handleLogin = async (e) => {
    e.preventDefault();
    setRoles([]);
    sessionStorage.removeItem("selectedRole");
    setShowLoaderPopup(true);
    setNoConnectionPopup(false);

    const roles = await login(username, password);
    if (roles) {
      setShowLoaderPopup(false);
      if (roles.includes("admin")) {
        handleRoleSelection("admin");
      } else {
        setMessage("No valid roles found for this account!");
      }
    } else {
      setMessage("The username or password is incorrect!");
      setUsername("");
      setPassword("");
      setShowLoaderPopup(false);
    }
  };

  // Xử lý chọn role
  const handleRoleSelection = (selectedRole) => {
    sessionStorage.setItem("selectedRole", selectedRole);
    navigate("/adminPage");
  };

  // Hiển thị/ẩn mật khẩu
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setPlayAnimation(true);
  }, []);

  return (
    <div className="login-container">
      <div className={`startTop ${playAnimation ? "startup-animation" : ""}`}>
        {/* <svg id="logo-svg" xmlns="http://www.w3.org/2000/svg"
          version="1.1" viewBox="0 0 1600 383" width="2161" height="518">

        </svg> */}
        <img src={kohicoffee} alt="FSA Logo" />
      </div>
      <div className={`startBot ${playAnimation ? "startup-animation" : ""}`}>
        {/* <div className="fsa-logo">
          <img src={kohicoffee} alt="FSA Logo" />
        </div> */}
        <div className="login-box">
          <div className="login-content">
            <form onSubmit={handleLogin}>
              <div
                className={`title ${playAnimation ? "startup-animation" : ""}`}
              >
                <span>L</span> <span>o</span> <span>g</span> <span>I</span> <span>n</span> <span>|</span>
              </div>
              <div className="input-field">
                <label>Personal Email/Username</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Enter your email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <div className="passContainer">
                  <label>Password</label>
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {showPassword ? (
                  <EyeInvisibleOutlined
                    className="hidePass"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeOutlined
                    className="showPass"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
              {message && <p className="error-message">{message}</p>}
              <div className="action">
                <button className="login-button" type="submit">
                  Log in
                </button>
                {/* Nút đăng nhập bằng Google */}


              </div>
            </form>
            <div>
              <button onClick={handleGoogleLogin} className="google-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 20 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Đăng nhập bằng Google
              </button>
              {/* <button
                  className="login-button"
                  onClick={() => {
                    navigate("./feedback/verify-email");
                  }}
                >

                </button> */}
            </div>
          </div>
        </div>
      </div>
      {ShowLoaderPopup && <LoginLoader />}
      {showRolePopup && (
        <RoleSelectionPopup onSelectRole={handleRoleSelection} roles={roles} />
      )}
      {noConnectionPopup && <NetworkError />}
    </div>
  );
};

export default Login;