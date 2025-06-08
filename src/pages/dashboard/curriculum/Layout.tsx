import { Outlet } from "react-router";

const CurriculumLayout = () => {
  return (
    <div>
      <aside>CurriculumLayout</aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default CurriculumLayout;
