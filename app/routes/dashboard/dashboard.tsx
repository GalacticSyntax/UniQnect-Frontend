import type { Route } from "./+types/dashboard";
import StudentsVSCourses from "~/components/charts/StudentsVSCourses";
import AttendanceDistribution from "~/components/charts/AttendanceDistribution";
import StudentVsDepartment from "~/components/charts/StudentVsDepartment";
import TeacherVsDepartment from "~/components/charts/TeacherVsDepartment";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const DashboardPage = () => {
  return (
    <section className="p-5 grid md:grid-cols-2 gap-5">
      <StudentsVSCourses />
      <AttendanceDistribution />
      <StudentVsDepartment />
      <TeacherVsDepartment />
    </section>
  );
};

export default DashboardPage;
