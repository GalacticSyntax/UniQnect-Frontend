import { Outlet } from "react-router";

const AttendancesLayout = () => {
  return (
    <div>
      <aside>AttendancesLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AttendancesLayout;
