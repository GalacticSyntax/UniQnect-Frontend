import type { Route } from "./+types/student";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const StudentPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Student Page</h1>
    </>
  );
};

export default StudentPage;
