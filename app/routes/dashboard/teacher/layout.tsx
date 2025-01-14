import { Outlet } from "react-router";

const TeacherLayout = () => {
  return (
    <div>
      <aside>TeacherLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
