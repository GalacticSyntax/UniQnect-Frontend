import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";

interface StudentData {
  _id: string;
  studentId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
      gender: string;
      image: string;
      isVerified: boolean;
      role: string;
      createdAt: string;
      updatedAt: string;
    };
    studentId: string;
    departmentId: {
      _id: string;
      code: string;
      name: string;
      schoolId: string;
      createdAt: string;
      updatedAt: string;
    };
    admittedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  courseList: string[];
  runningSession: string;
  createdAt: string;
  updatedAt: string;
}

interface TeacherCourse {
  _id: string;
  courseId: {
    _id: string;
    name: string;
    code: string;
    credit: number;
    depart: string;
  };
  runningSession: string;
  courseAdvisor: {
    teacherId: {
      userId: {
        fullName: string;
      };
    };
  };
}

interface StudentsResponse {
  success: boolean;
  message: string;
  data: StudentData[];
}

interface TeacherCoursesResponse {
  success: boolean;
  data: TeacherCourse[];
}

const MyStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [teacherCourses, setTeacherCourses] = useState<TeacherCourse[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedSession, setSelectedSession] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);

  // Get unique courses and sessions from teacher's courses
  const uniqueCourses = teacherCourses.reduce((acc, course) => {
    const existing = acc.find((c) => c.courseId._id === course.courseId._id);
    if (!existing) {
      acc.push(course);
    }
    return acc;
  }, [] as TeacherCourse[]);

  const uniqueSessions = [
    ...new Set(teacherCourses.map((course) => course.runningSession)),
  ];

  // Fetch teacher's courses on component mount
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      if (!user?._id) return;

      try {
        setCoursesLoading(true);
        const response = await axiosClient.get<TeacherCoursesResponse>(
          `/course-offered/teacher/my-courses/${user._id}`
        );

        if (response.data.success) {
          setTeacherCourses(response.data.data);
        } else {
          toast.error("Failed to fetch courses");
        }
      } catch (error: unknown) {
        console.error("Error fetching teacher courses:", error);
        toast.error("Failed to fetch courses");
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [user?._id]);

  // Fetch students when both course and session are selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedCourse || !selectedSession) {
        setStudents([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.post<StudentsResponse>(
          "/course-registered/registered-students",
          {
            courseId: selectedCourse,
            session: selectedSession,
          }
        );

        if (response.data.success) {
          setStudents(response.data.data);
          toast.success(`Found ${response.data.data.length} enrolled students`);
        } else {
          toast.error("Failed to fetch students");
          setStudents([]);
        }
      } catch (error: unknown) {
        console.error("Error fetching students:", error);
        toast.error("Failed to fetch students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedCourse, selectedSession]);

  // Filter students based on search term
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.studentId.studentId.toLowerCase().includes(searchLower) ||
      student.studentId.userId.fullName.toLowerCase().includes(searchLower) ||
      student.studentId.userId.email.toLowerCase().includes(searchLower) ||
      student.studentId.departmentId.code.toLowerCase().includes(searchLower) ||
      student.studentId.departmentId.name.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedCourseDetails = uniqueCourses.find(
    (course) => course.courseId._id === selectedCourse
  );

  const capitalizeName = (name: string) => {
    return name
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Enrolled Students</h1>
        <p className="text-gray-600">View students enrolled in your courses</p>
      </div>

      {/* Course and Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course & Session Selection
          </CardTitle>
          <CardDescription>
            Select a course and session to view enrolled students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {coursesLoading ? (
            <div className="text-center py-4">Loading courses...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Course Selection */}
              <div className="space-y-2">
                <Label htmlFor="course-select">Course</Label>
                <select
                  id="course-select"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a course</option>
                  {uniqueCourses.map((course) => (
                    <option
                      key={course.courseId._id}
                      value={course.courseId._id}
                    >
                      {course.courseId.code.toUpperCase()} -{" "}
                      {capitalizeName(course.courseId.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Selection */}
              <div className="space-y-2">
                <Label htmlFor="session-select">Session</Label>
                <select
                  id="session-select"
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a session</option>
                  {uniqueSessions.map((session) => (
                    <option key={session} value={session.toLowerCase()}>
                      {session.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Course Info */}
      {selectedCourseDetails && selectedSession && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedCourseDetails.courseId.code} -{" "}
                  {capitalizeName(selectedCourseDetails.courseId.name)}
                </h3>
                <p className="text-gray-600">
                  {selectedCourseDetails.courseId.credit} Credits •{" "}
                  {selectedCourseDetails.courseId.depart} Department
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {selectedSession.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Students List */}
      {selectedCourse && selectedSession && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Enrolled Students ({filteredStudents.length})
                </CardTitle>
                <CardDescription>
                  Students registered for the selected course and session
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, student ID, email, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading students...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {students.length === 0
                    ? "No students enrolled in this course"
                    : "No students match your search"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Student
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Student ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Department
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Gender
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Admitted Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                student.studentId.userId.image ||
                                "/placeholder.svg"
                              }
                              alt={student.studentId.userId.fullName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="font-medium text-gray-900">
                                {student.studentId.userId.fullName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.studentId.userId.isVerified ? (
                                  <Badge variant="default" className="text-xs">
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Unverified
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">
                            {student.studentId.studentId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="text-gray-900">
                              {student.studentId.userId.email}
                            </div>
                            <div className="text-gray-500">
                              {student.studentId.userId.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {student.studentId.departmentId.code.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-gray-600">
                              {student.studentId.departmentId.name}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="capitalize">
                            {student.studentId.userId.gender}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {formatDate(student.studentId.admittedAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <Badge variant="default" className="mb-1">
                              {student.courseList.length} courses
                            </Badge>
                            <div className="text-xs text-gray-500">
                              Enrolled: {formatDate(student.createdAt)}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyStudentsPage;
