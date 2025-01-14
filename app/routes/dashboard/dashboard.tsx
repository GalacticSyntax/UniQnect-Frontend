import type { Route } from "./+types/dashboard";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const DashboardPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Dashboard Page</h1>
    </>
  );
};

export default DashboardPage;
