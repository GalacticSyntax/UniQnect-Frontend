"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarDays, Users, BookOpen, Save, CheckCircle, CalendarIcon, Eye, Edit, Lock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { axiosClient } from "@/lib/apiClient"
import { useAuth } from "@/provider/AuthProvider"

// Types
interface User {
  _id: string
  fullName: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
}

interface SessionData {
  _id: string
  running: string
  previous?: string
  createdAt: string
  updatedAt: string
}

interface CourseData {
  _id: string
  courseId: {
    _id: string
    name: string
    code: string
    credit: number
    depart: string
  }
  runningSession: string
  courseAdvisor: {
    _id: string
    departmentCode: string
    session: string
    semester: string
  }
  teacherId: {
    _id: string
    teacherId: string
    designation: string
  }
}

interface StudentData {
  _id: string
  studentId: {
    _id: string
    studentId: string
    userId: {
      _id: string
      fullName: string
      email: string
      phone: string
      gender: string
      image?: string
    }
    departmentId: {
      _id: string
      name: string
      code: string
    }
    admittedAt: string
  }
  courseList: string[]
  runningSession: string
}

interface AttendanceData {
  _id: string
  courseId: string
  date: string
  runningSession: string
  studentList: Array<{
    studentId: string
    present: boolean
  }>
}

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

