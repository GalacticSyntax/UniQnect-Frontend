import type { Route } from "./+types/course";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const CoursePage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">Course Page</h1>
    </>
  );
};

export default CoursePage;
