import { Outlet } from "react-router";

const RegisteredCourseLayout = () => {
  return (
    <div>
      <aside>RegisteredCourseLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RegisteredCourseLayout;
