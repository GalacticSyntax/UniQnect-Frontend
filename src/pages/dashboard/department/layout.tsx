import { Outlet } from "react-router";

const DepartmentLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default DepartmentLayout;
