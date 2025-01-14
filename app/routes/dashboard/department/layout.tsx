import { Outlet } from "react-router";

const DepartmentLayout = () => {
  return (
    <div>
      <aside>DepartmentLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DepartmentLayout;
