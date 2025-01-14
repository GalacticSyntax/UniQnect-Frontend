import { Outlet } from "react-router";

const SchoolLayout = () => {
  return (
    <div>
      <aside>SchoolLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default SchoolLayout;
