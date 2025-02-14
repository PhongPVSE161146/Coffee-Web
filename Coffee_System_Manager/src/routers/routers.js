import { Navigate, createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { PATH_NAME } from "../constants/pathName";
import LeaderBoardPage from "../pages/LeaderBoardPage/LeaderBoardPage";
import PollPage from "../pages/PollPage/PollPage";
import MainLayout from "../pages/MainLayout/MainLayout";
import CreatePollPage from "../pages/CreatePollPage/CreatePollPage";
import { getUser } from "../helpers/user";

const PrivateRoute = ({ children }) => {
  const userLocalStorage = getUser();

  if (!userLocalStorage) {
    return <Navigate to={PATH_NAME.LOGIN} replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: PATH_NAME.HOME,
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "leaderboard",
        element: <LeaderBoardPage />,
      },
      {
        path: "add",
        element: <CreatePollPage />,
      },
      {
        path: "questions/:questionId",
        element: <PollPage />,
      },
    ],
  },
  {
    path: PATH_NAME.CREATE_POLL,
    element: <CreatePollPage />,
  },
  {
    path: PATH_NAME.LOGIN,
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
