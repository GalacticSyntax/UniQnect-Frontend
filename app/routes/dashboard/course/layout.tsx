import { Outlet } from "react-router";

const CourseLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CourseLayout;
