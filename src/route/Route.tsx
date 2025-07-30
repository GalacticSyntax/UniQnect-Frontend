import About from "@/pages/About";
import AuthLayout from "@/pages/auth/AuthLayout";
import ChangePassword from "@/pages/auth/ChangePassword";
import Login from "@/pages/auth/Login";
import AddAdmissionOffice from "@/pages/dashboard/admission-office/AddAdmissionOffice";
import AddTeacher from "@/pages/dashboard/teacher/AddTeacher";
import AdmissionOfficePage from "@/pages/dashboard/admission-office/AdmissionOffice";
import AdmissionOfficeLayout from "@/pages/dashboard/admission-office/Layout";
import AttendancePage from "@/pages/dashboard/attendance/Attendance";
import CourseAttendance from "@/pages/dashboard/attendance/course/course-by-id/CourseAttendance";
import AttendancesLayout from "@/pages/dashboard/attendance/Layout";
import AddCoursePage from "@/pages/dashboard/course/AddCourse";
import CourseAdvisorPage from "@/pages/dashboard/course/Advisor";
import CoursePage from "@/pages/dashboard/course/Course";
import CourseLayout from "@/pages/dashboard/course/Layout";
import OfferedCoursePage from "@/pages/dashboard/course/Offered";
import RegisteredCoursePage from "@/pages/dashboard/course/Registered";
import CurriculumPage from "@/pages/dashboard/curriculum/Curriculum";
import CurriculumLayout from "@/pages/dashboard/curriculum/Layout";
import DashboardPage from "@/pages/dashboard/Dashboard";
import AddDepartment from "@/pages/dashboard/department/AddDepartment";
import DepartmentPage from "@/pages/dashboard/department/Department";
import EditDepartment from "@/pages/dashboard/department/EditDepartment";
import DepartmentLayout from "@/pages/dashboard/department/layout";
import DashboardLayout from "@/pages/dashboard/Layout";
import ProfileLayout from "@/pages/dashboard/profile/Layout";
import ProfilePage from "@/pages/dashboard/profile/Profile";
import ResultLayout from "@/pages/dashboard/result/Layout";
import ResultPage from "@/pages/dashboard/result/Result";
import AddSchool from "@/pages/dashboard/school/AddSchool";
import EditSchool from "@/pages/dashboard/school/EditSchool";
import SchoolLayout from "@/pages/dashboard/school/Layout";
import SchoolPage from "@/pages/dashboard/school/School";
import AddStudent from "@/pages/dashboard/student/AddStudent";
import StudentLayout from "@/pages/dashboard/student/Layout";
import StudentPage from "@/pages/dashboard/student/Student";
import TeacherLayout from "@/pages/dashboard/teacher/Layout";
import TeacherPage from "@/pages/dashboard/teacher/Teacher";
import AddUser from "@/pages/dashboard/user/AddUser";
import UserLayout from "@/pages/dashboard/user/Layout";
import UserPage from "@/pages/dashboard/user/User";
import Home from "@/pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router";
import AddAdvisorPage from "@/pages/dashboard/course/AddAdvisor";
import MyOfferedCourses from "@/pages/dashboard/course/My-offered-courses";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      { path: "", element: <Login /> },
      // { path: "change-password", element: <ChangePassword /> },
    ],
  },
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },

      {
        path: "profile",
        element: <ProfileLayout />,
        children: [{ path: ":id?", element: <ProfilePage /> }],
      },

      {
        path: "student",
        element: <StudentLayout />,
        children: [
          { index: true, element: <StudentPage /> },
          { path: "add", element: <AddStudent /> },
        ],
      },

      {
        path: "teacher",
        element: <TeacherLayout />,
        children: [
          { index: true, element: <TeacherPage /> },
          { path: "add", element: <AddTeacher /> },
        ],
      },

      {
        path: "admission-office",
        element: <AdmissionOfficeLayout />,
        children: [
          { index: true, element: <AdmissionOfficePage /> },
          { path: "add", element: <AddAdmissionOffice /> },
        ],
      },

      {
        path: "school",
        element: <SchoolLayout />,
        children: [
          { index: true, element: <SchoolPage /> },
          { path: "add", element: <AddSchool /> },
          { path: "edit/:id", element: <EditSchool /> },
        ],
      },

      {
        path: "user",
        element: <UserLayout />,
        children: [
          { index: true, element: <UserPage /> },
          { path: "add", element: <AddUser /> },
        ],
      },

      {
        path: "result",
        element: <ResultLayout />,
        children: [{ index: true, element: <ResultPage /> }],
      },

      {
        path: "department",
        element: <DepartmentLayout />,
        children: [
          { index: true, element: <DepartmentPage /> },
          { path: "add", element: <AddDepartment /> },
          { path: "edit/:id", element: <EditDepartment /> },
        ],
      },

      {
        path: "curriculum",
        element: <CurriculumLayout />,
        children: [{ index: true, element: <CurriculumPage /> }],
      },

      {
        path: "course",
        element: <CourseLayout />,
        children: [
          { index: true, element: <CoursePage /> },
          { path: "advisor", element: <CourseAdvisorPage /> },
          { path: "offered", element: <OfferedCoursePage /> },
          { path: "registered", element: <RegisteredCoursePage /> },
          { path: "add-course", element: <AddCoursePage /> },
          { path: "add-advisor", element: <AddAdvisorPage /> },
          { path: "my-offered-courses", element: <MyOfferedCourses /> },
        ],
      },

      {
        path: "attendance",
        element: <AttendancesLayout />,
        children: [
          { index: true, element: <AttendancePage /> },
          { path: "course/:id", element: <CourseAttendance /> },
        ],
      },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};
export default Router;
