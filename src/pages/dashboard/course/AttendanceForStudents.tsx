
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, XCircle, Eye, Lock } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

// ONLY Alice Johnson's enrolled courses. No other students' courses.
const myCourses = [
  {
    id: "CS101",
    name: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith", // Teacher details for this course
    credits: 3,
    totalClasses: 45, // Total classes for this course
    attendedClasses: 38, // Alice's attended classes for this course
  },
  {
    id: "CS201",
    name: "Data Structures and Algorithms",
    code: "CS201",
    instructor: "Dr. Johnson", // Teacher details for this course
    credits: 4,
    totalClasses: 50,
    attendedClasses: 42, // Alice's attended classes for this course
  },
  {
    id: "CS301",
    name: "Database Management Systems",
    code: "CS301",
    instructor: "Dr. Brown", // Teacher details for this course
    credits: 3,
    totalClasses: 40,
    attendedClasses: 35, // Alice's attended classes for this course
  },
]

const semesters = [
  { id: "fall2024", name: "Fall 2024" },
  { id: "spring2024", name: "Spring 2024" },
  { id: "summer2024", name: "Summer 2024" },
]

// ONLY Alice Johnson's detailed attendance records (read-only). No other students' records.
const myDetailedAttendanceRecords: Record<string, Record<string, { present: boolean; remarks?: string }>> = {
  CS101: {
    "2024-01-15": { present: true },
    "2024-01-16": { present: false, remarks: "Medical appointment" },
    "2024-01-17": { present: true },
    "2024-01-18": { present: true },
    "2024-01-19": { present: false, remarks: "Family emergency" },
    "2024-01-22": { present: true },
    "2024-01-23": { present: true },
    "2024-01-24": { present: false },
    "2024-01-25": { present: true },
    "2024-01-26": { present: true },
  },
  CS201: {
    "2024-01-15": { present: true },
    "2024-01-16": { present: true },
    "2024-01-17": { present: false, remarks: "Sick" },
    "2024-01-18": { present: true },
    "2024-01-19": { present: true },
    "2024-01-22": { present: false },
    "2024-01-23": { present: true },
    "2024-01-24": { present: true },
    "2024-01-25": { present: true },
    "2024-01-26": { present: false },
  },
  CS301: {
    "2024-01-15": { present: true },
    "2024-01-16": { present: true },
    "2024-01-17": { present: true },
    "2024-01-18": { present: true },
    "2024-01-19": { present: true },
    "2024-01-22": { present: true },
    "2024-01-23": { present: true },
    "2024-01-24": { present: true },
    "2024-01-25": { present: true },
    "2024-01-26": { present: true },
  },
}

export default function AttendanceForStudentsPage() {
  const [selectedCourse, setSelectedCourse] = useState("") // No default selection
  const [selectedSemester, setSelectedSemester] = useState("") // No default selection
  const [showAttendance, setShowAttendance] = useState(false) // Hide table initially
  const [isLoading, setIsLoading] = useState(false)

  // --- IMPORTANT: STUDENT CANNOT EDIT ATTENDANCE ---
  // There are NO states or functions in this file that allow a student to modify their attendance.
  // You will NOT find:
  // - `isSaving` state
  // - `toggleMyAttendance` function
  // - `updateMyRemarks` function
  // - `markAllPresent` function
  // - `saveMyAttendance` function
  // The UI elements (checkboxes, textareas, buttons) that would enable editing are also ABSENT or read-only.

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    setShowAttendance(false) // Hide table until 'View Attendance' is clicked again
  }

  const handleSemesterSelect = (semesterId: string) => {
    setSelectedSemester(semesterId)
    setShowAttendance(false) // Hide table until 'View Attendance' is clicked again
  }

  const loadMyAttendanceData = async () => {
    if (!selectedCourse || !selectedSemester) {
      toast.error("Selection Required", {
        description: "Please select both course and semester.",
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      // In a real app, this would fetch the student's attendance for the selected course/semester
      setShowAttendance(true) // Show the table after loading
      setIsLoading(false)
      toast.success("Your Attendance Loaded", {
        description: `Your attendance records for ${myCourses.find((c) => c.id === selectedCourse)?.code} are ready.`,
      })
    }, 800)
  }

  const selectedCourseData = myCourses.find((c) => c.id === selectedCourse)

  // Get all attendance records for the selected course, no date filtering
  const allAttendanceRecords = selectedCourseData
    ? Object.entries(myDetailedAttendanceRecords[selectedCourseData.id] || {}).sort(
        ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
      )
    : []

  const presentCount = allAttendanceRecords.filter(([, record]) => record.present).length
  const totalDays = allAttendanceRecords.length
  const myAttendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* --- FILTERING BY COURSE AND SEMESTER --- */}
        {/* This card contains the dropdowns for selecting course and semester. */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Select Course & Semester</span>
            </CardTitle>
            <CardDescription>Choose your course and semester to view your attendance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  My Course
                </label>
                <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                  <SelectContent>
                    {myCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{course.code}</span>
                          <span className="text-sm text-muted-foreground">{course.name}</span>
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
                <Select value={selectedSemester} onValueChange={handleSemesterSelect}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{semester.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Status Indicator - Always Read Only for students */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>View Only - No Editing</span>
              </Badge>
            </div>

            <Button
              onClick={loadMyAttendanceData}
              disabled={!selectedCourse || !selectedSemester || isLoading}
              className="w-full md:w-auto h-11 px-8"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Loading My Data...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  View My Attendance
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* My Detailed Attendance Table (Read-Only) */}
        {showAttendance && selectedCourseData && (
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>My Detailed Attendance - {selectedCourseData.code}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedCourseData.name} • {selectedCourseData.instructor}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Present: {presentCount}/{totalDays}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1">
                    {myAttendancePercentage}% Attendance
                  </Badge>
                  <Badge variant="destructive" className="px-3 py-1">
                    <Lock className="h-3 w-3 mr-1" />
                    Read Only
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Teacher</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allAttendanceRecords.length > 0 ? (
                      allAttendanceRecords.map(([date, record], index) => (
                        <TableRow key={date} className={index % 2 === 0 ? "bg-muted/25" : ""}>
                          <TableCell className="font-medium">{selectedCourseData.instructor}</TableCell>
                          <TableCell className="font-medium">{format(new Date(date), "PPP")}</TableCell>
                          {/* Centering the badge within the cell */}
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {record.present ? (
                                <Badge variant="default" className="flex items-center justify-center w-20">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Present
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="flex items-center justify-center w-20">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Absent
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                          No attendance records found for the selected course and semester.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Summary:</span> {presentCount} present, {totalDays - presentCount}{" "}
                  absent out of {totalDays} records
                  <span className="ml-2 text-amber-600">(Historical Record)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