export default function AttendanceForTeacherPageWithAPI() {
  const { user } = useAuth() as AuthContextType
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [courses, setCourses] = useState<CourseData[]>([])
  const [students, setStudents] = useState<StudentData[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showAttendance, setShowAttendance] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isLoadingCourses, setIsLoadingCourses] = useState(false)

  // Fetch session data on component mount
  useEffect(() => {
    fetchSessionData()
  }, [])

  // Fetch teacher's courses when session data is available
  useEffect(() => {
    if (sessionData && user?._id) {
      fetchTeacherCourses()
    }
  }, [sessionData, user])

  const fetchSessionData = async (): Promise<void> => {
    try {
      setIsLoadingSession(true)
      const response = await axiosClient.get<{ success: boolean; data: SessionData }>("/session")
      if (response.data.success) {
        setSessionData(response.data.data)
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error fetching session:", apiError)
      toast.error("Failed to fetch session data")
    } finally {
      setIsLoadingSession(false)
    }
  }

  const fetchTeacherCourses = async (): Promise<void> => {
    try {
      setIsLoadingCourses(true)
      const response = await axiosClient.get<{ success: boolean; data: CourseData[] }>(
        `/course-offered/teacher/my-courses/${user?._id}`,
      )
      if (response.data.success) {
        const runningSessionCourses = response.data.data.filter(
          (course) => course.runningSession.toLowerCase() === sessionData?.running.toLowerCase(),
        )
        setCourses(runningSessionCourses)
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error fetching courses:", apiError)
      toast.error("Failed to fetch courses")
    } finally {
      setIsLoadingCourses(false)
    }
  }

  const fetchStudentsForCourse = async (courseId: string): Promise<void> => {
    try {
      const response = await axiosClient.post<{ success: boolean; data: StudentData[] }>(
        "/course-registered/registered-students",
        {
          courseId,
          session: sessionData?.running.toLowerCase(),
        },
      )
      if (response.data.success) {
        const filteredStudents = response.data.data.filter(
          (student) => student.runningSession.toLowerCase() === sessionData?.running.toLowerCase(),
        )
        setStudents(filteredStudents)
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error fetching students:", apiError)
      toast.error("Failed to fetch students")
      setStudents([])
    }
  }

  const fetchAttendanceForDate = async (courseId: string, date: string): Promise<boolean> => {
    try {
      const response = await axiosClient.get<{
        message: string
        data: AttendanceData
      }>("/attendance/attendanceBydate", {
        params: { courseId, date },
      })

      if (response.data.message && response.data.data) {
        const attendanceRecord = response.data.data
        const attendanceMap: Record<string, boolean> = {}

        students.forEach((student) => {
          attendanceMap[student.studentId._id] = false
        })

        if (attendanceRecord.studentList && attendanceRecord.studentList.length > 0) {
          attendanceRecord.studentList.forEach((attendance) => {
            attendanceMap[attendance.studentId] = attendance.present
          })
        }

        setAttendance(attendanceMap)
        return true
      } else {
        const initialAttendance: Record<string, boolean> = {}
        students.forEach((student) => {
          initialAttendance[student.studentId._id] = false
        })
        setAttendance(initialAttendance)
        return false
      }
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error fetching attendance:", apiError)
      const initialAttendance: Record<string, boolean> = {}
      students.forEach((student) => {
        initialAttendance[student.studentId._id] = false
      })
      setAttendance(initialAttendance)
      return false
    }
  }

  const handleCourseSelect = (courseId: string): void => {
    setSelectedCourse(courseId)
    setShowAttendance(false)
    setAttendance({})
    setStudents([])
  }

  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      setSelectedDate(date)
      setShowAttendance(false)
      setAttendance({})
    }
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPastDate = (date: Date): boolean => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    return compareDate < today
  }

  const canEdit: boolean = isToday(selectedDate) || selectedDate > new Date()

  const loadAttendance = async (): Promise<void> => {
    if (!selectedCourse || !sessionData) {
      toast.error("Selection Required", {
        description: "Please select a course.",
      })
      return
    }

    setIsLoading(true)

    try {
      await fetchStudentsForCourse(selectedCourse)

      setTimeout(async () => {
        const dateString = format(selectedDate, "yyyy-MM-dd")
        const hasExistingAttendance = await fetchAttendanceForDate(selectedCourse, dateString)

        if (hasExistingAttendance) {
          toast.success("Attendance Loaded", {
            description: `Attendance loaded for ${format(selectedDate, "PPP")}`,
          })
        } else {
          if (canEdit) {
            toast.success("Ready to Mark Attendance", {
              description: `Ready to mark attendance for ${format(selectedDate, "PPP")}`,
            })
          } else {
            toast.info("No Previous Attendance", {
              description: `No attendance record found for ${format(selectedDate, "PPP")}`,
            })
          }
        }

        setShowAttendance(true)
        setIsLoading(false)
      }, 500)
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error loading attendance:", apiError)
      toast.error("Failed to load attendance data")
      setIsLoading(false)
    }
  }

  const toggleAttendance = (studentId: string): void => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      })
      return
    }

    setAttendance((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }))
  }

  const markAllPresent = (): void => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      })
      return
    }

    const allPresent: Record<string, boolean> = {}
    students.forEach((student) => {
      allPresent[student.studentId._id] = true
    })
    setAttendance(allPresent)
    toast.success("All Students Marked Present", {
      description: `All ${students.length} students marked as present`,
    })
  }

  const markAllAbsent = (): void => {
    if (!canEdit) {
      toast.error("Cannot Edit", {
        description: "Cannot edit attendance for past dates",
      })
      return
    }

    const allAbsent: Record<string, boolean> = {}
    students.forEach((student) => {
      allAbsent[student.studentId._id] = false
    })
    setAttendance(allAbsent)
    toast.success("All Students Marked Absent", {
      description: `All ${students.length} students marked as absent`,
    })
  }

  const saveAttendance = async (): Promise<void> => {
    if (!canEdit) {
      toast.error("Cannot Save", {
        description: "Cannot save attendance for past dates",
      })
      return
    }

    setIsSaving(true)

    try {
      const dateString = format(selectedDate, "yyyy-MM-dd")

      const studentList = students.map((student) => ({
        studentId: student.studentId._id,
        present: attendance[student.studentId._id] || false,
      }))

      const payload = {
        courseId: selectedCourse,
        date: dateString,
        studentList: studentList,
      }

      await axiosClient.patch("/attendance/attendance", payload)

      const presentCount = studentList.filter((s) => s.present).length
      const totalStudents = students.length
      const attendancePercentage = Math.round((presentCount / totalStudents) * 100)

      toast.success("Attendance Saved Successfully!", {
        description: `${presentCount}/${totalStudents} students present (${attendancePercentage}% attendance)`,
      })
    } catch (error) {
      const apiError = error as ApiError
      console.error("Error saving attendance:", apiError)
      toast.error("Failed to save attendance")
    } finally {
      setIsSaving(false)
    }
  }

  const selectedCourseData = courses.find((c) => c.courseId._id === selectedCourse)
  const presentCount = Object.values(attendance).filter(Boolean).length
  const totalStudents = students.length
  const attendancePercentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>Loading session data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
            <p className="text-muted-foreground">
              Mark and manage student attendance for {sessionData?.running} session
            </p>
          </div>
        </div>

        {/* Course and Date Selection */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Select Course & Date</span>
            </CardTitle>
            <CardDescription>
              Choose the course and date to view and manage attendance for {sessionData?.running} session
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Course ({sessionData?.running})
                </label>
                <Select value={selectedCourse} onValueChange={handleCourseSelect} disabled={isLoadingCourses}>
                  <SelectTrigger className="h-11 w-full">
                    <SelectValue placeholder={isLoadingCourses ? "Loading courses..." : "Select a course"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course.courseId._id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{course.courseId.code.toUpperCase()}</span>
                          <span className="text-sm text-muted-foreground">{course.courseId.name}</span>
                        </div>
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
                        !selectedDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Date Status Indicator */}
            <div className="flex items-center space-x-2">
              {isPastDate(selectedDate) ? (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Lock className="h-3 w-3" />
                  <span>Past Date - View Only</span>
                </Badge>
              ) : isToday(selectedDate) ? (
                <Badge variant="default" className="flex items-center space-x-1">
                  <Edit className="h-3 w-3" />
                  <span>Today - Can Edit</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Edit className="h-3 w-3" />
                  <span>Future Date - Can Edit</span>
                </Badge>
              )}
            </div>

            <Button
              onClick={loadAttendance}
              disabled={!selectedCourse || !sessionData || isLoading}
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
                  {canEdit ? <CalendarDays className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
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
                    <span>Attendance - {selectedCourseData?.courseId.code.toUpperCase()}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {selectedCourseData?.courseId.name} • {sessionData?.running} • {format(selectedDate, "PPP")}
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
              {canEdit && (
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" onClick={markAllPresent} className="h-9 bg-transparent">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={markAllAbsent} className="h-9 bg-transparent">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark All Absent
                  </Button>
                </div>
              )}

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16 text-center">{canEdit ? "Present" : "Status"}</TableHead>
                      <TableHead className="w-24">Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Department</TableHead>
                      <TableHead className="w-24 text-center">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.studentId._id} className={index % 2 === 0 ? "bg-muted/25" : ""}>
                        <TableCell className="text-center">
                          {canEdit ? (
                            <Checkbox
                              checked={attendance[student.studentId._id] || false}
                              onCheckedChange={() => toggleAttendance(student.studentId._id)}
                              className="h-5 w-5"
                            />
                          ) : (
                            <div className="flex justify-center">
                              {attendance[student.studentId._id] ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{student.studentId.studentId}</TableCell>
                        <TableCell className="font-medium">{student.studentId.userId.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                          {student.studentId.userId.email}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                          {student.studentId.departmentId.code.toUpperCase()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={attendance[student.studentId._id] ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {attendance[student.studentId._id] ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Summary:</span> {presentCount} present, {totalStudents - presentCount}{" "}
                  absent out of {totalStudents} students
                  {!canEdit && <span className="ml-2 text-amber-600">(Historical Record)</span>}
                </div>
                {canEdit && (
                  <Button onClick={saveAttendance} disabled={isSaving} size="lg" className="h-11 px-8">
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
  )
}
