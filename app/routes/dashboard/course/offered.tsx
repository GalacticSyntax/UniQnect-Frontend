import type { Route } from "./+types/offered";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const OfferedCoursePage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">OfferedCourse Page</h1>
    </>
  );
};

export default OfferedCoursePage;
