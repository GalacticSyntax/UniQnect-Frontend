import type { Route } from "./+types/registered";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const RegisteredCoursePage = () => {
  return (
    <>
      <h1 className="text-2xl text-green-500 font-bold">
        RegisteredCourse Page
      </h1>
    </>
  );
};

export default RegisteredCoursePage;
