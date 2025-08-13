import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Users,
  GraduationCap,
  X,
  BookOpen,
  Eye,
  RefreshCw,
} from "lucide-react";
import { axiosClient } from "@/lib/apiClient";

// Types based on your API response
interface Course {
  _id: string;
  name: string;
  code: string;
  credit: number;
  depart: string;
  prerequisiteCourse: Course[];
  createdAt: string;
  updatedAt: string;
}

interface Department {
  _id: string;
  code: string;
  name: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phone: string;
  gender: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Student {
  _id: string;
  userId: User;
  studentId: string;
  departmentId: Department;
  admittedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface RegisteredCourseData {
  _id: string;
  studentId: Student;
  courseList: Course[];
  runningSession: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: RegisteredCourseData[];
}

interface StudentCourseFilters {
  department?: string;
  session?: string;
  studentName?: string;
  courseTitle?: string;
  courseCode?: string;
}

const ITEMS_PER_PAGE = 10;

export default function RegisteredCoursesPage() {
  const [studentsData, setStudentsData] = useState<RegisteredCourseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StudentCourseFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingStudentCourses, setViewingStudentCourses] =
    useState<RegisteredCourseData | null>(null);
  const [viewCoursesDialogOpen, setViewCoursesDialogOpen] = useState(false);

  // Fetch data from API
  const fetchRegisteredCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<ApiResponse>("/course-registered");
      if (response.data.success) {
        setStudentsData(response.data.data);
      } else {
        setError("Failed to fetch registered courses");
      }
    } catch (err) {
      setError("Error fetching data from server");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredCourses();
  }, []);

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return studentsData.filter((registration) => {
      const student = registration.studentId;
      const department = student.departmentId;

      const matchesDepartment = filters.department
        ? department.code
            .toLowerCase()
            .includes(filters.department.toLowerCase()) ||
          department.name
            .toLowerCase()
            .includes(filters.department.toLowerCase())
        : true;

      const matchesSession = filters.session
        ? registration.runningSession
            .toLowerCase()
            .includes(filters.session.toLowerCase())
        : true;

      const matchesStudentName = filters.studentName
        ? student.userId.fullName
            .toLowerCase()
            .includes(filters.studentName.toLowerCase())
        : true;

      const matchesCourse =
        filters.courseTitle || filters.courseCode
          ? registration.courseList.some((course) => {
              const titleMatch = filters.courseTitle
                ? course.name
                    .toLowerCase()
                    .includes(filters.courseTitle.toLowerCase())
                : true;
              const codeMatch = filters.courseCode
                ? course.code
                    .toLowerCase()
                    .includes(filters.courseCode.toLowerCase())
                : true;
              return titleMatch && codeMatch;
            })
          : true;

      return (
        matchesDepartment &&
        matchesSession &&
        matchesStudentName &&
        matchesCourse
      );
    });
  }, [studentsData, filters]);

  const handleFilterChange = (
    key: keyof StudentCourseFilters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Pagination logic
  const paginatedStudents = useMemo(() => {
    const sortedStudents = [...filteredData].sort((a, b) =>
      a.studentId.userId.fullName.localeCompare(b.studentId.userId.fullName)
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedStudents.slice(startIndex, endIndex);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else if (totalPages > 1) {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1 && !range.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handleViewStudentCourses = (registration: RegisteredCourseData) => {
    setViewingStudentCourses(registration);
    setViewCoursesDialogOpen(true);
  };

  const getTotalCredits = (courses: Course[]) => {
    return courses.reduce((total, course) => total + course.credit, 0);
  };

  return (
    <div className="container mx-auto py-8 space-y-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col gap-2 text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-3">
          <GraduationCap className="w-9 h-9 text-blue-600 dark:text-blue-400" />
          Registered Courses
        </h1>
        <p className="text-lg text-muted-foreground">
          Overview of registered courses for all students
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Registered Courses for All Students
          </h2>
          <Button
            onClick={fetchRegisteredCourses}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Filter Students & Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="filter-department">Department</Label>
                <Input
                  id="filter-department"
                  placeholder="e.g., CSE or Computer Science"
                  value={filters.department || ""}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-session">Session</Label>
                <Input
                  id="filter-session"
                  placeholder="e.g., fall-2025"
                  value={filters.session || ""}
                  onChange={(e) =>
                    handleFilterChange("session", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-studentName">Student Name</Label>
                <Input
                  id="filter-studentName"
                  placeholder="e.g., Student99"
                  value={filters.studentName || ""}
                  onChange={(e) =>
                    handleFilterChange("studentName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-courseTitle">Course Title</Label>
                <Input
                  id="filter-courseTitle"
                  placeholder="e.g., programming"
                  value={filters.courseTitle || ""}
                  onChange={(e) =>
                    handleFilterChange("courseTitle", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-courseCode">Course Code</Label>
                <Input
                  id="filter-courseCode"
                  placeholder="e.g., cse111"
                  value={filters.courseCode || ""}
                  onChange={(e) =>
                    handleFilterChange("courseCode", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
            <CardContent className="pt-6">
              <div className="text-red-600 dark:text-red-400 text-center">
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Table for Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({filteredData.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">
                  Loading student data...
                </div>
              </div>
            ) : paginatedStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {filteredData.length === 0 && studentsData.length > 0
                  ? "No students found matching the current filters."
                  : "No registered courses data available."}
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead className="text-center">
                        Total Courses
                      </TableHead>
                      <TableHead className="text-center">
                        Total Credits
                      </TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStudents.map((registration) => (
                      <TableRow key={registration._id}>
                        <TableCell className="font-mono font-medium">
                          {registration.studentId.studentId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {registration.studentId.userId.fullName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {registration.studentId.departmentId.code.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {registration.runningSession}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {registration.courseList.length}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">
                            {getTotalCredits(registration.courseList)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewStudentCourses(registration)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">
                              View courses for{" "}
                              {registration.studentId.userId.fullName}
                            </span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {!loading && filteredData.length > 0 && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getVisiblePages().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => handlePageChange(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* View Student Courses Dialog */}
        <Dialog
          open={viewCoursesDialogOpen}
          onOpenChange={setViewCoursesDialogOpen}
        >
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses for {viewingStudentCourses?.studentId.userId.fullName} (
                {viewingStudentCourses?.studentId.studentId})
              </DialogTitle>
              <DialogDescription>
                Registered courses for{" "}
                {viewingStudentCourses?.studentId.userId.fullName} in{" "}
                {viewingStudentCourses?.runningSession} session.
              </DialogDescription>
            </DialogHeader>

            {viewingStudentCourses && (
              <div className="space-y-4">
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewingStudentCourses.courseList.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-4 text-muted-foreground"
                          >
                            No courses registered for this student.
                          </TableCell>
                        </TableRow>
                      ) : (
                        viewingStudentCourses.courseList.map((course) => (
                          <TableRow
                            key={course._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <TableCell className="font-mono text-sm font-medium text-gray-900 dark:text-gray-50">
                              {course.code.toUpperCase()}
                            </TableCell>
                            <TableCell className="text-sm text-gray-800 dark:text-gray-100 capitalize">
                              {course.name}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className="text-xs px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                              >
                                {course.credit}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  Total Credits:{" "}
                  {getTotalCredits(viewingStudentCourses.courseList)}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
