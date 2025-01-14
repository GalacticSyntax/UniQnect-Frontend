import { Outlet } from "react-router";

const StudentLayout = () => {
  return (
    <div>
      <aside>StudentLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
