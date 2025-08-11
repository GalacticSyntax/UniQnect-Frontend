import type React from "react";
import { useState } from "react";
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
import { Search, BookOpen, Users, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  credit: number;
  department: string;
  teacherName: string;
  teacherId: string;
  session: string;
  semester: string;
  maxStudents: number;
  enrolledStudents: number;
  schedule: string;
  prerequisites?: string[];
}

interface RegistrationForm {
  studentId: string;
  studentName: string;
  session: string;
  semester: string;
  selectedCourses: string[];
}

const StudentRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationForm>({
    studentId: "",
    studentName: "",
    session: "",
    semester: "",
    selectedCourses: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Dummy course data
  const availableCourses: Course[] = [
    {
      id: "1",
      courseCode: "CSE101",
      courseName: "Introduction to Programming",
      credit: 3,
      department: "Computer Science",
      teacherName: "Dr. John Smith",
      teacherId: "T001",
      session: "2024",
      semester: "Spring",
      maxStudents: 40,
      enrolledStudents: 25,
      schedule: "Mon, Wed, Fri 10:00-11:00 AM",
      prerequisites: [],
    },
    {
      id: "2",
      courseCode: "CSE201",
      courseName: "Data Structures",
      credit: 3,
      department: "Computer Science",
      teacherName: "Dr. Sarah Johnson",
      teacherId: "T002",
      session: "2024",
      semester: "Spring",
      maxStudents: 35,
      enrolledStudents: 30,
      schedule: "Tue, Thu 2:00-3:30 PM",
      prerequisites: ["CSE101"],
    },
    {
      id: "3",
      courseCode: "MAT101",
      courseName: "Calculus I",
      credit: 4,
      department: "Mathematics",
      teacherName: "Prof. Michael Brown",
      teacherId: "T003",
      session: "2024",
      semester: "Spring",
      maxStudents: 50,
      enrolledStudents: 35,
      schedule: "Mon, Wed, Fri 9:00-10:00 AM",
      prerequisites: [],
    },
    {
      id: "4",
      courseCode: "PHY101",
      courseName: "Physics I",
      credit: 3,
      department: "Physics",
      teacherName: "Dr. Emily Davis",
      teacherId: "T004",
      session: "2024",
      semester: "Spring",
      maxStudents: 30,
      enrolledStudents: 20,
      schedule: "Tue, Thu 11:00-12:30 PM",
      prerequisites: [],
    },
    {
      id: "5",
      courseCode: "ENG101",
      courseName: "English Composition",
      credit: 2,
      department: "English",
      teacherName: "Prof. Robert Wilson",
      teacherId: "T005",
      session: "2024",
      semester: "Spring",
      maxStudents: 25,
      enrolledStudents: 18,
      schedule: "Mon, Wed 1:00-2:00 PM",
      prerequisites: [],
    },
  ];

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

  const handleCourseSelection = (courseId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedCourses: checked
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.studentId ||
      !formData.studentName ||
      !formData.session ||
      !formData.semester
    ) {
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(
        `Successfully registered for ${formData.selectedCourses.length} courses!`
      );

      // Reset form
      setFormData({
        studentId: "",
        studentName: "",
        session: "",
        semester: "",
        selectedCourses: [],
      });
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      studentId: "",
      studentName: "",
      session: "",
      semester: "",
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

                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name *</Label>
                  <Input
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session">Session *</Label>
                  <Input
                    id="session"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Input
                    id="semester"
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    placeholder="e.g., Spring"
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
                    onClick={handleSubmit}
                    disabled={loading || formData.selectedCourses.length === 0}
                    className="flex-1"
                  >
                    {loading ? "Registering..." : "Register"}
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
                  />
                </div>
              </CardHeader>
              <CardContent>
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
                              handleCourseSelection(
                                course.id,
                                checked as boolean
                              )
                            }
                            disabled={
                              course.enrolledStudents >= course.maxStudents
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
                              {course.enrolledStudents >=
                                course.maxStudents && (
                                <Badge variant="destructive">Full</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 font-medium mb-1">
                              {course.courseName}
                            </p>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <span className="font-medium">Department:</span>{" "}
                                {course.department}
                              </p>
                              <p>
                                <span className="font-medium">Teacher:</span>{" "}
                                {course.teacherName} ({course.teacherId})
                              </p>
                              <p className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.schedule}
                              </p>
                              <p>
                                <span className="font-medium">Enrollment:</span>{" "}
                                {course.enrolledStudents}/{course.maxStudents}{" "}
                                students
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

                  {filteredCourses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No courses found matching your search.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationPage;
