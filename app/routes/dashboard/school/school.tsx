import type { Route } from "./+types/school";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const SchoolPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">School Page</h1>
    </>
  );
};

export default SchoolPage;
