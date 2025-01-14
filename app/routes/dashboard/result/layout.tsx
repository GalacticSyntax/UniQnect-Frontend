import { Outlet } from "react-router";

const ResultLayout = () => {
  return (
    <div>
      <aside>ResultLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ResultLayout;
