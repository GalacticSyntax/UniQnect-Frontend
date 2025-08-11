import type React from "react";
import { useState } from "react";

import { Check, X, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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

interface CourseRegistration {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  departmentCode: string;
  session: string;
  semester: string;
  courses: {
    courseId: string;
    courseCode: string;
    courseName: string;
    credit: number;
    instructor: string;
  }[];
  totalCredits: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  advisorId?: string;
  deptHeadId?: string;
}

type RegistrationStatus = "pending" | "approved" | "rejected";

const CourseAcceptancePage: React.FC = () => {
  // Dummy data for course registrations
  // const [registrations] =
  useState<CourseRegistration[]>([
    {
      id: "REG001",
      studentId: "STU001",
      studentName: "John Doe",
      studentEmail: "john.doe@university.edu",
      departmentCode: "CSE",
      session: "2024-25",
      semester: "Spring",
      courses: [
        {
          courseId: "CS101",
          courseCode: "CSE101",
          courseName: "Programming Fundamentals",
          credit: 3,
          instructor: "Dr. Smith",
        },
        {
          courseId: "CS102",
          courseCode: "CSE102",
          courseName: "Data Structures",
          credit: 3,
          instructor: "Dr. Johnson",
        },
        {
          courseId: "MATH201",
          courseCode: "MATH201",
          courseName: "Calculus II",
          credit: 3,
          instructor: "Dr. Brown",
        },
      ],
      totalCredits: 9,
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "REG002",
      studentId: "STU002",
      studentName: "Jane Smith",
      studentEmail: "jane.smith@university.edu",
      departmentCode: "EEE",
      session: "2024-25",
      semester: "Spring",
      courses: [
        {
          courseId: "EE201",
          courseCode: "EEE201",
          courseName: "Circuit Analysis",
          credit: 4,
          instructor: "Dr. Wilson",
        },
        {
          courseId: "EE202",
          courseCode: "EEE202",
          courseName: "Electronics",
          credit: 3,
          instructor: "Dr. Davis",
        },
        {
          courseId: "MATH301",
          courseCode: "MATH301",
          courseName: "Linear Algebra",
          credit: 3,
          instructor: "Dr. Taylor",
        },
      ],
      totalCredits: 10,
      status: "pending",
      submittedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "REG003",
      studentId: "STU003",
      studentName: "Mike Johnson",
      studentEmail: "mike.johnson@university.edu",
      departmentCode: "CSE",
      session: "2024-25",
      semester: "Spring",
      courses: [
        {
          courseId: "CS301",
          courseCode: "CSE301",
          courseName: "Database Systems",
          credit: 3,
          instructor: "Dr. Anderson",
        },
        {
          courseId: "CS302",
          courseCode: "CSE302",
          courseName: "Software Engineering",
          credit: 3,
          instructor: "Dr. White",
        },
      ],
      totalCredits: 6,
      status: "approved",
      submittedAt: "2024-01-14T09:15:00Z",
      advisorId: "ADV001",
    },
  ]);

  const [searchStudentId, setSearchStudentId] = useState("");
  const [searchedStudent, setSearchedStudent] =
    useState<CourseRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchStudent = async (): Promise<void> => {
    if (!searchStudentId.trim()) {
      toast.error("Please enter a student ID");
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const dummyStudent: CourseRegistration = {
        id: "REG" + Math.random().toString(36).substr(2, 9),
        studentId: searchStudentId,
        studentName: "Sample Student",
        studentEmail: `${searchStudentId.toLowerCase()}@university.edu`,
        departmentCode: "CSE",
        session: "2024-25",
        semester: "Spring",
        courses: [
          {
            courseId: "CS101",
            courseCode: "CSE101",
            courseName: "Programming Fundamentals",
            credit: 3,
            instructor: "Dr. Smith",
          },
          {
            courseId: "CS102",
            courseCode: "CSE102",
            courseName: "Data Structures",
            credit: 3,
            instructor: "Dr. Johnson",
          },
          {
            courseId: "MATH201",
            courseCode: "MATH201",
            courseName: "Calculus II",
            credit: 3,
            instructor: "Dr. Brown",
          },
          {
            courseId: "ENG101",
            courseCode: "ENG101",
            courseName: "English Composition",
            credit: 2,
            instructor: "Dr. Wilson",
          },
        ],
        totalCredits: 11,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      setSearchedStudent(dummyStudent);
      toast.success("Student found!");
    } catch (error: unknown) {
      console.error("Error searching for student:", error);
      toast.error("Error searching for student");
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = (): void => {
    setSearchStudentId("");
    setSearchedStudent(null);
  };

  const handleApprove = async (registrationId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the searched student's status
      if (searchedStudent && searchedStudent.id === registrationId) {
        setSearchedStudent((prev) =>
          prev ? { ...prev, status: "approved", advisorId: "ADV001" } : null
        );
      }

      toast.success("Course registration approved successfully!");
    } catch (error: unknown) {
      console.error("Error approving registration:", error);
      toast.error("Failed to approve registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (registrationId: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update the searched student's status
      if (searchedStudent && searchedStudent.id === registrationId) {
        setSearchedStudent((prev) =>
          prev ? { ...prev, status: "rejected", advisorId: "ADV001" } : null
        );
      }

      toast.success("Course registration rejected");
    } catch (error: unknown) {
      console.error("Error rejecting registration:", error);
      toast.error("Failed to reject registration");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: RegistrationStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Registration Management
          </h1>
          <p className="text-gray-600">
            Search and approve student course registrations
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Student
            </CardTitle>
            <CardDescription>
              Enter student ID to view their course registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID (e.g., STU001)"
                  value={searchStudentId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchStudentId(e.target.value)
                  }
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && handleSearchStudent()
                  }
                />
              </div>
              <Button onClick={handleSearchStudent} disabled={isSearching}>
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? "Searching..." : "Search"}
              </Button>
              <Button variant="outline" onClick={handleClearSearch}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchedStudent && (
          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {searchedStudent.studentName}
                  </CardTitle>
                  <CardDescription>
                    ID: {searchedStudent.studentId} |{" "}
                    {searchedStudent.studentEmail}
                  </CardDescription>
                  <CardDescription>
                    {searchedStudent.departmentCode} | {searchedStudent.session}{" "}
                    - {searchedStudent.semester}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(searchedStudent.status)}
                  <span className="text-sm text-gray-500">
                    {new Date(searchedStudent.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Selected Courses ({searchedStudent.totalCredits} credits)
                  </h4>
                  <div className="grid gap-2">
                    {searchedStudent.courses.map((course) => (
                      <div
                        key={course.courseId}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {course.courseCode}
                          </span>{" "}
                          - {course.courseName}
                          <span className="text-sm text-gray-600 ml-2">
                            ({course.credit} credits)
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {course.instructor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {searchedStudent.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApprove(searchedStudent.id)}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      {isLoading ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(searchedStudent.id)}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      {isLoading ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!searchedStudent && !isSearching && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">
                Enter a student ID above to view their course registration
                details.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseAcceptancePage;
