import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <section className="w-full">
      <Outlet />
    </section>
  );
};

export default UserLayout;
