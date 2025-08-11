import { Outlet } from "react-router";

const ResultLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ResultLayout;
