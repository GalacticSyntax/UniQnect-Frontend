import PrivateRoute from "@/components/PrivateRoute";

const CurriculumPage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">Curriculum Page</h1>
    </PrivateRoute>
  );
};

export default CurriculumPage;
