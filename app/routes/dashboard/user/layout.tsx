import { Outlet } from "react-router";

const UserLayout = () => {
  return (
    <div>
      <aside>UserLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
