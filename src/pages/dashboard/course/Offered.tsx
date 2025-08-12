import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BookOpen, UserCheck, GraduationCap, Loader2 } from "lucide-react";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";

// API Response Types
interface CourseData {
  _id: string;
  name: string;
  code: string;
  credit: number;
  depart: string;
  prerequisiteCourse: string[];
}

interface UserData {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: string;
  phone: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

interface TeacherData {
  _id: string;
  userId: UserData;
  teacherId: string;
  designation: string;
  joinedAt: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseAdvisorData {
  _id: string;
  departmentCode: string;
  teacherId: TeacherData;
  session: string;
  semester: number;
  offeredCourses: string[];
  createdAt: string;
  updatedAt: string;
}

interface OfferedCourseAPI {
  _id: string;
  courseId: CourseData;
  runningSession: string;
  courseAdvisor: CourseAdvisorData;
  teacherId: TeacherData;
  createdAt: string;
  updatedAt: string;
}

interface APIResponse {
  success: boolean;
  data: OfferedCourseAPI[];
}

// UI Types
interface OfferedCourse {
  courseTitle: string;
  courseCode: string;
  credits: number;
  courseTeachers: string[];
}

interface SemesterBlockData {
  id: string;
  semesterName: string;
  totalCredit: number;
  advisorName: string;
  courses: OfferedCourse[];
}

// SemesterCourseBlock Component
interface SemesterCourseBlockProps {
  data: SemesterBlockData;
}

function SemesterCourseBlock({ data }: SemesterCourseBlockProps) {
  return (
    <Card className="w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {data.semesterName}
        </CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Advisor:
          </span>{" "}
          {data.advisorName}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Total Credit:
          </span>{" "}
          {data.totalCredit}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              <TableRow>
                <TableHead className="w-[100px] text-gray-600 dark:text-gray-300 font-medium">
                  Code
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                  Course Title
                </TableHead>
                <TableHead className="text-center text-gray-600 dark:text-gray-300 font-medium w-[80px]">
                  Credits
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                  Teachers
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No courses offered this semester.
                  </TableCell>
                </TableRow>
              ) : (
                data.courses.map((course, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <TableCell className="font-mono text-sm font-medium text-gray-900 dark:text-gray-50">
                      {course.courseCode.toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-sm text-gray-800 dark:text-gray-100">
                      {course.courseTitle}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                      >
                        {course.credits}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {course.courseTeachers.map((teacher, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-100 dark:border-blue-800"
                          >
                            {teacher}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function OfferedCoursesPageWithAPI() {
  const [semesterData, setSemesterData] = useState<SemesterBlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfferedCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<APIResponse>(
        "/course-offered/offereds"
      );

      if (response.data.success) {
        const transformedData = transformAPIDataToSemesterBlocks(
          response.data.data
        );
        setSemesterData(transformedData);
      } else {
        throw new Error("Failed to fetch offered courses");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch offered courses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const transformAPIDataToSemesterBlocks = (
    apiData: OfferedCourseAPI[]
  ): SemesterBlockData[] => {
    // Group by session and semester
    const groupedData = apiData.reduce(
      (acc, item) => {
        const sessionKey = `${item.runningSession}-${item.courseAdvisor.semester}`;

        if (!acc[sessionKey]) {
          acc[sessionKey] = {
            session: item.runningSession,
            semester: item.courseAdvisor.semester,
            advisorName: item.courseAdvisor.teacherId.userId.fullName, // Extract advisor name from nested structure
            courses: [],
            totalCredit: 0,
          };
        }

        // Check if course already exists (to handle multiple teachers for same course)
        const existingCourseIndex = acc[sessionKey].courses.findIndex(
          (course) => course.courseCode === item.courseId.code
        );

        const teacherName = item.teacherId.userId.fullName; // Extract teacher name from nested structure

        if (existingCourseIndex >= 0) {
          // Add teacher to existing course
          if (
            !acc[sessionKey].courses[
              existingCourseIndex
            ].courseTeachers.includes(teacherName)
          ) {
            acc[sessionKey].courses[existingCourseIndex].courseTeachers.push(
              teacherName
            );
          }
        } else {
          // Add new course
          acc[sessionKey].courses.push({
            courseTitle: item.courseId.name,
            courseCode: item.courseId.code,
            credits: item.courseId.credit,
            courseTeachers: [teacherName], // Use full name instead of teacherId
          });
          acc[sessionKey].totalCredit += item.courseId.credit;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          session: string;
          semester: number;
          advisorName: string; // Changed from advisorId to advisorName
          courses: OfferedCourse[];
          totalCredit: number;
        }
      >
    );

    // Convert to SemesterBlockData array
    return Object.entries(groupedData).map(([key, data]) => ({
      id: key,
      semesterName: `${
        data.session.charAt(0).toUpperCase() + data.session.slice(1)
      } (Semester ${data.semester})`,
      totalCredit: data.totalCredit,
      advisorName: data.advisorName, // Now using actual advisor name
      courses: data.courses,
    }));
  };

  useEffect(() => {
    fetchOfferedCourses();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-lg text-muted-foreground">
            Loading offered courses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Courses
            </h2>
            <p className="text-muted-foreground">{error}</p>
            <button
              onClick={fetchOfferedCourses}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col gap-2 text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-3">
          <GraduationCap className="w-9 h-9 text-blue-600 dark:text-blue-400" />
          Course Offer List
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive overview of courses offered by semester and assigned
          advisors.
        </p>
      </div>

      {semesterData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No courses offered at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
          {semesterData.map((semester) => (
            <SemesterCourseBlock key={semester.id} data={semester} />
          ))}
        </div>
      )}
    </div>
  );
}
