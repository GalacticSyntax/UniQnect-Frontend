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
import { Search, Users, GraduationCap, X, BookOpen, Eye } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";

// --- Types (Consolidated) ---
interface RegisteredCourse {
  courseTitle: string;
  courseCode: string;
  credits: number;
  grade?: string; // Optional, as grades might not be available immediately
}

interface StudentRegisteredCourses {
  studentId: string;
  studentName: string;
  department: string;
  session: string;
  semester: number;
  courses: RegisteredCourse[];
}

interface StudentCourseFilters {
  department?: string;
  session?: string;
  semester?: number;
  studentName?: string;
  courseTitle?: string;
  courseCode?: string;
}

// --- Constants (Consolidated) ---
const CURRENT_SEMESTER = "Fall-2025 (1/1)";
const CURRENT_SESSION = "Fall-2025";
const ITEMS_PER_PAGE = 10;

// --- Dummy Data (Consolidated) ---
const dummyStudentCourses: RegisteredCourse[] = [
  {
    courseCode: "CSE-0613111",
    courseTitle: "Discrete Mathematics",
    credits: 3,
    grade: "A",
  },
  {
    courseCode: "CSE-0613113",
    courseTitle: "Structured Programming Language",
    credits: 3,
    grade: "B+",
  },
  {
    courseCode: "CSE-0613114",
    courseTitle: "Structured Programming Language Lab",
    credits: 1.5,
    grade: "A-",
  },
  {
    courseCode: "ENG-02321201",
    courseTitle: "Advanced Functional English",
    credits: 3,
    grade: "B",
  },
  {
    courseCode: "MAT-0541101",
    courseTitle: "Calculus",
    credits: 3,
    grade: "A",
  },
  {
    courseCode: "PHY-05331201",
    courseTitle: "Fundamentals of Physics",
    credits: 3,
    grade: "B",
  },
  {
    courseCode: "SSW-03141101",
    courseTitle: "History of Bangladesh",
    credits: 3,
    grade: "A",
  },
];

