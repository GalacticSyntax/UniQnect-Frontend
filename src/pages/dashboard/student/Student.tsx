import { useState, useEffect, useMemo } from "react";
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
import { Search, X, GraduationCap } from "lucide-react";
import { axiosClient } from "@/lib/apiClient";

interface Department {
  _id: string;
  code: string;
  name: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

interface UserInfo {
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

interface Student {
  _id: string;
  userId: UserInfo | null;
  studentId: string;
  departmentId: Department;
  admittedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface StudentFilters {
  fullName?: string;
  email?: string;
  studentId?: string;
  department?: string;
  phone?: string;
}

const ITEMS_PER_PAGE = 10;

export default function StudentManagement() {
  // State
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<StudentFilters>({});

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/student");
      const studentData = response.data.data || response.data || [];
      setStudents(studentData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch students");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    let filtered = students;

    // Apply filters
    if (filters.fullName) {
      filtered = filtered.filter((student) =>
        student.userId?.fullName
          ?.toLowerCase()
          .includes(filters.fullName!.toLowerCase())
      );
    }
    if (filters.email) {
      filtered = filtered.filter((student) =>
        student.userId?.email
          ?.toLowerCase()
          .includes(filters.email!.toLowerCase())
      );
    }
    if (filters.studentId) {
      filtered = filtered.filter((student) =>
        student.studentId
          .toLowerCase()
          .includes(filters.studentId!.toLowerCase())
      );
    }
    if (filters.department) {
      filtered = filtered.filter(
        (student) =>
          student.departmentId?.name
            ?.toLowerCase()
            .includes(filters.department!.toLowerCase()) ||
          student.departmentId?.code
            ?.toLowerCase()
            .includes(filters.department!.toLowerCase())
      );
    }
    if (filters.phone) {
      filtered = filtered.filter((student) =>
        student.userId?.phone?.includes(filters.phone!)
      );
    }

    return filtered;
  }, [students, filters]);

  // Filter handlers
  const handleFilterChange = (key: keyof StudentFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleClear = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSearch = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setLoading(false);
  };

  // Pagination
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

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
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6 px-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <p className="text-muted-foreground">
          Manage and view enrolled students with filtering and pagination
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g., John Doe"
                value={filters.fullName || ""}
                onChange={(e) => handleFilterChange("fullName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="e.g., john@example.com"
                value={filters.email || ""}
                onChange={(e) => handleFilterChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                placeholder="e.g., 210303020001"
                value={filters.studentId || ""}
                onChange={(e) =>
                  handleFilterChange("studentId", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., CSE"
                value={filters.department || ""}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="e.g., +1234567890"
                value={filters.phone || ""}
                onChange={(e) => handleFilterChange("phone", e.target.value)}
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Students ({filteredStudents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading students...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No students found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <img
                            src={
                              student.userId?.image ||
                              "/placeholder.svg?height=40&width=40&query=student avatar"
                            }
                            alt={student.userId?.fullName || "Student"}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "/placeholder.svg?height=40&width=40";
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.studentId}
                        </TableCell>
                        <TableCell>
                          {student.userId?.fullName || "N/A"}
                        </TableCell>
                        <TableCell>{student.userId?.email || "N/A"}</TableCell>
                        <TableCell>{student.userId?.phone || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {student.departmentId?.name}
                            </span>
                            <span className="text-sm text-muted-foreground uppercase">
                              {student.departmentId?.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.userId ? "default" : "destructive"}
                          >
                            {student.userId ? "Active" : "No Account"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && filteredStudents.length > 0 && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                      onClick={() => setCurrentPage(page as number)}
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
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
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
    </div>
  );
}
