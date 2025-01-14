import { Outlet } from "react-router";

const OfferedCourseLayout = () => {
  return (
    <div>
      <aside>OfferedCourseLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default OfferedCourseLayout;
