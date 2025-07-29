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
import { Search, X, BookOpen } from "lucide-react";
import axios from "axios";

// Types
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

interface CourseFilters {
  code?: string;
  name?: string;
  depart?: string;
  credit?: number;
}

// Axios client
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

const ITEMS_PER_PAGE = 10;

export default function CourseManagement() {
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CourseFilters>({});

  // Fetch courses function
  const fetchCourses = async (filterParams: CourseFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/course/courses", {
        params: filterParams,
      });

      if (response.data.success) {
        setCourses(response.data.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch courses");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter handlers
  const handleFilterChange = (key: keyof CourseFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || undefined,
    };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses(filters);
  };

  const handleClear = () => {
    setFilters({});
    setCurrentPage(1);
    fetchCourses({});
  };

  // Pagination
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return courses.slice(startIndex, endIndex);
  }, [courses, currentPage]);

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

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
        <h1 className="text-3xl font-bold">Course Management</h1>
        <p className="text-muted-foreground">
          Manage and view university courses with filtering and pagination
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filter Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                placeholder="e.g., CSE111"
                value={filters.code || ""}
                onChange={(e) => handleFilterChange("code", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="e.g., Programming"
                value={filters.name || ""}
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="depart">Department</Label>
              <Input
                id="depart"
                placeholder="e.g., CSE"
                value={filters.depart || ""}
                onChange={(e) => handleFilterChange("depart", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit">Credit Hours</Label>
              <Input
                id="credit"
                type="number"
                placeholder="e.g., 3"
                value={filters.credit || ""}
                onChange={(e) => handleFilterChange("credit", e.target.value)}
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
            <BookOpen className="w-5 h-5" />
            Courses ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-muted-foreground">Loading courses...</div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Credit Hours</TableHead>
                    <TableHead>Prerequisites</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCourses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No courses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCourses.map((course) => (
                      <TableRow key={course._id}>
                        <TableCell className="font-mono font-medium">
                          {course.code.toUpperCase()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {course.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {course.depart.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {course.credit} credits
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {course.prerequisiteCourse.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {course.prerequisiteCourse.map((prereq) => (
                                <Badge
                                  key={prereq._id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {prereq.code.toUpperCase()}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
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
      {!loading && courses.length > 0 && totalPages > 1 && (
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
