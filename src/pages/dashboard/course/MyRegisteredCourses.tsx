import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Calendar, GraduationCap, RefreshCw } from "lucide-react";
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";
import { toast } from "sonner";

interface Course {
  _id: string;
  name: string;
  code: string;
  credit: number;
  depart: string;
  prerequisiteCourse: string[];
  createdAt: string;
  updatedAt: string;
}

interface Registration {
  _id: string;
  studentId: string;
  courseList: Course[];
  runningSession: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Registration[];
}

const MyRegisteredCourses: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegisteredCourses = async () => {
    if (!user?._id) {
      setError("User not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get<ApiResponse>(
        `/course-registered/myRegisteredCourses/${user._id}`
      );

      if (response.data.success) {
        setRegistrations(response.data.data);
        toast.success("Registered courses loaded successfully");
      } else {
        throw new Error("Failed to fetch registered courses");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch registered courses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredCourses();
  }, [user?._id]);

  const getTotalCredits = (courses: Course[]): number => {
    return courses.reduce((total, course) => total + course.credit, 0);
  };

  const getDepartmentBadgeColor = (depart: string): string => {
    const colors: Record<string, string> = {
      cse: "bg-blue-100 text-blue-800",
      eee: "bg-yellow-100 text-yellow-800",
      ce: "bg-green-100 text-green-800",
      me: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[depart.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading registered courses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchRegisteredCourses} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">My Registered Courses</h1>
        </div>
        <p className="text-gray-600">
          View all your registered courses organized by session
        </p>
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <Button onClick={fetchRegisteredCourses} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Registrations by Session */}
      {registrations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No Registered Courses
              </h3>
              <p className="text-gray-500">
                You haven't registered for any courses yet.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {registrations.map((registration) => (
            <Card key={registration._id} className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-xl capitalize">
                      {registration.runningSession.replace("-", " ")}
                    </CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {getTotalCredits(registration.courseList)} Credits
                  </Badge>
                </div>
                <CardDescription>
                  {registration.courseList.length} course
                  {registration.courseList.length !== 1 ? "s" : ""} registered
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[120px]">Course Code</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead className="w-[100px]">Department</TableHead>
                        <TableHead className="w-[80px] text-center">
                          Credits
                        </TableHead>
                        <TableHead>Prerequisites</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registration.courseList.map((course) => (
                        <TableRow key={course._id}>
                          <TableCell className="font-mono font-medium uppercase">
                            {course.code.toUpperCase()}
                          </TableCell>
                          <TableCell className="font-medium capitalize">
                            {course.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs uppercase ${getDepartmentBadgeColor(
                                course.depart
                              )}`}
                            >
                              {course.depart.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {course.credit}
                          </TableCell>
                          <TableCell>
                            {course.prerequisiteCourse.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {course.prerequisiteCourse.map(
                                  (prereq, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {prereq}
                                    </Badge>
                                  )
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                None
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegisteredCourses;
