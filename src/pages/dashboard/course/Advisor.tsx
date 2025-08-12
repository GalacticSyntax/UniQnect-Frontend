
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, UserCheck, Edit, Trash2, Plus, X } from "lucide-react"
import { useAuth } from "@/provider/AuthProvider"
import { toast } from "sonner"
import axios from "axios"
import PrivateRoute from "@/components/PrivateRoute"
import { axiosClient } from "@/lib/apiClient"
import { Link } from "react-router"

// Types
interface Teacher {
  _id: string
  userId: {
    _id: string
    fullName: string
    email: string
    password?: string
    isVerified: boolean
    role: string
    phone: string
    gender: string
    createdAt: string
    updatedAt: string
    image: string
  }
  teacherId: string
  designation: string
  joinedAt: string
  departmentId: string
  createdAt: string
  updatedAt: string
}

interface Advisor {
  _id: string
  departmentCode: string
  session: string
  semester: number
  teacherId: Teacher
  offeredCourses: unknown[]
  createdAt: string
  updatedAt: string
}

interface EditingAdvisor {
  _id: string
  departmentCode: string
  session: string
  semester: number
  teacherId: string
}

interface AdvisorFilters {
  departmentCode?: string
  session?: string
  semester?: number
  teacherName?: string
}

const ITEMS_PER_PAGE = 5

