import { Outlet } from "react-router";

const CourseLayout = () => {
  return (
    <div>
      <aside>CourseLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CourseLayout;
