import { useState, useContext, createContext, useEffect } from "react";
import RoleSelectionPopup from "../../pages/LoginPage/RoleSelectionPopUp/RoleSelectionPopup";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRolePopup, setShowRolePopup] = useState(false);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const hardcodedUser = {
      email: "test@example.com",
      password: "password123",
      roles: ["admin", "user"],
    };

    if (username === hardcodedUser.email && password === hardcodedUser.password) {
      sessionStorage.setItem("username", hardcodedUser.email);
      sessionStorage.setItem("selectedRole", hardcodedUser.roles[0]);

      setUser({ roles: hardcodedUser.roles, selectedRole: hardcodedUser.roles[0] });
      return hardcodedUser.roles;
    } else {
      return null;
    }
  };

  const selectedRole = (role) => {
    setUser((prevUser) => ({ ...prevUser, selectedRole: role }));
    sessionStorage.setItem("selectedRole", role);
    setShowRolePopup(false);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, showRolePopup, setShowRolePopup }}>
      {showRolePopup && user && user.roles && (
        <RoleSelectionPopup onSelectRole={selectedRole} roles={user.roles} />
      )}
      {children}
    </AuthContext.Provider>
  );
};
