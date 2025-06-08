import PrivateRoute from "@/components/PrivateRoute";

const AttendancePage = () => {
  return (
    <PrivateRoute>
      <h1 className="text-2xl text-green-500 font-bold">Attendance Page</h1>
    </PrivateRoute>
  );
};

export default AttendancePage;
