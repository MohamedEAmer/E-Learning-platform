import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import Register from "./pages/RegisterLogin/Register.jsx";
import Login from "./pages/RegisterLogin/Login.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import CreateCourse from "./pages/Course/CreateCourse.jsx";
import AttendeesCourses from "./pages/AttendeesCourses.jsx";
import EditCourse from "./pages/Course/EditCourse.jsx";
import DeleteCourse from "./pages/Course/DeleteCourse.jsx";
import Home from "./pages/Home.jsx";
import CourseContent from "./pages/CourseContent/CourseContent.jsx";
import CourseInfo from "./pages/CourseContent/CourseInfo.jsx";
import InstructorUser from "./pages/InstructorUser/InstructorUser.jsx";
import UserMessage from "./pages/InstructorUser/UserMessage.jsx";
import InviteUser from "./pages/InviteUser/InviteUser.jsx";
import CreatSession from "./pages/Session/CreatSession.jsx";
import EditSession from "./pages/Session/EditSession.jsx";
import DeleteSession from "./pages/Session/DeleteSession.jsx";
import UserProvider from './context/userContext.js';
import Logout from './pages/Logout/Logout.jsx';
import Payment from './pages/Payment/Payment.jsx';
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "create", element: <CreateCourse /> },
      { path: "courses/users/:id", element: <AttendeesCourses /> },
      { path: "courses/:id/edit", element: <EditCourse /> },
      { path: "courses/:id/delete", element: <DeleteCourse /> },
      { path: "Instructor_User", element: <InstructorUser /> },
      { path: "UserMessage", element: <UserMessage /> },
      { path: "/sessions/course/:id", element: <CourseContent /> },
      { path: "invite", element: <InviteUser /> },
      { path: "payment/:id", element: <Payment /> },
      { path: 'logout',element: <Logout />},
      { path: 'course/:id/info',element: <CourseInfo />},
      {
        path: "sessions/course/:id/CreatSession",
        element: <CreatSession />,
      },
      {
        path: "sessions/course/:id/DeleteSession",
        element: <DeleteSession />,
      },
      {
        path: "sessions/course/:id/editsession",
        element: <EditSession />,
      },
      // /course/${courseID}/info
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
