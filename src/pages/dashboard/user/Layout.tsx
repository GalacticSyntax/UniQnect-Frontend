import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default UserLayout;
