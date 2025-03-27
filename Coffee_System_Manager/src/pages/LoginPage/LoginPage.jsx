// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../features/Auth/useAuth";
// import "./LoginPage.css";
// import RoleSelectionPopup from "./RoleSelectionPopUp/RoleSelectionPopup";
// import kohicoffee from "../../assets/kohicoffee.png";
// import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
// import LoginLoader from "./RoleSelectionPopUp/LoginLoader/LoginLoader";
// import NetworkError from "./RoleSelectionPopUp/LoginNetworkError/NetworkError";

// const trainerRole = ["TRAINER"];
// const adminRoles = ["CLASS_ADMIN", "FA_MANAGER"];
// const deliveryManagerRoles = ["DELIVERY_MANAGER", "CHECKPOINT_REVIEWER"];
// const trainerManagerRole = ["TRAINER_MANAGER"];
// const FAMdminRoles = ["FAMS_ADMIN"];

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [ShowLoaderPopup, setShowLoaderPopup] = useState(false);
//   const [noConnectionPopup, setNoConnectionPopup] = useState(false);
//   const [showRolePopup, setShowRolePopup] = useState(false);
//   const [playAnimation, setPlayAnimation] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setRoles([]);
//     sessionStorage.removeItem("selectedRole");
//     setShowLoaderPopup(true);
//     setNoConnectionPopup(false);

//     try {
//       const roles = await login(username, password);
//       if (roles === 'connectionDown') { setNoConnectionPopup(true); roles = null; }
//       if (roles) {
//         setShowLoaderPopup(false);
//         const userRoles = [];

//         if (roles.some((role) => adminRoles.includes(role))) {
//           userRoles.push("admin");
//         }
//         if (roles.some((role) => FAMdminRoles.includes(role))) {
//           userRoles.push("FAMadmin");
//         }
//         if (roles.some((role) => trainerRole.includes(role))) {
//           userRoles.push("trainer");
//         }
//         if (roles.some((role) => deliveryManagerRoles.includes(role))) {
//           userRoles.push("deliverymanager");
//         }
//         if (roles.some((role) => trainerManagerRole.includes(role))) {
//           userRoles.push("trainermanager");
//         }

//         if (userRoles.length === 1) {
//           // Automatically navigate if only one role is available
//           handleRoleSelection(userRoles[0]);
//         } else if (userRoles.length > 1) {
//           // Show popup if multiple roles are available
//           setRoles(userRoles);
//           setShowRolePopup(true);
//         } else {
//           setMessage("There are no valid roles for this account!");
//         }
//       } else {
//         setMessage("The username or password is incorrect!");
//         setUsername("");
//         setPassword("");
//         setShowLoaderPopup(false);
//       }
//     } catch (error) {
//       //console.error("Login error:", error);
//       setShowLoaderPopup(false);
//       setMessage("An error occurred during login. Please try again.");
//     }
//   };

//   const handleRoleSelection = (selectedRole) => {
//     sessionStorage.setItem("selectedRole", selectedRole);
//     setShowRolePopup(false);

//     if (selectedRole === "admin") {
//       navigate("/adminPage");
//     } else if (selectedRole === "trainer") {
//       navigate("/trainerPage");
//     } else if (selectedRole === "deliverymanager") {
//       navigate("/DeliveryManagerPage");
//     } else if (selectedRole === "trainermanager") {
//       navigate("/TrainermanagerPage");
//     } else if (selectedRole === "FAMadmin") {
//       navigate("/FAMAdminPage");
//     }
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   useEffect(() => {
//     setPlayAnimation(true);
//   }, []);
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/Auth/useAuth";
import "./LoginPage.css";
import RoleSelectionPopup from "./RoleSelectionPopUp/RoleSelectionPopup";
import kohicoffee from "../../assets/kohicoffee.png";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import LoginLoader from "./RoleSelectionPopUp/LoginLoader/LoginLoader";
import NetworkError from "./RoleSelectionPopUp/LoginNetworkError/NetworkError";

const adminRoles = ["admin"];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [roles, setRoles] = useState([]);
  const [ShowLoaderPopup, setShowLoaderPopup] = useState(false);
  const [noConnectionPopup, setNoConnectionPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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

  const handleRoleSelection = (selectedRole) => {
    sessionStorage.setItem("selectedRole", selectedRole);
    navigate("/adminPage");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setPlayAnimation(true);
  }, []);
  return (
    <div className="login-container">

      <div className={`startTop ${playAnimation ? "startup-animation" : ""}`}>

        <img src={kohicoffee} alt="FSA Logo" />
      </div>
      <div className={`startBot ${playAnimation ? "startup-animation" : ""}`}>

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
                {/* <button
                  className="login-button"
                  onClick={() => {
                    navigate("./feedback/verify-email");
                  }}
                >

                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {ShowLoaderPopup && (
        <LoginLoader />
      )}
      {showRolePopup && (
        <RoleSelectionPopup onSelectRole={handleRoleSelection} roles={roles} />
      )}

      {noConnectionPopup && (
        <NetworkError />
      )}
    </div>
  );
};

export default Login;
