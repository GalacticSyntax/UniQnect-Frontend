import StudentCountChart from "~/components/charts/StudentCountChart";
import type { Route } from "./+types/dashboard";
import TeacherCountChart from "~/components/charts/TeacherCountChart";
import StudentsVSCourses from "~/components/charts/StudentsVSCourses";
import AttendanceDistribution from "~/components/charts/AttendanceDistribution";

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
      <StudentCountChart />
      <TeacherCountChart />
    </section>
  );
};

export default DashboardPage;
