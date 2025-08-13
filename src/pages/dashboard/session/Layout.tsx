import { Outlet } from "react-router";

const SessionLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default SessionLayout;