const dummyAllStudentsCourses: StudentRegisteredCourses[] = [
  {
    studentId: "S001",
    studentName: "Alice Johnson",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "A",
      },
      {
        courseCode: "CSE-0613113",
        courseTitle: "Structured Programming Language",
        credits: 3,
        grade: "B+",
      },
      {
        courseCode: "MAT-0541101",
        courseTitle: "Calculus",
        credits: 3,
        grade: "A",
      },
    ],
  },
  {
    studentId: "S002",
    studentName: "Bob Williams",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "B",
      },
      {
        courseCode: "ENG-02321201",
        courseTitle: "Advanced Functional English",
        credits: 3,
        grade: "A-",
      },
      {
        courseCode: "CSE-0613114",
        courseTitle: "Structured Programming Language Lab",
        credits: 1.5,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S003",
    studentName: "Charlie Brown",
    department: "EEE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "EEE-101",
        courseTitle: "Basic Electrical Circuits",
        credits: 3,
        grade: "A",
      },
      {
        courseCode: "PHY-101",
        courseTitle: "Physics I",
        credits: 3,
        grade: "B+",
      },
    ],
  },
  {
    studentId: "S004",
    studentName: "Diana Prince",
    department: "CSE",
    session: "Fall-2025",
    semester: 2, // Different semester
    courses: [
      {
        courseCode: "CSE-06131211",
        courseTitle: "Data Structures and Algorithms",
        credits: 3,
        grade: "A",
      },
      {
        courseCode: "CSE-06131213",
        courseTitle: "Electronic Devices and Circuits",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S005",
    studentName: "Eve Adams",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "C+",
      },
      {
        courseCode: "MAT-0541101",
        courseTitle: "Calculus",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S006",
    studentName: "Frank White",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613113",
        courseTitle: "Structured Programming Language",
        credits: 3,
        grade: "A",
      },
      {
        courseCode: "PHY-05331201",
        courseTitle: "Fundamentals of Physics",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S007",
    studentName: "Grace Black",
    department: "CSE",
    session: "Spring-2025", // Different session
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S008",
    studentName: "Henry Green",
    department: "EEE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "EEE-201",
        courseTitle: "Circuit Analysis",
        credits: 3,
        grade: "B",
      },
      {
        courseCode: "MAT-201",
        courseTitle: "Differential Equations",
        credits: 3,
        grade: "C+",
      },
    ],
  },
  {
    studentId: "S009",
    studentName: "Ivy Blue",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "A-",
      },
      {
        courseCode: "ENG-02321201",
        courseTitle: "Advanced Functional English",
        credits: 3,
        grade: "B+",
      },
    ],
  },
  {
    studentId: "S010",
    studentName: "Jack Red",
    department: "CSE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "CSE-06131211",
        courseTitle: "Data Structures and Algorithms",
        credits: 3,
        grade: "B",
      },
      {
        courseCode: "CSE-06131213",
        courseTitle: "Electronic Devices and Circuits",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S011",
    studentName: "Karen Yellow",
    department: "CSE",
    session: "Spring-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613113",
        courseTitle: "Structured Programming Language",
        credits: 3,
        grade: "A",
      },
      {
        courseCode: "MAT-0541101",
        courseTitle: "Calculus",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S012",
    studentName: "Liam White",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S013",
    studentName: "Olivia Green",
    department: "EEE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "EEE-201",
        courseTitle: "Circuit Analysis",
        credits: 3,
        grade: "C+",
      },
    ],
  },
  {
    studentId: "S014",
    studentName: "Noah Black",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613113",
        courseTitle: "Structured Programming Language",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S015",
    studentName: "Emma Blue",
    department: "CSE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "CSE-06131211",
        courseTitle: "Data Structures and Algorithms",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S016",
    studentName: "Ava Red",
    department: "CSE",
    session: "Spring-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613111",
        courseTitle: "Discrete Mathematics",
        credits: 3,
        grade: "A",
      },
    ],
  },
  {
    studentId: "S017",
    studentName: "Sophia Yellow",
    department: "EEE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "EEE-101",
        courseTitle: "Basic Electrical Circuits",
        credits: 3,
        grade: "B+",
      },
    ],
  },
  {
    studentId: "S018",
    studentName: "Jackson Purple",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "MAT-0541101",
        courseTitle: "Calculus",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S019",
    studentName: "Mia Orange",
    department: "CSE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "CSE-06131213",
        courseTitle: "Electronic Devices and Circuits",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S020",
    studentName: "Lucas Pink",
    department: "CSE",
    session: "Spring-2025",
    semester: 1,
    courses: [
      {
        courseCode: "ENG-02321201",
        courseTitle: "Advanced Functional English",
        credits: 3,
        grade: "A",
      },
    ],
  },
  {
    studentId: "S021",
    studentName: "Isabella Gold",
    department: "EEE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "PHY-101",
        courseTitle: "Physics I",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S022",
    studentName: "Ethan Silver",
    department: "CSE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "SSW-03141101",
        courseTitle: "History of Bangladesh",
        credits: 3,
        grade: "A-",
      },
    ],
  },
  {
    studentId: "S023",
    studentName: "Charlotte Bronze",
    department: "CSE",
    session: "Fall-2025",
    semester: 2,
    courses: [
      {
        courseCode: "CSE-06131211",
        courseTitle: "Data Structures and Algorithms",
        credits: 3,
        grade: "C",
      },
    ],
  },
  {
    studentId: "S024",
    studentName: "Mason Platinum",
    department: "CSE",
    session: "Spring-2025",
    semester: 1,
    courses: [
      {
        courseCode: "CSE-0613113",
        courseTitle: "Structured Programming Language",
        credits: 3,
        grade: "B",
      },
    ],
  },
  {
    studentId: "S025",
    studentName: "Amelia Diamond",
    department: "EEE",
    session: "Fall-2025",
    semester: 1,
    courses: [
      {
        courseCode: "EEE-101",
        courseTitle: "Basic Electrical Circuits",
        credits: 3,
        grade: "A",
      },
    ],
  },
];

// --- Student View Component (Consolidated) ---
interface StudentCoursesViewProps {
  courses: RegisteredCourse[];
  semester: string;
}

