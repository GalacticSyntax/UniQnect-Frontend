import { Outlet } from "react-router";

const SchoolLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default SchoolLayout;
