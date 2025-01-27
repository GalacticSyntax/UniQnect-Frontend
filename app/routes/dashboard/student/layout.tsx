import { Outlet } from "react-router";

const StudentLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default StudentLayout;