function StudentCoursesView({ courses, semester }: StudentCoursesViewProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          Your Registered Courses for {semester}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
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
                <TableHead className="text-center text-gray-600 dark:text-gray-300 font-medium w-[80px]">
                  Grade
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No courses registered for this semester.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course, index) => (
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
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-100 dark:border-blue-800"
                      >
                        {course.grade || "N/A"}
                      </Badge>
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

// --- Admin View Component (Consolidated) ---
interface AdminCoursesViewProps {
  currentSession: string;
}

function AdminCoursesView({ currentSession }: AdminCoursesViewProps) {
  const [studentsData, setStudentsData] = useState<StudentRegisteredCourses[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<StudentCourseFilters>({
    session: currentSession,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingStudentCourses, setViewingStudentCourses] =
    useState<StudentRegisteredCourses | null>(null);
  const [viewCoursesDialogOpen, setViewCoursesDialogOpen] = useState(false);

  // Simulate fetching data
  const fetchStudents = async (filterParams: StudentCourseFilters = {}) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const filteredData = dummyAllStudentsCourses.filter((student) => {
      const matchesDepartment = filterParams.department
        ? student.department
            .toLowerCase()
            .includes(filterParams.department.toLowerCase())
        : true;
      const matchesSession = filterParams.session
        ? student.session
            .toLowerCase()
            .includes(filterParams.session.toLowerCase())
        : true;
      const matchesSemester = filterParams.semester
        ? student.semester === Number(filterParams.semester)
        : true;
      const matchesStudentName = filterParams.studentName
        ? student.studentName
            .toLowerCase()
            .includes(filterParams.studentName.toLowerCase())
        : true;

      const matchesCourse =
        filterParams.courseTitle || filterParams.courseCode
          ? student.courses.some((course) => {
              const titleMatch = filterParams.courseTitle
                ? course.courseTitle
                    .toLowerCase()
                    .includes(filterParams.courseTitle.toLowerCase())
                : true;
              const codeMatch = filterParams.courseCode
                ? course.courseCode
                    .toLowerCase()
                    .includes(filterParams.courseCode.toLowerCase())
                : true;
              return titleMatch && codeMatch;
            })
          : true;

      return (
        matchesDepartment &&
        matchesSession &&
        matchesSemester &&
        matchesStudentName &&
        matchesCourse
      );
    });

    setStudentsData(filteredData);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents(filters);
  }, [filters]); // Re-fetch when filters change

  const handleFilterChange = (
    key: keyof StudentCourseFilters,
    value: string | number
  ) => {
    const newFilters = {
      ...filters,
      [key]: value === "" ? undefined : value,
    };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSearch = () => {
    // The useEffect hook already handles re-fetching/filtering when filters change
    // No explicit action needed here other than what handleFilterChange does
  };

  const handleClear = () => {
    setFilters({ session: currentSession }); // Reset to default session filter
    setCurrentPage(1);
  };

  // Pagination logic
  const paginatedStudents = useMemo(() => {
    const sortedStudents = [...studentsData].sort((a, b) =>
      a.studentName.localeCompare(b.studentName)
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedStudents.slice(startIndex, endIndex);
  }, [studentsData, currentPage]);

  const totalPages = Math.ceil(studentsData.length / ITEMS_PER_PAGE);

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

  const handleViewStudentCourses = (student: StudentRegisteredCourses) => {
    setViewingStudentCourses(student);
    setViewCoursesDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        Registered Courses for All Students
      </h2>

      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Students & Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-department">Department</Label>
              <Input
                id="filter-department"
                placeholder="e.g., CSE"
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
                placeholder="e.g., Fall-2025"
                value={filters.session || ""}
                onChange={(e) => handleFilterChange("session", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-semester">Semester</Label>
              <Input
                id="filter-semester"
                type="number"
                placeholder="e.g., 1"
                value={filters.semester || ""}
                onChange={(e) =>
                  handleFilterChange("semester", Number(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-studentName">Student Name</Label>
              <Input
                id="filter-studentName"
                placeholder="e.g., Alice Johnson"
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
                placeholder="e.g., Programming"
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
                placeholder="e.g., CSE111"
                value={filters.courseCode || ""}
                onChange={(e) =>
                  handleFilterChange("courseCode", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Table for Students */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Students ({studentsData.length})
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
              No students found matching the current filters.
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
                    <TableHead>Semester</TableHead>
                    <TableHead className="text-center">Total Courses</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-mono font-medium">
                        {student.studentId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.studentName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {student.department.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.session}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          Semester {student.semester}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {student.courses.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewStudentCourses(student)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">
                            View courses for {student.studentName}
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
      {!loading && studentsData.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              Courses for {viewingStudentCourses?.studentName} (
              {viewingStudentCourses?.studentId})
            </DialogTitle>
            <DialogDescription>
              Registered courses for {viewingStudentCourses?.studentName} in{" "}
              {viewingStudentCourses?.session} (Semester{" "}
              {viewingStudentCourses?.semester}).
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
                      <TableHead className="text-center text-gray-600 dark:text-gray-300 font-medium w-[80px]">
                        Grade
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewingStudentCourses.courses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          No courses registered for this student.
                        </TableCell>
                      </TableRow>
                    ) : (
                      viewingStudentCourses.courses.map((course, idx) => (
                        <TableRow
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <TableCell className="font-mono text-sm font-medium text-gray-900 dark:text-gray-50">
                            {course.courseCode.toUpperCase()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-800 dark:text-gray-100">
                            {course.courseTitle}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                            >
                              {course.credits}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className="text-xs px-1 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-100 dark:border-blue-800"
                            >
                              {course.grade || "N/A"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- Main Page Component (Consolidated) ---
export default function RegisteredCourseListPage() {
  const { user } = useAuth(); // Assuming useAuth provides { role: string } | null

  return (
    <PrivateRoute>
      <div className="container mx-auto py-8 space-y-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex flex-col gap-2 text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-3">
            <GraduationCap className="w-9 h-9 text-blue-600 dark:text-blue-400" />
            Registered Courses
          </h1>
          <p className="text-lg text-muted-foreground">
            {user?.role === "student"
              ? `View your registered courses for the ${CURRENT_SEMESTER}.`
              : `Overview of registered courses for all students.`}
          </p>
        </div>

        {user?.role === "student" ? (
          <StudentCoursesView
            courses={dummyStudentCourses}
            semester={CURRENT_SEMESTER}
          />
        ) : (
          <AdminCoursesView currentSession={CURRENT_SESSION} />
        )}
      </div>
    </PrivateRoute>
  );
}
