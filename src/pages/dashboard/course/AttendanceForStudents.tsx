
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle, XCircle, Eye, Lock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { useAuth } from "@/provider/AuthProvider"
import { axiosClient } from "@/lib/apiClient"

interface Course {
  _id: string
  name: string
  code: string
  credit: number
  depart: string
  prerequisiteCourse: string[]
}

interface AttendanceRecord {
  date: string
  present: boolean
}

interface User {
  _id: string
  role: string
}

interface AuthContextType {
  user: User | null
}

export default function StudentAttendancePage() {
  const { user } = useAuth() as AuthContextType
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [showAttendance, setShowAttendance] = useState(false)
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false)

  // Fetch registered courses on component mount
  useEffect(() => {
    if (user?._id) {
      fetchRegisteredCourses()
    }
  }, [user])

  const fetchRegisteredCourses = async () => {
    try {
      setIsLoadingCourses(true)
      const response = await axiosClient.get(`/course-registered/myRegisteredCourses/${user?._id}`)

      if (response.data.success && response.data.data.length > 0) {
        setCourses(response.data.data[0].courseList)
      } else {
        setCourses([])
        toast.error("No registered courses found")
      }
    } catch (error: unknown) {
      console.error("Error fetching courses:", error)
      toast.error("Failed to load your courses")
      setCourses([])
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const fetchAttendanceData = async (courseId: string) => {
    try {
      setIsLoadingAttendance(true)
      const response = await axiosClient.get(`/attendance/my-attendance?userId=${user?._id}&courseId=${courseId}`)

      // Sort attendance records by date (newest first)
      const sortedRecords = response.data.sort(
        (a: AttendanceRecord, b: AttendanceRecord) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )

      setAttendanceRecords(sortedRecords)
      setShowAttendance(true)

      const selectedCourseData = courses.find((c) => c._id === courseId)
      toast.success("Attendance Loaded", {
        description: `Your attendance records for ${selectedCourseData?.code} are ready.`,
      })
    } catch (error: unknown) {
      console.error("Error fetching attendance:", error)
      toast.error("Failed to load attendance data")
      setAttendanceRecords([])
      setShowAttendance(false)
    } finally {
      setIsLoadingAttendance(false)
    }
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(courseId)
    setShowAttendance(false)
    setAttendanceRecords([])
  }

  const loadMyAttendanceData = async () => {
    if (!selectedCourse) {
      toast.error("Selection Required", {
        description: "Please select a course.",
      })
      return
    }

    await fetchAttendanceData(selectedCourse)
  }

  const selectedCourseData = courses.find((c) => c._id === selectedCourse)

  const presentCount = attendanceRecords.filter((record) => record.present).length
  const totalDays = attendanceRecords.length
  const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0

  if (isLoadingCourses) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading your courses...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Course Selection */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>My Attendance Records</span>
            </CardTitle>
            <CardDescription>Select a course to view your attendance history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 w-full">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Course
              </label>
              <Select value={selectedCourse} onValueChange={handleCourseSelect}>
                <SelectTrigger className="h-11 w-full">
                  <SelectValue placeholder="Choose your course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.code.toUpperCase()} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Read-only indicator */}
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Lock className="h-3 w-3" />
                <span>View Only - No Editing</span>
              </Badge>
            </div>

            <Button
              onClick={loadMyAttendanceData}
              disabled={!selectedCourse || isLoadingAttendance}
              className="w-full md:w-auto h-11 px-8"
              size="lg"
            >
              {isLoadingAttendance ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading Attendance...
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

        {/* Attendance Table */}
        {showAttendance && selectedCourseData && (
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Attendance History - {selectedCourseData.code.toUpperCase()}</span>
                  </CardTitle>
                  <CardDescription className="mt-1 capitalize">
                    {selectedCourseData.name} • {selectedCourseData.credit} Credits •{" "}
                    {selectedCourseData.depart.toUpperCase()} Department
                  </CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">
                    Present: {presentCount}/{totalDays}
                  </Badge>
                  <Badge
                    variant={
                      attendancePercentage >= 75 ? "default" : attendancePercentage >= 60 ? "secondary" : "destructive"
                    }
                    className="px-3 py-1"
                  >
                    {attendancePercentage}% Attendance
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
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.length > 0 ? (
                      attendanceRecords.map((record, index) => (
                        <TableRow key={record.date} className={index % 2 === 0 ? "bg-muted/25" : ""}>
                          <TableCell className="font-medium">{format(new Date(record.date), "PPP")}</TableCell>
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
                        <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                          No attendance records found for this course.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {attendanceRecords.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Summary:</span> {presentCount} present, {totalDays - presentCount}{" "}
                    absent out of {totalDays} classes
                    <span className="ml-2 text-amber-600">(Historical Record)</span>
                  </div>
                  <div className="text-sm">
                    {attendancePercentage >= 75 ? (
                      <span className="text-green-600 font-medium">✓ Good Attendance</span>
                    ) : attendancePercentage >= 60 ? (
                      <span className="text-yellow-600 font-medium">⚠ Average Attendance</span>
                    ) : (
                      <span className="text-red-600 font-medium">⚠ Low Attendance</span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
