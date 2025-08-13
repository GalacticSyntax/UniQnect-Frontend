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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Calendar, GraduationCap } from "lucide-react";
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";
import { toast } from "sonner";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  image: string;
}

interface Teacher {
  _id: string;
  userId: User;
  teacherId: string;
  designation: string;
  joinedAt: string;
}

interface Course {
  _id: string;
  name: string;
  code: string;
  credit: number;
  depart: string;
  prerequisiteCourse: string[];
}

interface CourseAdvisor {
  _id: string;
  departmentCode: string;
  teacherId: Teacher;
  session: string;
  semester: number;
}

interface TeacherCourse {
  _id: string;
  courseId: Course;
  runningSession: string;
  courseAdvisor: CourseAdvisor;
  teacherId: Teacher;
  createdAt: string;
  updatedAt: string;
}

interface GroupedCourses {
  [session: string]: {
    courses: TeacherCourse[];
    totalCredits: number;
  };
}

const TeacherMyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<TeacherCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchTeacherCourses();
    }
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedSession, selectedDepartment]);

  const fetchTeacherCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(
        `/course-offered/teacher/my-courses/${user?._id}`
      );

      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        setError("Failed to fetch courses");
        toast.error("Failed to fetch courses");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      toast.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (course) =>
          course.courseId.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.courseId.code
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.courseAdvisor.teacherId.userId.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Session filter
    if (selectedSession) {
      filtered = filtered.filter(
        (course) => course.runningSession === selectedSession
      );
    }

    // Department filter
    if (selectedDepartment) {
      filtered = filtered.filter(
        (course) => course.courseId.depart === selectedDepartment
      );
    }

    setFilteredCourses(filtered);
  };

  const groupCoursesBySession = (courses: TeacherCourse[]): GroupedCourses => {
    return courses.reduce((acc, course) => {
      const session = course.runningSession;
      if (!acc[session]) {
        acc[session] = {
          courses: [],
          totalCredits: 0,
        };
      }
      acc[session].courses.push(course);
      acc[session].totalCredits += course.courseId.credit;
      return acc;
    }, {} as GroupedCourses);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSession("");
    setSelectedDepartment("");
  };

  const getUniqueSessions = () => {
    return [...new Set(courses.map((course) => course.runningSession))];
  };

  const getUniqueDepartments = () => {
    return [...new Set(courses.map((course) => course.courseId.depart))];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Error loading courses</p>
              <p className="text-sm mt-1">{error}</p>
              <Button
                onClick={fetchTeacherCourses}
                className="mt-4 bg-transparent"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const groupedCourses = groupCoursesBySession(filteredCourses);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          My Teaching Courses
        </h1>
        <p className="text-gray-600">
          View and manage all courses you are teaching
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Courses
          </CardTitle>
          <CardDescription>
            Search by course name, code, or advisor name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Course name, code, or advisor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
              <select
                id="session"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="">All Sessions</option>
                {getUniqueSessions().map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                {getUniqueDepartments().map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
        <Badge variant="secondary" className="px-3 py-1">
          {Object.keys(groupedCourses).length} Sessions
        </Badge>
      </div>

      {/* Courses by Session */}
      {Object.keys(groupedCourses).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedCourses)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([session, { courses: sessionCourses, totalCredits }]) => (
              <Card key={session}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl capitalize">
                          {session}
                        </CardTitle>
                        <CardDescription>
                          {sessionCourses.length} courses • {totalCredits} total
                          credits
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="px-3 py-1">
                      {totalCredits} Credits
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Course
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Department
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Credits
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Course Advisor
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Semester
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionCourses.map((course) => (
                          <tr
                            key={course._id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {course.courseId.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {course.courseId.code.toUpperCase()}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="secondary">
                                {course.courseId.depart.toUpperCase()}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">
                                  {course.courseId.credit}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    course.courseAdvisor.teacherId.userId
                                      .image || "/placeholder.svg"
                                  }
                                  alt={
                                    course.courseAdvisor.teacherId.userId
                                      .fullName
                                  }
                                  className="w-8 h-8 rounded-full"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {
                                      course.courseAdvisor.teacherId.userId
                                        .fullName
                                    }
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {course.courseAdvisor.teacherId.designation}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="outline">
                                Semester {course.courseAdvisor.semester}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default TeacherMyCoursesPage;
