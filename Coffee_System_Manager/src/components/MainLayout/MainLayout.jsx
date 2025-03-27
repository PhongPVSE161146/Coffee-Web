import React, { useState, useEffect } from "react";
import "./MainLayout.css";
import {
  ScheduleOutlined,
  SolutionOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
  MenuOutlined,
  ContactsOutlined,
  TeamOutlined,
  BookOutlined,
  LogoutOutlined,
  CloseOutlined,
  FileExclamationOutlined,
  SettingOutlined,
  HomeOutlined,
  LineChartOutlined,
  setShowRolePopup,
  TagOutlined,
  ShopOutlined,
  MoneyCollectOutlined,
  ContainerOutlined,
  UserOutlined
} from "@ant-design/icons";

import kohicoffee from "../../assets/kohicoffee.png";
import { Button, Layout, Menu, theme, Badge, ConfigProvider, Dropdown } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { FaBell, FaRegUserCircle } from "react-icons/fa";
import { useAuth } from "../../features/Auth/useAuth";
import { useSwipeable } from "react-swipeable";
// import { AccountCircleRounded } from "@mui/icons-material";

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const [key, setKey] = useState(() => {
    return sessionStorage.getItem("activekey") || null;
  });
  const [collapsed, setCollapsed] = useState(false);
  const [responsiveCollapsed, responsiveSetCollapsed] = useState(
    window.innerWidth < 768
  );
  const [selectedKey, setSelectedKey] = useState(key);
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const username = sessionStorage.getItem("username");
  const role = sessionStorage.getItem("selectedRole");


  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate("/");
    }
  }, [role]);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      responsiveSetCollapsed(isMobile);
      setCollapsed(true);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => setCollapsed(true),
    onSwipedRight: () => setCollapsed(false),
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });
  const handleLogout = () => {
    // Logic để đăng xuất (nếu có), sau đó điều hướng về trang xác thực
    navigate('/');
    setUser(null);
    sessionStorage.clear();
  };

  const handleViewProfile = () => {
    navigate(`Profile`);
  };

  const menuProfile = [
    {
      key: '2',
      label: <span onClick={handleLogout}>Log out</span>
    }
  ];

  // Giả sử role được lấy từ state hoặc props
  // if (role === 'trainer') {
  //   menuProfile.unshift({
  //     key: '1',
  //     label: <span onClick={handleViewProfile}>Profile</span>
  //   });
  // }

  const menuItems = {
    admin: [
      {
        key: "1",
        icon: <HomeOutlined style={{ fontSize: "24px" }} />,
        label: "Tổng Quan",

      },
      {
        key: "2",
        icon: <LineChartOutlined style={{ fontSize: "24px" }} />,
        label: "Báo Cáo",
        children: [
          { key: "cl", label: "Báo Cáo Danh Thu", },
          { key: "ipc", label: "Báo cáo mặt hàng", },
          { key: "cp", label: "Báo cáo tài chính", },

        ],
      },
      {
        key: "3",
        icon: <ContainerOutlined style={{ fontSize: "24px" }} />,
        label: "Mặt Hàng",
        children: [
          { key: "tl", label: "Danh Sách Mặt Hàng", },
          { key: "tf", label: "Thức Đơn", },

        ],
      },
      {
        key: "4",
        icon: <TeamOutlined style={{ fontSize: "24px" }} />,
        label: "Nhân Viên",
        children: [
          { key: "me", label: "Danh Sách Nhân Viên", },
          { key: "de", label: "Vai Trò Nhân Viên", },
        ],
      },
      {
        key: "5",
        icon: <TagOutlined style={{ fontSize: "24px" }} />,
        label: "Khuyến Mãi",
        // children: [

        //   { key: "aee", label: "Add Extension Efforts", },
        //   { key: "ce", label: "Confirm Efforts", },
        // ],
      },
      {
        key: "6",
        icon: <ShopOutlined style={{ fontSize: "24px" }} />,
        label: "Kho Hàng ",
        children: [
          { key: "tcp", label: "Danh Sách Tồn Kho", },
          { key: "tp", label: "Nhập Kho", },
          { key: "t", label: "Kiểm Kê Kho", },
        ],
      },
      {
        key: "7",
        icon: <MoneyCollectOutlined style={{ fontSize: "24px" }} />,
        label: "Thu Chi",
        children: [
          { key: "ed", label: "Danh Sách Phiếu", },
        ],
      },

      {
        key: "9",
        icon: <UserOutlined style={{ fontSize: "24px" }} />,
        label: "Khách Hàng",
        children: [
          { key: "cl", label: "Danh Sách Khách Hàng", },
          { key: "ipc", label: "Nhóm Khách Hàng ", },
          { key: "cp", label: "Thẻ Thành Viên ", },
          // { key: "str", label: "Schedule Tracker", },
        ],
      },

      {
        key: "logout",
        icon: <SettingOutlined style={{ fontSize: "24px" }} />,
        label: "Thiết Lập Quán",
      },
    ],

  };

  const handleMenuClick = (e) => {
    const key = e.key;
    if (role === "admin") {
      switch (e.key) {
        case "1":
          navigate("classManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        // case "2":
        //   navigate("trainerList");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // // case "3":
        // //   navigate("traineeManagement");
        // //   sessionStorage.setItem("activekey", key);
        // //   sessionStorage.removeItem("activeTag");
        // //   sessionStorage.removeItem("trainerData");
        // //   if (responsiveCollapsed) {
        // //     setCollapsed(!collapsed);
        // //   }
        // //   break;
        // case "4":
        //   navigate("statisticsPhase2/generaldata");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   sessionStorage.setItem("activeTag", " - General Data");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "tl":
        //   navigate("traineelist");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "tf":
        //   navigate("traineeManagement");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;

        // case "cl":
        //   navigate("NewClassList");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "5":
        //   navigate("logWork");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "6":
        //   navigate("contentManagement");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "7":
        //   navigate("report");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "8":
        //   navigate("setting");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "9":
        //   navigate("faqs");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "ipc":
        //   navigate("inProgressClass");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "cp":
        //   navigate("CheckPoint");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "me":
        //   navigate("MyEffort");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "de":
        //   navigate("DeclareEfforts");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "aee":
        //   navigate("AddExtensionEfforts");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "ce":
        //   navigate("ConfirmEfforts");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "tcp":
        //   navigate("TrainingCourseProgram");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "tp":
        //   navigate("TrainingProgram");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "t":
        //   navigate("Topic");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;
        // case "ed":
        //   navigate("Exportdate");
        //   sessionStorage.setItem("activekey", key);
        //   sessionStorage.removeItem("activeTag");
        //   sessionStorage.removeItem("trainerData");
        //   if (responsiveCollapsed) {
        //     setCollapsed(!collapsed);
        //   }
        //   break;

        // case "logout":
        //   logout();
        //   navigate("/");
        // default:
        //   break;
      }
    } else if (role === "trainer") {
      switch (e.key) {
        case "1":
          navigate("TrainerConfirmation");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "2":
          navigate("classManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "3":
          navigate("traineeManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "4":
          navigate("trainerManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "5":
          navigate("logWork");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "6":
          navigate("faqs");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cl":
          navigate("NewClassList");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ipc":
          navigate("inProgressClass");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "me":
          navigate("MyEffort");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "de":
          navigate("DeclareEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "aee":
          navigate("AddExtensionEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ce":
          navigate("ConfirmEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "logout":
          logout();
          navigate("/");
        default:
          break;
      }
    } else if (role === "deliverymanager") {
      switch (e.key) {
        case "1":
          navigate("classManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "2":
          navigate("trainerlist");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "stt":
          navigate("statisticsPhase2/generaldata");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          sessionStorage.setItem("activeTag", " - General Data");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tf":
          navigate("traineeManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "4":
          navigate("logWork");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "5":
          navigate("contentManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "6":
          navigate("report");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "8":
          navigate("faqs");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cl":
          navigate("NewClassList");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "str":
          navigate("scheduleTrackerReport");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tl":
          navigate("traineelist");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "csd":
          navigate("configeffortdeadline");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "str":
          navigate("scheduleTrackerReport");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ipc":
          navigate("inProgressClass");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }

          break;
        case "cp":
          navigate("CheckPoint");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ch":
          navigate("ConfigHoliday");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cst":
          navigate("ConfigSlotTime");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cup":
          navigate("ConfigUnitPrice");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "logout":
          logout();
          navigate("/");
        default:
          break;
      }
    }
    else if (role === "trainermanager") {
      switch (e.key) {
        case "1":
          navigate("classManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "2":
          navigate("traineeManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "3":
          navigate("statisticsPhase2/generaldata");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.setItem("activeTag", " - General Data");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "4":
          navigate("logWork");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "4":
          navigate("contentManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "5":
          navigate("faqs");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cl":
          navigate("NewClassList");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "str":
          navigate("scheduleTrackerReport");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ipc":
          navigate("inProgressClass");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cp":
          navigate("CheckPoint");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "me":
          navigate("MyEffort");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "de":
          navigate("DeclareEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "aee":
          navigate("AddExtensionEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ce":
          navigate("ConfirmEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tcp":
          navigate("TrainingCourseProgram");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tp":
          navigate("TrainingProgram");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "t":
          navigate("Topic");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "logout":
          logout();
          navigate("/");
        default:
          break;
      }
    }
    else if (role === "FAMadmin") {
      switch (e.key) {
        case "1":
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "2":
          navigate("traineeManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "3":
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "4":
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;

        case "5":
          navigate("faqs");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cl":
          navigate("NewClassList");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "str":
          navigate("scheduleTrackerReport");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tm":
          navigate("FAMtrainermanagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ipc":
          navigate("inProgressClass");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "cp":
          navigate("CheckPoint");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "me":
          navigate("MyEffort");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "de":
          navigate("DeclareEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "aee":
          navigate("AddExtensionEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "ce":
          navigate("ConfirmEfforts");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "acc":
          navigate("AppCodeConfig");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "et":
          navigate("EmailTemplate");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "um":
          navigate("UserManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "sm":
          navigate("SchedulerManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "tm":
          navigate("TrainerManagement");
          sessionStorage.setItem("activekey", key);
          sessionStorage.removeItem("activeTag");
          sessionStorage.removeItem("trainerData");
          if (responsiveCollapsed) {
            setCollapsed(!collapsed);
          }
          break;
        case "logout":
          logout();
          navigate("/");
        default:
          break;
      }
    }
  };

  return (
    <Layout hasSider {...handlers}>
      {responsiveCollapsed && (<>{!collapsed && (<div className="mainBackdropFilter" onClick={() => setCollapsed(!collapsed)} style={{ zIndex: "999", inset: 0, position: "absolute", backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(1.25px)" }}></div>)}</>)
      }
      <Sider
        className={`${collapsed ? 'sideBarDropdownControl' : ''}`}
        style={{
          zIndex: "999",
          height: "100%",
          position: "fixed",
          left: 0,
          top: 0,
        }}
        trigger={null}
        width={responsiveCollapsed ? collapsed ? 0 : 255 : collapsed ? 80 : 255}
      >
        {responsiveCollapsed && (
          <div
            style={{ height: "40px", color: "white" }}
            className="menu-handle"
          >
            <CloseOutlined onClick={() => setCollapsed(!collapsed)} />
          </div>
        )}

        {!collapsed && (
          <div style={{ height: "140px", marginLeft: 20 }} className="demo-logo-vertical">
            <img
              style={{
                width: "250px",
                height: "170px",
                transform: "translateX(-10%)",
              }}
              src={kohicoffee}
              alt="Kohi Coffee Logo"
            />
          </div>
        )}
        {collapsed && (
          <div style={{ height: "140px" }} className="demo-logo-vertical">
            <img
              style={{
                width: "250px",
                height: "140px",
                transform: "translateX(-18%)",
                clipPath: "inset(0 48% 0 0)",
              }}
              src={kohicoffee}
              alt="Kohi Coffee Logo"
            />
          </div>
        )}

        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemSelectedBg: "#9C9C9C61",
              },
            },
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            onClick={handleMenuClick}
            selectedKeys={[selectedKey]}
            onSelect={({ key }) => setSelectedKey(key)}
            items={(role && menuItems[role]) || []}
          />
        </ConfigProvider>
      </Sider>
      <Layout
        style={{
          width: "auto",
          position: "absolute",
          right: 0,
          top: 0,
          height: "100vh",
          left: responsiveCollapsed ? 0 : collapsed ? 80 : 255,
          minWidth: responsiveCollapsed ? "100%" : collapsed ? "calc(100% - 80px)" : "calc(100% - 255px)",
          width: responsiveCollapsed ? "100vw" : collapsed ? 'calc(100vw - 80px)' : 'calc(100vw - 255px)',
          transition: "width 0.2s",
        }}
      >
        <Header
          style={{
            border: "1px solid #a5a5a5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "40px",
            left: responsiveCollapsed ? 0 : collapsed ? 80 : 255,
            position: "fixed",
            right: 0,
            top: 0,
            padding: 0,
            background: colorBgContainer,
            zIndex: "100",
            width: responsiveCollapsed ? "100vw" : collapsed ? 'calc(100vw - 79px)' : 'calc(100vw - 254px)',
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "5px 20px",
              cursor: "pointer",
              lineHeight: 0,
            }}
          >
            <p className="user-welcome" style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {/* {role ? (
                <div className="user-info">
                  {role === 'trainer' && (<span className="role-container" style={{ backgroundColor: '#2ba510' }}>Trainer</span>)}
                  {role === 'admin' && (<span className="role-container" style={{ backgroundColor: '#ff4949' }}>Admin</span>)}
                  {role === 'deliverymanager' && (<span className="role-container" style={{ backgroundColor: '#1c00d2' }}>Delivery Manager</span>)}
                  {role === 'trainermanager' && (<span className="role-container" style={{ backgroundColor: '#009785' }}>Trainer Manager</span>)}
                  {role === 'FAMadmin' && (<span className="role-container" style={{ backgroundColor: '#cd7100' }}>FAMS Admin</span>)}
                </div>) : (<></>)} */}
              Welcome, {username}
            </p>
            <Dropdown menu={{ items: menuProfile }} trigger={['click']}>
              <span onClick={(e) => e.preventDefault()} className="dropdown-user">
                <FaRegUserCircle style={{ fontSize: '20px', marginLeft: '20px', cursor: 'pointer' }} />
              </span>
            </Dropdown>

            <p>
              <FaBell
                style={{
                  fontSize: "20px",
                }}
              />
            </p>
            <div
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                right: "20px",
                top: "10px",
                height: "9px",
                width: "9px",
                borderRadius: "50%",
                backgroundColor: "red",
                color: "white",
                fontSize: "7px",
              }}
            >
              9
            </div>
          </div>
        </Header>
        <Content
          style={{
            marginTop: "40px",
            overflow: "initial",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minWidth: responsiveCollapsed ? "100%" : collapsed ? "95%" : "83.5%",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout >
  );
};

export default MainLayout;
