import { useAuth } from "@/provider/AuthProvider";
import TeacherResult from "./TeacherResult";
import AdminResult from "./AdminResult";

export default function ResultPage() {
  const { user } = useAuth();

  if (user?.role === "teacher") return <TeacherResult />;
  else if (user?.role === "admin") return <AdminResult />;

  return null;
}
