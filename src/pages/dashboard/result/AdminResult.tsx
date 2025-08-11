import type React from "react";
import { useState, useMemo, type ChangeEvent } from "react";

import { Search, Eye, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminResult {
  id: string;
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  courseCredit: number;
  departmentCode: string;
  departmentName: string;
  teacherId: string;
  teacherName: string;
  session: string;
  totalMarks: number;
  grade: string;
  submittedDate: string;
}

interface AdminFilters {
  studentName?: string;
  studentId?: string;
  courseCode?: string;
  courseName?: string;
  departmentCode?: string;
  teacherName?: string;
  session?: string;
}

const AdminResult: React.FC = () => {
  const [allResults] = useState<AdminResult[]>([
    {
      id: "1",
      studentId: "STU001",
      studentName: "John Doe",
      courseCode: "CSE101",
      courseName: "Introduction to Programming",
      courseCredit: 3,
      departmentCode: "CSE",
      departmentName: "Computer Science & Engineering",
      teacherId: "TCH001",
      teacherName: "Dr. Smith",
      session: "Spring 2024",
      totalMarks: 85,
      grade: "A-",
      submittedDate: "2024-01-15",
    },
    {
      id: "2",
      studentId: "STU002",
      studentName: "Jane Smith",
      courseCode: "CSE102",
      courseName: "Data Structures",
      courseCredit: 4,
      departmentCode: "CSE",
      departmentName: "Computer Science & Engineering",
      teacherId: "TCH002",
      teacherName: "Prof. Johnson",
      session: "Spring 2024",
      totalMarks: 92,
      grade: "A",
      submittedDate: "2024-01-16",
    },
    {
      id: "3",
      studentId: "STU003",
      studentName: "Mike Wilson",
      courseCode: "EEE201",
      courseName: "Circuit Analysis",
      courseCredit: 3,
      departmentCode: "EEE",
      departmentName: "Electrical & Electronic Engineering",
      teacherId: "TCH003",
      teacherName: "Dr. Brown",
      session: "Spring 2024",
      totalMarks: 78,
      grade: "B+",
      submittedDate: "2024-01-17",
    },
    {
      id: "4",
      studentId: "STU004",
      studentName: "Sarah Davis",
      courseCode: "CSE103",
      courseName: "Database Systems",
      courseCredit: 3,
      departmentCode: "CSE",
      departmentName: "Computer Science & Engineering",
      teacherId: "TCH004",
      teacherName: "Dr. Wilson",
      session: "Spring 2024",
      totalMarks: 88,
      grade: "A-",
      submittedDate: "2024-01-18",
    },
    {
      id: "5",
      studentId: "STU005",
      studentName: "Tom Anderson",
      courseCode: "ME301",
      courseName: "Thermodynamics",
      courseCredit: 4,
      departmentCode: "ME",
      departmentName: "Mechanical Engineering",
      teacherId: "TCH005",
      teacherName: "Prof. Johnson",
      session: "Spring 2024",
      totalMarks: 95,
      grade: "A+",
      submittedDate: "2024-01-19",
    },
    {
      id: "6",
      studentId: "STU006",
      studentName: "Lisa Garcia",
      courseCode: "EEE202",
      courseName: "Digital Electronics",
      courseCredit: 3,
      departmentCode: "EEE",
      departmentName: "Electrical & Electronic Engineering",
      teacherId: "TCH006",
      teacherName: "Dr. Martinez",
      session: "Spring 2024",
      totalMarks: 82,
      grade: "B+",
      submittedDate: "2024-01-20",
    },
    {
      id: "7",
      studentId: "STU007",
      studentName: "Alex Chen",
      courseCode: "CE401",
      courseName: "Structural Engineering",
      courseCredit: 4,
      departmentCode: "CE",
      departmentName: "Civil Engineering",
      teacherId: "TCH007",
      teacherName: "Dr. Kim",
      session: "Spring 2024",
      totalMarks: 90,
      grade: "A",
      submittedDate: "2024-01-21",
    },
  ]);

  const [filters, setFilters] = useState<AdminFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const filteredResults = useMemo(() => {
    return allResults.filter((result) => {
      const matchesStudentName = filters.studentName
        ? result.studentName
            .toLowerCase()
            .includes(filters.studentName.toLowerCase())
        : true;

      const matchesStudentId = filters.studentId
        ? result.studentId
            .toLowerCase()
            .includes(filters.studentId.toLowerCase())
        : true;

      const matchesCourseCode = filters.courseCode
        ? result.courseCode
            .toLowerCase()
            .includes(filters.courseCode.toLowerCase())
        : true;

      const matchesCourseName = filters.courseName
        ? result.courseName
            .toLowerCase()
            .includes(filters.courseName.toLowerCase())
        : true;

      const matchesDepartmentCode = filters.departmentCode
        ? result.departmentCode
            .toLowerCase()
            .includes(filters.departmentCode.toLowerCase())
        : true;

      const matchesTeacherName = filters.teacherName
        ? result.teacherName
            .toLowerCase()
            .includes(filters.teacherName.toLowerCase())
        : true;

      const matchesSession = filters.session
        ? result.session.toLowerCase().includes(filters.session.toLowerCase())
        : true;

      return (
        matchesStudentName &&
        matchesStudentId &&
        matchesCourseCode &&
        matchesCourseName &&
        matchesDepartmentCode &&
        matchesTeacherName &&
        matchesSession
      );
    });
  }, [allResults, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    return filteredResults.slice(startIndex, startIndex + resultsPerPage);
  }, [filteredResults, currentPage, resultsPerPage]);

  const handleFilterChange = (key: keyof AdminFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : value,
    }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleClear = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
        return "text-green-600 font-semibold";
      case "A":
        return "text-green-500 font-semibold";
      case "A-":
        return "text-green-400 font-semibold";
      case "B+":
        return "text-blue-500 font-semibold";
      case "B":
        return "text-blue-400 font-semibold";
      case "B-":
        return "text-yellow-500 font-semibold";
      case "C+":
        return "text-orange-500 font-semibold";
      case "C":
        return "text-orange-400 font-semibold";
      case "F":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Results Overview
          </h1>
          <p className="text-gray-600">
            View and monitor all submitted student results across all courses
            and teachers
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Filter Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  placeholder="e.g., John Doe"
                  value={filters.studentName || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("studentName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="e.g., STU001"
                  value={filters.studentId || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("studentId", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CSE101"
                  value={filters.courseCode || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("courseCode", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Programming"
                  value={filters.courseName || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("courseName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentCode">Department Code</Label>
                <Input
                  id="departmentCode"
                  placeholder="e.g., CSE"
                  value={filters.departmentCode || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("departmentCode", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  placeholder="e.g., Dr. Smith"
                  value={filters.teacherName || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("teacherName", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Input
                  id="session"
                  placeholder="e.g., Spring 2024"
                  value={filters.session || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFilterChange("session", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleClear}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              All Results
            </CardTitle>
            <CardDescription>
              Complete overview of all student results with course and teacher
              details
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Results Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No results found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((result) => (
                      <TableRow key={result.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {result.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.studentId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {result.courseCode}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.courseName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {result.courseCredit}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {result.departmentCode}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.departmentName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {result.teacherName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {result.teacherId}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{result.session}</TableCell>
                        <TableCell className="font-semibold">
                          {result.totalMarks}/100
                        </TableCell>
                        <TableCell className={getGradeColor(result.grade)}>
                          {result.grade}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {result.submittedDate}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  Showing {(currentPage - 1) * resultsPerPage + 1} to{" "}
                  {Math.min(
                    currentPage * resultsPerPage,
                    filteredResults.length
                  )}{" "}
                  of {filteredResults.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminResult;
