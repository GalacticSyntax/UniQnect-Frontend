import { Outlet } from "react-router";

const TeacherLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default TeacherLayout;
