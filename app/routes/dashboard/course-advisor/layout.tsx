import { Outlet } from "react-router";

const CourseAdvisorLayout = () => {
  return (
    <div>
      <aside>CourseAdvisorLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CourseAdvisorLayout;
