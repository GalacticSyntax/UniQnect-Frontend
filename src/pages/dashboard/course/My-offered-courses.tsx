import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, BookOpen } from "lucide-react";
import { useAuth } from "@/provider/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { axiosClient } from "@/lib/apiClient";

interface AdvisorCheckResponse {
  _id: string;
  teacherId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
    };
    teacherId: string;
  };
}

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

interface Teacher {
  _id: string;
  userId: string;
  teacherId: string;
  designation: string;
  joinedAt: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseAdvisor {
  _id: string;
  departmentCode: string;
  teacherId: string;
  session: string;
  semester: number;
  offeredCourses: string[];
  createdAt: string;
  updatedAt: string;
}

interface OfferedCourse {
  _id: string;
  courseId: Course;
  runningSession: string;
  courseAdvisor: CourseAdvisor;
  teacherId: Teacher;
  createdAt: string;
  updatedAt: string;
}

interface CreateOfferedCoursePayload {
  courseId: string;
  runningSession: string;
  courseAdvisor: string;
  teacherId: string;
}

function AddOfferedCourseDialog({
  isOpen,
  onOpenChange,
  advisorData,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  advisorData: AdvisorCheckResponse;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<CreateOfferedCoursePayload>({
    courseId: "",
    runningSession: "",
    courseAdvisor: advisorData._id,
    teacherId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosClient.post("/course-offered/offered", {
        ...formData,
      });

      if (!response?.data?.success)
        throw new Error("Failed to create offered course");

      toast.success("Offered course created successfully");
      onOpenChange(false);
      setFormData({
        courseId: "",
        runningSession: "",
        courseAdvisor: advisorData._id,
        teacherId: "",
      });
      onSuccess(); // Refresh the course list
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create offered course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Offered Course
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the new offered course.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseId">Course ID *</Label>
            <Input
              id="courseId"
              placeholder="Enter course ID"
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="runningSession">Running Session *</Label>
            <Input
              id="runningSession"
              placeholder="e.g., Fall-2025"
              value={formData.runningSession}
              onChange={(e) =>
                setFormData({ ...formData, runningSession: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2 hidden">
            <Label htmlFor="courseAdvisor">Course Advisor ID *</Label>
            <Input
              id="courseAdvisor"
              value={formData.courseAdvisor}
              onChange={(e) =>
                setFormData({ ...formData, courseAdvisor: e.target.value })
              }
              required
              disabled={true}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher ID *</Label>
            <Input
              id="teacherId"
              placeholder="e.g., TCH1001"
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({ ...formData, teacherId: e.target.value })
              }
              required
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? (
                "Adding..."
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function MyOfferedCoursesPage() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [advisorData, setAdvisorData] = useState<AdvisorCheckResponse | null>(
    null
  );
  const [loadingAdvisor, setLoadingAdvisor] = useState(true);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  const [offeredCourses, setOfferedCourses] = useState<OfferedCourse[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const { user } = useAuth();

  // Check if user is an advisor and fetch offered courses
  useEffect(() => {
    if (!user?._id) return;

    const checkAdvisorStatus = async () => {
      setLoadingAdvisor(true);
      setAdvisorError(null);
      try {
        // Check advisor status
        const advisorResponse = await fetch(
          `http://localhost:3000/api/v1/course-advisor/advisor/check/${user._id}`
        );
        if (!advisorResponse.ok)
          throw new Error("Failed to check advisor status");
        const advisorData = await advisorResponse.json();

        if (advisorData.success) {
          setAdvisorData(advisorData.data);

          // Fetch offered courses
          setLoadingCourses(true);
          const coursesResponse = await fetch(
            `http://localhost:3000/api/v1/course-offered/advisor/offered-courses/${user._id}`
          );
          if (!coursesResponse.ok)
            throw new Error("Failed to fetch offered courses");
          const coursesData = await coursesResponse.json();
          setOfferedCourses(coursesData.data);
        } else {
          setAdvisorError("You are not a course advisor");
        }
      } catch (err) {
        setAdvisorError(
          err instanceof Error ? err.message : "Failed to check advisor status"
        );
        toast.error("Failed to load data");
      } finally {
        setLoadingAdvisor(false);
        setLoadingCourses(false);
      }
    };

    checkAdvisorStatus();
  }, [user?._id]);

  const refreshCourses = async () => {
    if (!user?._id) return;
    try {
      setLoadingCourses(true);
      const response = await fetch(
        `http://localhost:3000/api/v1/course-offered/advisor/offered-courses/${user._id}`
      );
      if (!response.ok) throw new Error("Failed to fetch offered courses");
      const data = await response.json();
      setOfferedCourses(data.data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to fetch offered courses"
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  if (loadingAdvisor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div>Loading advisor information...</div>
      </div>
    );
  }

  if (advisorError) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-red-600">{advisorError}</div>
      </div>
    );
  }

  if (!advisorData) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          You are not authorized to view this page. Only course advisors can
          manage offered courses.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        My Offered Courses
      </h2>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            Manage Offered Courses
          </CardTitle>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Offered Course
          </Button>
        </CardHeader>
        <CardContent>
          {loadingCourses ? (
            <div className="flex items-center justify-center h-32">
              <div>Loading offered courses...</div>
            </div>
          ) : offeredCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No courses offered yet. Click "Add New Offered Course" to get
              started!
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Teacher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offeredCourses.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        {course.courseId.code}
                      </TableCell>
                      <TableCell>{course.courseId.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {course.courseId.credit} credits
                        </Badge>
                      </TableCell>
                      <TableCell>{course.runningSession}</TableCell>
                      <TableCell>{course.teacherId.teacherId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {advisorData && (
        <AddOfferedCourseDialog
          isOpen={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          advisorData={advisorData}
          onSuccess={refreshCourses}
        />
      )}
    </div>
  );
}

// Wrap with PrivateRoute for authentication
export default function MyOfferedCoursesPageWrapper() {
  return (
    <PrivateRoute>
      <MyOfferedCoursesPage />
    </PrivateRoute>
  );
}
