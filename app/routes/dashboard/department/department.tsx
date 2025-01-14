import type { Route } from "./+types/department";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const DepartmentPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Department Page</h1>
    </>
  );
};

export default DepartmentPage;
