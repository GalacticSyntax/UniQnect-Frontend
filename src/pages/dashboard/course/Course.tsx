"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X, BookOpen, Edit } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";
import { toast } from "sonner";
import axios from "axios";
import PrivateRoute from "@/components/PrivateRoute";

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
  const { user } = useAuth();
  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CourseFilters>({});
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  // Edit course handler
  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setEditDialogOpen(true);
  };

  // Update course handler
  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const payload = {
        ...editingCourse,
        prerequisiteCourse: editingCourse.prerequisiteCourse.map((p) => p._id),
      };

      await axiosClient.put(`/course/course/${editingCourse._id}`, payload);
      toast.success("Course updated successfully");
      setEditDialogOpen(false);
      setEditingCourse(null);
      fetchCourses(filters);
    } catch {
      toast.error("Error updating course");
    }
  };

  // Handle edit form changes
  const handleEditFormChange = (
    field: keyof Course,
    value: string | number
  ) => {
    if (!editingCourse) return;

    setEditingCourse((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handlePrerequisiteChange = (value: string) => {
    if (!editingCourse) return;

    const prerequisites = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((code) => ({
        _id: code,
        name: code,
        code: code,
        credit: 0,
        depart: "",
        prerequisiteCourse: [],
        createdAt: "",
        updatedAt: "",
      }));

    setEditingCourse((prev) => ({
      ...prev!,
      prerequisiteCourse: prerequisites,
    }));
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
    <PrivateRoute>
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
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={loading}
              >
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
                      {user?.role === "admin" && (
                        <TableHead className="text-center">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCourses.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={user?.role === "admin" ? 6 : 5}
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
                          {user?.role === "admin" && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCourse(course)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
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

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Course
              </DialogTitle>
              <DialogDescription>
                Update course information below.
              </DialogDescription>
            </DialogHeader>

            {editingCourse && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Course Name</Label>
                    <Input
                      id="edit-name"
                      value={editingCourse.name}
                      onChange={(e) =>
                        handleEditFormChange("name", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-code">Course Code</Label>
                    <Input
                      id="edit-code"
                      value={editingCourse.code}
                      onChange={(e) =>
                        handleEditFormChange(
                          "code",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-credit">Credit Hours</Label>
                    <Input
                      id="edit-credit"
                      type="number"
                      step="0.5"
                      min="0"
                      value={editingCourse.credit}
                      onChange={(e) =>
                        handleEditFormChange("credit", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-depart">Department</Label>
                    <Input
                      id="edit-depart"
                      value={editingCourse.depart}
                      onChange={(e) =>
                        handleEditFormChange(
                          "depart",
                          e.target.value.toUpperCase()
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-prerequisite">
                    Prerequisite Course Codes
                  </Label>
                  <Input
                    id="edit-prerequisite"
                    placeholder="e.g., CSE111, CSE113 (separate with commas)"
                    value={editingCourse.prerequisiteCourse
                      .map((p) => p.code)
                      .join(", ")}
                    onChange={(e) => handlePrerequisiteChange(e.target.value)}
                  />
                  {editingCourse.prerequisiteCourse.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {editingCourse.prerequisiteCourse.map((prereq, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {prereq.code}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateCourse}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Course
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  );
}
