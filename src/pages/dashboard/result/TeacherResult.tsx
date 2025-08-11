"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface Result {
  id: number
  studentName: string
  studentId: string
  courseName: string
  courseId: string
  credit: number
  midMarks: number
  finalMarks: number
  assignmentMarks: number
  attendanceMarks: number
  totalMarks: number
}

interface EditForm {
  midMarks: string
  finalMarks: string
  assignmentMarks: string
}

// Dummy data
const dummyResults: Result[] = [
  {
    id: 1,
    studentName: "John Doe",
    studentId: "CSE2101001",
    courseName: "Data Structures",
    courseId: "CSE201",
    credit: 3,
    midMarks: 25,
    finalMarks: 35,
    assignmentMarks: 18,
    attendanceMarks: 10,
    totalMarks: 88,
  },
  {
    id: 2,
    studentName: "Jane Smith",
    studentId: "CSE2101002",
    courseName: "Database Management",
    courseId: "CSE301",
    credit: 3,
    midMarks: 28,
    finalMarks: 38,
    assignmentMarks: 19,
    attendanceMarks: 10,
    totalMarks: 95,
  },
  {
    id: 3,
    studentName: "Mike Johnson",
    studentId: "CSE2101003",
    courseName: "Data Structures",
    courseId: "CSE201",
    credit: 3,
    midMarks: 22,
    finalMarks: 32,
    assignmentMarks: 16,
    attendanceMarks: 10,
    totalMarks: 80,
  },
  {
    id: 4,
    studentName: "Sarah Wilson",
    studentId: "CSE2101004",
    courseName: "Operating Systems",
    courseId: "CSE401",
    credit: 3,
    midMarks: 27,
    finalMarks: 36,
    assignmentMarks: 17,
    attendanceMarks: 10,
    totalMarks: 90,
  },
  {
    id: 5,
    studentName: "David Brown",
    studentId: "CSE2101005",
    courseName: "Database Management",
    courseId: "CSE301",
    credit: 3,
    midMarks: 24,
    finalMarks: 34,
    assignmentMarks: 15,
    attendanceMarks: 10,
    totalMarks: 83,
  },
  {
    id: 6,
    studentName: "Emily Davis",
    studentId: "CSE2101006",
    courseName: "Computer Networks",
    courseId: "CSE501",
    credit: 3,
    midMarks: 26,
    finalMarks: 37,
    assignmentMarks: 18,
    attendanceMarks: 10,
    totalMarks: 91,
  },
  {
    id: 7,
    studentName: "Alex Miller",
    studentId: "CSE2101007",
    courseName: "Operating Systems",
    courseId: "CSE401",
    credit: 3,
    midMarks: 23,
    finalMarks: 33,
    assignmentMarks: 16,
    attendanceMarks: 10,
    totalMarks: 82,
  },
  {
    id: 8,
    studentName: "Lisa Garcia",
    studentId: "CSE2101008",
    courseName: "Computer Networks",
    courseId: "CSE501",
    credit: 3,
    midMarks: 29,
    finalMarks: 39,
    assignmentMarks: 20,
    attendanceMarks: 10,
    totalMarks: 98,
  },
]