export default function AdvisorManagementUpdated() {
  const { user } = useAuth()
  // State
  const [advisors, setAdvisors] = useState<Advisor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<AdvisorFilters>({})
  const [editingAdvisor, setEditingAdvisor] = useState<EditingAdvisor | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [isDepartmentHead, setIsDepartmentHead] = useState(false)
  const [checkingDeptHead, setCheckingDeptHead] = useState(true)

  const checkDepartmentHeadStatus = async () => {
    if (!user?._id) {
      setCheckingDeptHead(false)
      return
    }

    try {
      const response = await axiosClient.get("/department-head/is-department-head", {
        params: { userId: user._id },
      })

      if (response.data.success) {
        setIsDepartmentHead(response.data.isDepartmentHead)
      }
    } catch (err) {
      console.error("Error checking department head status:", err)
      setIsDepartmentHead(false)
    } finally {
      setCheckingDeptHead(false)
    }
  }

  useEffect(() => {
    checkDepartmentHeadStatus()
  }, [user?._id])

  // Fetch advisors function
  const fetchAdvisors = async (filterParams: AdvisorFilters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const serverFilterParams = {
        department: filterParams.departmentCode,
        session: filterParams.session,
        semester: filterParams.semester,
      }

      const response = await axiosClient.get("/course-advisor/advisors", {
        params: serverFilterParams,
      })

      if (response.data.success) {
        setAdvisors(response.data.data)
      } else {
        setError("Failed to fetch advisors")
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err?.response?.data?.message || "Failed to fetch advisors")
        toast.error("Error occurred", {
          description: err?.response?.data?.message || "Something went wrong",
        })
      } else {
        setError("Failed to fetch advisors")
        toast.error("Error occurred", {
          description: "Something went wrong",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvisors(filters)
  }, [filters])

  const handleFilterChange = (key: keyof AdvisorFilters, value: string | number) => {
    const newFilters = {
      ...filters,
      [key]: value === "" ? undefined : value,
    }
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchAdvisors(filters)
  }

  const handleClear = () => {
    setFilters({})
    setCurrentPage(1)
    fetchAdvisors({})
  }

  const handleEditAdvisor = (advisor: Advisor) => {
    setEditingAdvisor({
      _id: advisor._id,
      departmentCode: advisor.departmentCode,
      session: advisor.session,
      semester: advisor.semester,
      teacherId: advisor.teacherId.teacherId,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateAdvisor = async () => {
    if (!editingAdvisor) return

    try {
      const payload = {
        departmentCode: editingAdvisor.departmentCode,
        session: editingAdvisor.session,
        semester: editingAdvisor.semester,
        teacherId: editingAdvisor.teacherId,
      }

      await axiosClient.patch(`/course-advisor/advisor/${editingAdvisor._id}`, payload)
      toast.success("Advisor updated successfully")
      setEditDialogOpen(false)
      setEditingAdvisor(null)
      fetchAdvisors(filters)
    } catch (err) {
      toast.error("Error updating advisor", {
        description: axios.isAxiosError(err) ? err?.response?.data?.message : "Something went wrong",
      })
    }
  }

  const handleDeleteAdvisor = async (advisorId: string) => {
    if (!confirm("Are you sure you want to delete this advisor assignment?")) return

    try {
      await axiosClient.delete(`/course-advisor/advisor/${advisorId}`)
      toast.success("Advisor deleted successfully")
      fetchAdvisors(filters)
    } catch (err) {
      toast.error("Error deleting advisor", {
        description: axios.isAxiosError(err) ? err?.response?.data?.message : "Something went wrong",
      })
    }
  }

  const handleEditFormChange = (field: keyof EditingAdvisor, value: string | number) => {
    if (!editingAdvisor) return

    setEditingAdvisor((prev) => ({
      ...prev!,
      [field]: value,
    }))
  }

  const filteredAdvisors = useMemo(() => {
    return advisors.filter((advisor) => {
      const matchesTeacherName = filters.teacherName
        ? (advisor.teacherId.userId.fullName || "").toLowerCase().includes(filters.teacherName.toLowerCase())
        : true

      return matchesTeacherName
    })
  }, [advisors, filters.teacherName])

  const paginatedAdvisors = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAdvisors.slice(startIndex, endIndex)
  }, [filteredAdvisors, currentPage])

  const totalPages = Math.ceil(filteredAdvisors.length / ITEMS_PER_PAGE)

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else if (totalPages > 1) {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1 && !range.includes(totalPages)) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <PrivateRoute>
      <div className="container mx-auto py-8 space-y-6 px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Advisor Management</h1>
          <p className="text-muted-foreground">Manage and view university advisor assignments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Filter Advisors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentCode">Department Code</Label>
                <Input
                  id="departmentCode"
                  placeholder="e.g., CSE"
                  value={filters.departmentCode || ""}
                  onChange={(e) => handleFilterChange("departmentCode", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session</Label>
                <Input
                  id="session"
                  placeholder="e.g., fall-2025"
                  value={filters.session || ""}
                  onChange={(e) => handleFilterChange("session", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  placeholder="e.g., 1"
                  value={filters.semester || ""}
                  onChange={(e) => handleFilterChange("semester", Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherName">Teacher Name</Label>
                <Input
                  id="teacherName"
                  placeholder="e.g., Alice Smith"
                  value={filters.teacherName || ""}
                  onChange={(e) => handleFilterChange("teacherName", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleClear} disabled={loading}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              {!checkingDeptHead && isDepartmentHead && (
                <Link to="/dashboard/course/add-advisor">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Advisor
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Advisors ({filteredAdvisors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Loading advisors...</div>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Advisor Name</TableHead>
                      <TableHead>Teacher ID</TableHead>
                      {!checkingDeptHead && isDepartmentHead && <TableHead className="text-center">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAdvisors.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={!checkingDeptHead && isDepartmentHead ? 6 : 5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No advisors found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAdvisors.map((advisor) => (
                        <TableRow key={advisor._id}>
                          <TableCell className="font-medium">
                            <Badge variant="secondary">{advisor.departmentCode.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{advisor.session}</TableCell>
                          <TableCell>
                            <Badge variant="outline">Semester {advisor.semester}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {String(advisor.teacherId.userId.fullName || "N/A")}
                          </TableCell>
                          <TableCell className="font-mono">{advisor.teacherId.teacherId}</TableCell>
                          {!checkingDeptHead && isDepartmentHead && (
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAdvisor(advisor)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteAdvisor(advisor._id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
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

        {!loading && filteredAdvisors.length > 0 && totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Advisor
              </DialogTitle>
              <DialogDescription>Update advisor assignment information below.</DialogDescription>
            </DialogHeader>

            {editingAdvisor && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-departmentCode">Department Code</Label>
                    <Input
                      id="edit-departmentCode"
                      value={editingAdvisor.departmentCode}
                      onChange={(e) => handleEditFormChange("departmentCode", e.target.value.toLowerCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-session">Session</Label>
                    <Input
                      id="edit-session"
                      value={editingAdvisor.session}
                      onChange={(e) => handleEditFormChange("session", e.target.value.toLowerCase())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-semester">Semester</Label>
                    <Input
                      id="edit-semester"
                      type="number"
                      min="1"
                      max="12"
                      value={editingAdvisor.semester}
                      onChange={(e) => handleEditFormChange("semester", Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-teacherId">Teacher ID</Label>
                    <Input
                      id="edit-teacherId"
                      value={editingAdvisor.teacherId}
                      onChange={(e) => handleEditFormChange("teacherId", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateAdvisor}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Advisor
                  </Button>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
