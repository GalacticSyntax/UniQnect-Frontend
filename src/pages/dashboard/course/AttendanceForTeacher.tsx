import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarDays,
  Users,
  BookOpen,
  Save,
  CheckCircle,
  CalendarIcon,
  Eye,
  Edit,
  Lock,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data
const courses = [
  { id: "CS101", name: "Introduction to Computer Science", code: "CS101" },
  { id: "CS201", name: "Data Structures and Algorithms", code: "CS201" },
  { id: "CS301", name: "Database Management Systems", code: "CS301" },
  { id: "CS401", name: "Software Engineering", code: "CS401" },
  { id: "MATH101", name: "Calculus I", code: "MATH101" },
  { id: "PHYS101", name: "Physics I", code: "PHYS101" },
];

const semesters = [
  { id: "fall2024", name: "Fall 2024" },
  { id: "spring2024", name: "Spring 2024" },
  { id: "summer2024", name: "Summer 2024" },
  { id: "fall2023", name: "Fall 2023" },
];

const mockStudents = [
  {
    id: "1",
    name: "Alice Johnson",
    rollNo: "2021001",
    email: "alice.johnson@university.edu",
  },
  {
    id: "2",
    name: "Bob Smith",
    rollNo: "2021002",
    email: "bob.smith@university.edu",
  },
  {
    id: "3",
    name: "Charlie Brown",
    rollNo: "2021003",
    email: "charlie.brown@university.edu",
  },
  {
    id: "4",
    name: "Diana Prince",
    rollNo: "2021004",
    email: "diana.prince@university.edu",
  },
  {
    id: "5",
    name: "Edward Wilson",
    rollNo: "2021005",
    email: "edward.wilson@university.edu",
  },
  {
    id: "6",
    name: "Fiona Davis",
    rollNo: "2021006",
    email: "fiona.davis@university.edu",
  },
  {
    id: "7",
    name: "George Miller",
    rollNo: "2021007",
    email: "george.miller@university.edu",
  },
  {
    id: "8",
    name: "Hannah Taylor",
    rollNo: "2021008",
    email: "hannah.taylor@university.edu",
  },
  {
    id: "9",
    name: "Ian Rodriguez",
    rollNo: "2021009",
    email: "ian.rodriguez@university.edu",
  },
  {
    id: "10",
    name: "Julia Chen",
    rollNo: "2021010",
    email: "julia.chen@university.edu",
  },
];

// Mock historical attendance data
const mockHistoricalAttendance: Record<string, Record<string, boolean>> = {
  "2024-01-15": {
    "1": true,
    "2": false,
    "3": true,
    "4": true,
    "5": false,
    "6": true,
    "7": true,
    "8": false,
    "9": true,
    "10": true,
  },
  "2024-01-16": {
    "1": true,
    "2": true,
    "3": false,
    "4": true,
    "5": true,
    "6": false,
    "7": true,
    "8": true,
    "9": false,
    "10": true,
  },
  "2024-01-17": {
    "1": false,
    "2": true,
    "3": true,
    "4": true,
    "5": true,
    "6": true,
    "7": false,
    "8": true,
    "9": true,
    "10": false,
  },
};

