import PrivateRoute from "~/components/PrivateRoute";
import type { Route } from "./+types/curriculum";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const CurriculumPage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">Curriculum Page</h1>
    </PrivateRoute>
  );
};

export default CurriculumPage;
