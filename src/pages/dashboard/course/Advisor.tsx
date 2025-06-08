import PrivateRoute from "@/components/PrivateRoute";

const CourseAdvisorPage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">CourseAdvisor Page</h1>
    </PrivateRoute>
  );
};

export default CourseAdvisorPage;