export default function AttendanceForTeacherPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowAttendance(false);
    setAttendance({});
  };

  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemester(semesterId);
    setShowAttendance(false);
    setAttendance({});
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowAttendance(false);
      setAttendance({});
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const canEdit = isToday(selectedDate) || selectedDate > new Date();

  const loadAttendance = async () => {
    if (!selectedCourse || !selectedSemester) {
      toast.error("Selection Required", {
        description: "Please select both course and semester.",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call to load students and attendance
    setTimeout(() => {
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      const existingAttendance = mockHistoricalAttendance[dateKey];

      if (existingAttendance) {
        // Load existing attendance data
        setAttendance(existingAttendance);
        toast.success("Attendance Loaded", {
          description: `Attendance loaded for ${format(selectedDate, "PPP")}`,
        });
      } else {
        // Initialize new attendance (all absent by default)
        const initialAttendance: Record<string, boolean> = {};
        mockStudents.forEach((student) => {
          initialAttendance[student.id] = false;
        });
        setAttendance(initialAttendance);

        if (canEdit) {
          toast.success("Ready to Mark Attendance", {
            description: `Ready to mark attendance for ${format(
              selectedDate,
              "PPP"
            )}`,
          });
        } else {
          toast.info("Viewing Historical Attendance", {
            description: `Viewing attendance for ${format(
              selectedDate,
              "PPP"
            )} (Read-only)`,
          });
        }
      }

      setShowAttendance(true);
      setIsLoading(false);
    }, 1000);
  };

  const toggleAttendance = (studentId: string) => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      });
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));
  };

  const markAllPresent = () => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      });
      return;
    }

    const allPresent: Record<string, boolean> = {};
    mockStudents.forEach((student) => {
      allPresent[student.id] = true;
    });
    setAttendance(allPresent);
    toast.success("All Students Marked Present", {
      description: `All ${mockStudents.length} students marked as present`,
    });
  };

  const markAllAbsent = () => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      });
      return;
    }

    const allAbsent: Record<string, boolean> = {};
    mockStudents.forEach((student) => {
      allAbsent[student.id] = false;
    });
    setAttendance(allAbsent);
    toast.success("All Students Marked Absent", {
      description: `All ${mockStudents.length} students marked as absent`,
    });
  };

  const saveAttendance = async () => {
    if (!canEdit) {
      toast.error("Cannot Save", {
        description: "Cannot save attendance for past dates",
      });
      return;
    }

    setIsSaving(true);

    // Simulate API call to save attendance to backend
    setTimeout(() => {
      const presentCount = Object.values(attendance).filter(Boolean).length;
      const totalStudents = mockStudents.length;
      const absentCount = totalStudents - presentCount;

      // Mock backend save logic
      const attendanceData = {
        courseId: selectedCourse,
        semesterId: selectedSemester,
        date: format(selectedDate, "yyyy-MM-dd"),
        attendance: attendance,
        summary: {
          total: totalStudents,
          present: presentCount,
          absent: absentCount,
          percentage: Math.round((presentCount / totalStudents) * 100),
        },
      };

      console.log("Saving attendance to backend:", attendanceData);

      // Save to mock historical data
      const dateKey = format(selectedDate, "yyyy-MM-dd");
      mockHistoricalAttendance[dateKey] = { ...attendance };

      toast.success("Attendance Saved Successfully!", {
        description: `${presentCount}/${totalStudents} students present (${attendanceData.summary.percentage}% attendance)`,
        action: {
          label: "View Summary",
          onClick: () => console.log("View attendance summary"),
        },
      });
      setIsSaving(false);
    }, 1500);
  };

  const selectedCourseData = courses.find((c) => c.id === selectedCourse);
  const selectedSemesterData = semesters.find((s) => s.id === selectedSemester);
  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalStudents = mockStudents.length;
  const attendancePercentage =
    totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Management
            </h1>
            <p className="text-muted-foreground">
              Mark and manage student attendance efficiently
            </p>
          </div>
        </div>

        {/* Course, Semester and Date Selection */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Select Course, Semester & Date</span>
            </CardTitle>
            <CardDescription>
              Choose the course, semester, and date to view and manage
              attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Course
                </label>
                <Select
                  value={selectedCourse}
                  onValueChange={handleCourseSelect}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{course.code}</span>
                          <span className="text-sm text-muted-foreground">
                            {course.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Semester
                </label>
                <Select
                  value={selectedSemester}
                  onValueChange={handleSemesterSelect}
                >
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-11 w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date Status Indicator */}
            <div className="flex items-center space-x-2">
              {isPastDate(selectedDate) ? (
                <Badge
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <Lock className="h-3 w-3" />
                  <span>Past Date - View Only</span>
                </Badge>
              ) : isToday(selectedDate) ? (
                <Badge
                  variant="default"
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Today - Can Edit</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <Edit className="h-3 w-3" />
                  <span>Future Date - Can Edit</span>
                </Badge>
              )}
            </div>

            <Button
              onClick={loadAttendance}
              disabled={!selectedCourse || !selectedSemester || isLoading}
              className="w-full md:w-auto h-11 px-8"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  {canEdit ? (
                    <CalendarDays className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {canEdit ? "Load Attendance" : "View Attendance"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Section */}
        {showAttendance && (
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Attendance - {selectedCourseData?.code}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedCourseData?.name} • {selectedSemesterData?.name} •{" "}
                    {format(selectedDate, "PPP")}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Present: {presentCount}/{totalStudents}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    {attendancePercentage}% Attendance
                  </Badge>
                  {isPastDate(selectedDate) && (
                    <Badge variant="destructive" className="px-3 py-1">
                      <Lock className="h-3 w-3 mr-1" />
                      Read Only
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Actions - Only show if can edit */}
              {canEdit && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllPresent}
                    className="h-9 bg-transparent"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Present
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAbsent}
                    className="h-9 bg-transparent"
                  >
                    Mark All Absent
                  </Button>
                </div>
              )}

              {/* Attendance Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16 text-center">
                        {canEdit ? "Present" : "Status"}
                      </TableHead>
                      <TableHead className="w-24">Roll No</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Email
                      </TableHead>
                      <TableHead className="w-24 text-center">
                        Attendance
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.map((student, index) => (
                      <TableRow
                        key={student.id}
                        className={index % 2 === 0 ? "bg-muted/25" : ""}
                      >
                        <TableCell className="text-center">
                          {canEdit ? (
                            <Checkbox
                              checked={attendance[student.id] || false}
                              onCheckedChange={() =>
                                toggleAttendance(student.id)
                              }
                              className="h-5 w-5"
                            />
                          ) : (
                            <div className="flex justify-center">
                              {attendance[student.id] ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.rollNo}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              attendance[student.id] ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {attendance[student.id] ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary and Save */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Summary:</span> {presentCount}{" "}
                  present, {totalStudents - presentCount} absent out of{" "}
                  {totalStudents} students
                  {!canEdit && (
                    <span className="ml-2 text-amber-600">
                      (Historical Record)
                    </span>
                  )}
                </div>
                {canEdit && (
                  <Button
                    onClick={saveAttendance}
                    disabled={isSaving}
                    size="lg"
                    className="h-11 px-8"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Attendance
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