export default function TeacherResult() {
  const [results, setResults] = useState<Result[]>(dummyResults)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [courseFilter, setCourseFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [editingResult, setEditingResult] = useState<Result | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    midMarks: "",
    finalMarks: "",
    assignmentMarks: "",
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const itemsPerPage = 5

  // Get unique courses for filter
  const uniqueCourses = [...new Set(results.map((result) => result.courseName))]

  // Filter and search results
  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      const matchesSearch =
        result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.courseId.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCourse = courseFilter === "all" || result.courseName === courseFilter

      return matchesSearch && matchesCourse
    })
  }, [results, searchTerm, courseFilter])

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (result: Result) => {
    setEditingResult(result)
    setEditForm({
      midMarks: result.midMarks.toString(),
      finalMarks: result.finalMarks.toString(),
      assignmentMarks: result.assignmentMarks.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateResult = async () => {
    if (!editingResult) return

    // Validate marks
    const midMarks = Number.parseInt(editForm.midMarks)
    const finalMarks = Number.parseInt(editForm.finalMarks)
    const assignmentMarks = Number.parseInt(editForm.assignmentMarks)

    if (midMarks < 0 || midMarks > 30) {
      toast.error("Mid marks must be between 0 and 30")
      return
    }
    if (finalMarks < 0 || finalMarks > 40) {
      toast.error("Final marks must be between 0 and 40")
      return
    }
    if (assignmentMarks < 0 || assignmentMarks > 20) {
      toast.error("Assignment marks must be between 0 and 20")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedResults = results.map((result) => {
        if (result.id === editingResult.id) {
          const totalMarks = midMarks + finalMarks + assignmentMarks + 10 // 10 for attendance
          return {
            ...result,
            midMarks,
            finalMarks,
            assignmentMarks,
            totalMarks,
          }
        }
        return result
      })

      setResults(updatedResults)
      setIsEditDialogOpen(false)
      setEditingResult(null)
      toast.success("Result updated successfully!")
    } catch {
      toast.error("Failed to update result")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (resultId: number) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedResults = results.filter((result) => result.id !== resultId)
      setResults(updatedResults)
      toast.success("Result deleted successfully!")
    } catch {
      toast.error("Failed to delete result")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Results Management</h1>
          <p className="mt-2 text-gray-600">View, search, and manage student results</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Results</CardTitle>
            <CardDescription>
              Manage and update student marks. Attendance marks (10) are automatically calculated.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by student, course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="course-filter">Filter by Course:</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Credit</TableHead>
                    <TableHead>Mid (30)</TableHead>
                    <TableHead>Final (40)</TableHead>
                    <TableHead>Assignment (20)</TableHead>
                    <TableHead>Attendance (10)</TableHead>
                    <TableHead>Total (100)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.studentName}</TableCell>
                        <TableCell>{result.studentId}</TableCell>
                        <TableCell>{result.courseName}</TableCell>
                        <TableCell>{result.courseId}</TableCell>
                        <TableCell>{result.credit}</TableCell>
                        <TableCell>{result.midMarks}</TableCell>
                        <TableCell>{result.finalMarks}</TableCell>
                        <TableCell>{result.assignmentMarks}</TableCell>
                        <TableCell>{result.attendanceMarks}</TableCell>
                        <TableCell className="font-semibold">{result.totalMarks}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(result)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Result</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this result for {result.studentName}? This action
                                    cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(result.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredResults.length)} of{" "}
                  {filteredResults.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Result</DialogTitle>
              <DialogDescription>
                Update marks for {editingResult?.studentName}. Attendance marks are automatically calculated.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="mid-marks" className="text-right">
                  Mid Marks (30)
                </Label>
                <Input
                  id="mid-marks"
                  type="number"
                  min="0"
                  max="30"
                  value={editForm.midMarks}
                  onChange={(e) => setEditForm({ ...editForm, midMarks: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="final-marks" className="text-right">
                  Final Marks (40)
                </Label>
                <Input
                  id="final-marks"
                  type="number"
                  min="0"
                  max="40"
                  value={editForm.finalMarks}
                  onChange={(e) => setEditForm({ ...editForm, finalMarks: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignment-marks" className="text-right">
                  Assignment (20)
                </Label>
                <Input
                  id="assignment-marks"
                  type="number"
                  min="0"
                  max="20"
                  value={editForm.assignmentMarks}
                  onChange={(e) => setEditForm({ ...editForm, assignmentMarks: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Total</Label>
                <div className="col-span-3 text-lg font-semibold">
                  {(Number.parseInt(editForm.midMarks) || 0) +
                    (Number.parseInt(editForm.finalMarks) || 0) +
                    (Number.parseInt(editForm.assignmentMarks) || 0) +
                    10}{" "}
                  / 100
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateResult} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Result"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
