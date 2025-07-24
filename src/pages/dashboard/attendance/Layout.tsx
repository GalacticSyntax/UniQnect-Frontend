import { Outlet } from "react-router";

const AttendancesLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AttendancesLayout;
