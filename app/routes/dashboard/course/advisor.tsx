import PrivateRoute from "~/components/PrivateRoute";
import type { Route } from "./+types/advisor";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const CourseAdvisorPage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">CourseAdvisor Page</h1>
    </PrivateRoute>
  );
};

export default CourseAdvisorPage;
