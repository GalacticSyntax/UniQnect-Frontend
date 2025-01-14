import type { Route } from "./+types/teacher";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const TeacherPage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Teacher Page</h1>
    </>
  );
};

export default TeacherPage;
