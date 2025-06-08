import StudentsVSCourses from "@/components/charts/StudentsVSCourses";
import AttendanceDistribution from "@/components/charts/AttendanceDistribution";
import StudentVsDepartment from "@/components/charts/StudentVsDepartment";
import TeacherVsDepartment from "@/components/charts/TeacherVsDepartment";
import PrivateRoute from "@/components/PrivateRoute";

const DashboardPage = () => {
  return (
    <PrivateRoute>
      <section className="p-5 grid md:grid-cols-2 gap-5">
        <StudentsVSCourses />
        <AttendanceDistribution />
        <StudentVsDepartment />
        <TeacherVsDepartment />
      </section>
    </PrivateRoute>
  );
};

export default DashboardPage;
