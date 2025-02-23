import PrivateRoute from "~/components/PrivateRoute";
import type { Route } from "./+types/attendance";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const AttendancePage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">Attendance Page</h1>
    </PrivateRoute>
  );
};

export default AttendancePage;
