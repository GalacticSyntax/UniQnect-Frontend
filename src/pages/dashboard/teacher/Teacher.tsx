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
import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

interface User {
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

interface Department {
  _id: string;
  code: string;
  name: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

interface Teacher {
  _id: string;
  userId: User | null;
  teacherId: string;
  designation: string;
  joinedAt: string;
  departmentId: Department;
  createdAt: string;
  updatedAt: string;
}

interface TeacherFilters {
  teacherId?: string;
  fullName?: string;
  email?: string;
  designation?: string;
  department?: string;
  phone?: string;
  gender?: string;
}

const ITEMS_PER_PAGE = 10;

export default function TeacherManagement() {
  // State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<TeacherFilters>({});

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/teacher");
      const teacherData = response.data.data || response.data || [];
      setTeachers(teacherData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch teachers");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = useMemo(() => {
    let filtered = teachers;

    // Apply filters
    if (filters.teacherId) {
      filtered = filtered.filter((teacher) =>
        teacher.teacherId
          .toLowerCase()
          .includes(filters.teacherId!.toLowerCase())
      );
    }
    if (filters.fullName) {
      filtered = filtered.filter((teacher) =>
        teacher.userId?.fullName
          .toLowerCase()
          .includes(filters.fullName!.toLowerCase())
      );
    }
    if (filters.email) {
      filtered = filtered.filter((teacher) =>
        teacher.userId?.email
          .toLowerCase()
          .includes(filters.email!.toLowerCase())
      );
    }
    if (filters.designation) {
      filtered = filtered.filter((teacher) =>
        teacher.designation
          .toLowerCase()
          .includes(filters.designation!.toLowerCase())
      );
    }
    if (filters.department) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.departmentId.name
            .toLowerCase()
            .includes(filters.department!.toLowerCase()) ||
          teacher.departmentId.code
            .toLowerCase()
            .includes(filters.department!.toLowerCase())
      );
    }
    if (filters.phone) {
      filtered = filtered.filter((teacher) =>
        teacher.userId?.phone.includes(filters.phone!)
      );
    }
    if (filters.gender) {
      filtered = filtered.filter((teacher) =>
        teacher.userId?.gender
          .toLowerCase()
          .includes(filters.gender!.toLowerCase())
      );
    }

    return filtered;
  }, [teachers, filters]);

  // Filter handlers
  const handleFilterChange = (key: keyof TeacherFilters, value: string) => {
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
  const paginatedTeachers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTeachers.slice(startIndex, endIndex);
  }, [filteredTeachers, currentPage]);

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

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
        <h1 className="text-3xl font-bold">Teacher Management</h1>
        <p className="text-muted-foreground">
          Manage and view teachers with filtering and pagination
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input
                id="teacherId"
                placeholder="e.g., TCH1001"
                value={filters.teacherId || ""}
                onChange={(e) =>
                  handleFilterChange("teacherId", e.target.value)
                }
              />
            </div>

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
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                placeholder="e.g., lecturer"
                value={filters.designation || ""}
                onChange={(e) =>
                  handleFilterChange("designation", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Computer Science"
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

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                placeholder="e.g., male"
                value={filters.gender || ""}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
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
            Teachers ({filteredTeachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading teachers...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profile</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No teachers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTeachers.map((teacher) => (
                      <TableRow key={teacher._id}>
                        <TableCell>
                          {teacher.userId ? (
                            <img
                              src={
                                teacher.userId.image ||
                                "/placeholder.svg?height=40&width=40&query=teacher avatar"
                              }
                              alt={teacher.userId.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "/placeholder.svg?height=40&width=40";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <GraduationCap className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {teacher.teacherId}
                        </TableCell>
                        <TableCell>
                          {teacher.userId?.fullName || "No User Account"}
                        </TableCell>
                        <TableCell>{teacher.userId?.email || "N/A"}</TableCell>
                        <TableCell>{teacher.userId?.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {teacher.designation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {teacher.departmentId.name}
                            </span>
                            <span className="text-sm text-muted-foreground uppercase">
                              {teacher.departmentId.code}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {teacher.userId ? (
                            <Badge
                              variant={
                                teacher.userId.isVerified
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {teacher.userId.isVerified
                                ? "Verified"
                                : "Unverified"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">No Account</Badge>
                          )}
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
      {!loading && filteredTeachers.length > 0 && totalPages > 1 && (
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
