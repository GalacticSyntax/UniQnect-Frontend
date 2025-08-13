import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/lib/apiClient";

interface ApiCourse {
  _id: string;
  courseId: {
    _id: string;
    name: string;
    code: string;
    credit: number;
    depart: string;
    prerequisiteCourse: string[];
  };
  runningSession: string;
  courseAdvisor: {
    _id: string;
    departmentCode: string;
    teacherId: {
      _id: string;
      userId: {
        _id: string;
        fullName: string;
        email: string;
        role: string;
      };
      teacherId: string;
      designation: string;
    };
    session: string;
    semester: number;
  };
  teacherId: {
    _id: string;
    userId: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    };
    teacherId: string;
    designation: string;
  };
}

interface Course {
  id: string;
  actualCourseId: string;
  courseCode: string;
  courseName: string;
  credit: number;
  department: string;
  teacherName: string;
  teacherId: string;
  session: string;
  semester: number;
  advisorName: string;
  prerequisites: string[];
}

interface RegistrationForm {
  studentId: string;
  selectedCourses: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const StudentRegistrationPageWithAPI: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationForm>({
    studentId: "",
    selectedCourses: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  // Fetch available courses on component mount
  useEffect(() => {
    fetchAvailableCourses();
  }, []);

  const fetchAvailableCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await axiosClient.get<ApiResponse<ApiCourse[]>>(
        "/course-offered/offereds"
      );

      if (response.data.success) {
        // Transform API data to match UI structure
        const transformedCourses: Course[] = response.data.data.map(
          (apiCourse) => ({
            id: apiCourse._id,
            actualCourseId: apiCourse.courseId._id,
            courseCode: apiCourse.courseId.code,
            courseName: apiCourse.courseId.name,
            credit: apiCourse.courseId.credit,
            department: apiCourse.courseId.depart,
            teacherName: apiCourse.teacherId.userId.fullName,
            teacherId: apiCourse.teacherId.teacherId,
            session: apiCourse.runningSession,
            semester: apiCourse.courseAdvisor.semester,
            advisorName: apiCourse.courseAdvisor.teacherId.userId.fullName,
            prerequisites: apiCourse.courseId.prerequisiteCourse || [],
          })
        );

        setAvailableCourses(transformedCourses);
      } else {
        toast.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load available courses");
    } finally {
      setCoursesLoading(false);
    }
  };

  const filteredCourses = availableCourses.filter(
    (course) =>
      course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseSelection = (
    courseId: string,
    checked: boolean | string
  ) => {
    const isChecked = checked === true || checked === "true";
    setFormData((prev) => ({
      ...prev,
      selectedCourses: isChecked
        ? [...prev.selectedCourses, courseId]
        : prev.selectedCourses.filter((id) => id !== courseId),
    }));
  };

  const handleRemoveCourse = (courseId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: prev.selectedCourses.filter((id) => id !== courseId),
    }));
  };

  const getTotalCredits = () => {
    return formData.selectedCourses.reduce((total, courseId) => {
      const course = availableCourses.find((c) => c.id === courseId);
      return total + (course?.credit || 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.studentId) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.selectedCourses.length === 0) {
      toast.error("Please select at least one course");
      return;
    }

    const totalCredits = getTotalCredits();
    if (totalCredits > 18) {
      toast.error(
        "Maximum credit limit is 18. Current selection: " + totalCredits
      );
      return;
    }

    setLoading(true);

    try {
      const actualCourseIds = formData.selectedCourses
        .map((selectedId) => {
          const course = availableCourses.find((c) => c.id === selectedId);
          return course?.actualCourseId;
        })
        .filter(Boolean); // Remove any undefined values

      const registrationData = {
        studentId: formData.studentId,
        courseId: actualCourseIds, // Send the nested courseId._id values
      };

      const response = await axiosClient.post<ApiResponse<unknown>>(
        "/course-registered",
        registrationData
      );

      if (response.data.success) {
        toast.success(
          `Successfully registered for ${formData.selectedCourses.length} courses!`
        );

        // Reset form
        setFormData({
          studentId: "",
          selectedCourses: [],
        });
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Registration error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        toast.error(
          axiosError.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    // Create a synthetic form event to reuse existing logic
    const syntheticEvent = {
      preventDefault: () => {},
      currentTarget: e.currentTarget.form,
    } as React.FormEvent<HTMLFormElement>;

    await handleSubmit(syntheticEvent);
  };

  const handleClear = () => {
    setFormData({
      studentId: "",
      selectedCourses: [],
    });
    setSearchTerm("");
    toast.info("Form cleared");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Course Registration
          </h1>
          <p className="text-gray-600">Select and register for your courses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Information Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Information
                </CardTitle>
                <CardDescription>
                  Enter your details to register for courses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID *</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    placeholder="Enter student ID"
                    required
                  />
                </div>
                {/* Selected Courses Summary */}
                {formData.selectedCourses.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Selected Courses ({formData.selectedCourses.length})
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Total Credits: {getTotalCredits()}/18
                    </p>
                    <div className="space-y-2">
                      {formData.selectedCourses.map((courseId) => {
                        const course = availableCourses.find(
                          (c) => c.id === courseId
                        );
                        return course ? (
                          <div
                            key={courseId}
                            className="flex items-center justify-between bg-white p-2 rounded border"
                          >
                            <div>
                              <span className="font-medium text-sm">
                                {course.courseCode}
                              </span>
                              <span className="text-xs text-gray-600 ml-2">
                                ({course.credit} credits)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveCourse(courseId)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleRegisterClick}
                    disabled={loading || formData.selectedCourses.length === 0}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Available Courses
                  {coursesLoading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </CardTitle>
                <CardDescription>
                  Browse and select courses for registration
                </CardDescription>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search courses by code, name, department, or teacher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    disabled={coursesLoading}
                  />
                </div>
              </CardHeader>
              <CardContent>
                {coursesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading courses...</span>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredCourses.map((course) => (
                      <div
                        key={course.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              id={course.id}
                              checked={formData.selectedCourses.includes(
                                course.id
                              )}
                              onCheckedChange={(checked) =>
                                handleCourseSelection(course.id, checked)
                              }
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-gray-900">
                                  {course.courseCode}
                                </h3>
                                <Badge variant="secondary">
                                  {course.credit} Credits
                                </Badge>
                                <Badge variant="outline">
                                  Semester {course.semester}
                                </Badge>
                              </div>
                              <p className="text-gray-700 font-medium mb-1">
                                {course.courseName}
                              </p>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                  <span className="font-medium">
                                    Department:
                                  </span>{" "}
                                  {course.department.toUpperCase()}
                                </p>
                                <p>
                                  <span className="font-medium">Teacher:</span>{" "}
                                  {course.teacherName} ({course.teacherId})
                                </p>
                                <p>
                                  <span className="font-medium">Advisor:</span>{" "}
                                  {course.advisorName}
                                </p>
                                <p>
                                  <span className="font-medium">Session:</span>{" "}
                                  {course.session}
                                </p>
                                {course.prerequisites &&
                                  course.prerequisites.length > 0 && (
                                    <p>
                                      <span className="font-medium">
                                        Prerequisites:
                                      </span>{" "}
                                      {course.prerequisites.join(", ")}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {filteredCourses.length === 0 && !coursesLoading && (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No courses found matching your search.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPageWithAPI;
