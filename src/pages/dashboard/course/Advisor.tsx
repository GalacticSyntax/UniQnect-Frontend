import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, UserCheck, Edit, Trash2, Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router"; // Assuming react-router for Link and useSearchParams
import { useAuth } from "@/provider/AuthProvider";
import { toast } from "sonner";
import axios from "axios";
import SearchWithUrlSync from "@/components/SearchWithUrlSync"; // Assuming this component exists
import PrivateRoute from "@/components/PrivateRoute"; // Assuming this component exists
import UsersTableFooter from "@/components/table/TableFooter"; // Assuming this component exists

// Types
interface Teacher {
  _id: string;
  fullName: string;
  teacherId: string;
  // Add other fields if needed for display in the table or edit form
}

interface Advisor {
  _id: string;
  departmentCode: string;
  session: string;
  semester: number;
  teacherId: string; // Original ID
  teacher?: Teacher; // Populated teacher object from API
  createdAt: string;
  updatedAt: string;
}

interface AdvisorFilters {
  departmentCode?: string;
  session?: string;
  semester?: number;
  teacherName?: string; // For searching by teacher's name
}

// Axios client
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

const rowSizeList = ["5", "10", "20", "30", "50", "80", "100"];

const header = [
  { id: "departmentCode", label: "Department", sortable: true },
  { id: "session", label: "Session", sortable: true },
  { id: "semester", label: "Semester", sortable: true },
  { id: "teacher", label: "Advisor Name", sortable: true }, // Will display teacher.fullName
  { id: "teacherId", label: "Teacher ID", sortable: true },
  { id: "actions", label: "Actions", center: true }, // Admin only
];

export default function AdvisorManagement() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch advisors function
  const fetchAdvisors = async () => {
    const limit = searchParams.get("size") ?? 10;
    const page = searchParams.get("page") || 1;
    const searchTerm = searchParams.get("searchTerm"); // This will be used for teacherName
    const sort = searchParams.get("sort");

    const departmentCodeFilter =
      searchParams.get("departmentCode") || undefined;
    const sessionFilter = searchParams.get("session") || undefined;
    const semesterFilter = searchParams.get("semester")
      ? Number(searchParams.get("semester"))
      : undefined;

    setLoading(true);
    setError(null);

    try {
      let apiUrl = `/course-advisor/advisors?limit=${limit}&page=${page}`;
      if (departmentCodeFilter)
        apiUrl += `&departmentCode=${departmentCodeFilter}`;
      if (sessionFilter) apiUrl += `&session=${sessionFilter}`;
      if (semesterFilter) apiUrl += `&semester=${semesterFilter}`;
      if (searchTerm) apiUrl += `&teacherName=${searchTerm}`; // Assuming backend filters by teacherName for searchTerm
      if (sort) apiUrl += `&sort=${sort}`;

      const response = await axiosClient.get(apiUrl);
      const data = response.data;

      if (data.success) {
        setAdvisors(data.data?.result || data.data || []);
        setTotalPages(
          data.data?.meta?.totalPage ||
            Math.ceil((data.data?.length || 0) / Number(limit))
        );
      } else {
        setError("Failed to fetch advisors");
      }
    } catch (err) {
      console.error(err);
      setError(
        axios.isAxiosError(err)
          ? err?.response?.data?.message || "Failed to fetch advisors"
          : "Failed to fetch advisors"
      );
      toast.error("Error occurred", {
        description: axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load advisors when search params change
  useEffect(() => {
    fetchAdvisors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter handlers for direct input fields
  const handleFilterChange = (key: keyof AdvisorFilters, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set(key, value);
    } else {
      newSearchParams.delete(key);
    }
    // This will trigger useEffect due to searchParams change
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  };

  // Edit advisor handler
  const handleEditAdvisor = (advisor: Advisor) => {
    setEditingAdvisor({ ...advisor });
    setEditDialogOpen(true);
  };

  // Update advisor handler
  const handleUpdateAdvisor = async () => {
    if (!editingAdvisor) return;

    try {
      const payload = {
        departmentCode: editingAdvisor.departmentCode,
        session: editingAdvisor.session,
        semester: editingAdvisor.semester,
        teacherId: editingAdvisor.teacherId,
      };

      await axiosClient.put(`/advisor/advisor/${editingAdvisor._id}`, payload);
      toast.success("Advisor updated successfully");
      setEditDialogOpen(false);
      setEditingAdvisor(null);
      fetchAdvisors(); // Re-fetch to update the list
    } catch (err) {
      toast.error("Error updating advisor", {
        description: axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  // Delete advisor handler
  const handleDeleteAdvisor = async (advisorId: string) => {
    if (!confirm("Are you sure you want to delete this advisor assignment?"))
      return;

    try {
      await axiosClient.delete(`/advisor/advisor/${advisorId}`);
      toast.success("Advisor deleted successfully");
      fetchAdvisors(); // Re-fetch to update the list
    } catch (err) {
      toast.error("Error deleting advisor", {
        description: axios.isAxiosError(err)
          ? err?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  // Handle edit form changes
  const handleEditFormChange = (
    field: keyof Advisor,
    value: string | number
  ) => {
    if (!editingAdvisor) return;

    setEditingAdvisor((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  if (error) {
    return (
      <PrivateRoute>
        <div className="container mx-auto py-8">
          <div className="text-center text-red-600">Error: {error}</div>
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute>
      <section className="w-full max-w-7xl mx-auto p-5 flex flex-col gap-5">
        {/* Header */}
        <section className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Advisor Management</h1>
            <p className="text-muted-foreground">
              Manage and view university advisor assignments
            </p>
          </div>
          {user?.role === "admin" && (
            <Link to="/dashboard/course/add-advisor">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Advisor
              </Button>
            </Link>
          )}
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filter Advisors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="departmentCode">Department Code</Label>
                  <Input
                    id="departmentCode"
                    placeholder="e.g., CSE"
                    value={searchParams.get("departmentCode") || ""}
                    onChange={(e) =>
                      handleFilterChange("departmentCode", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Input
                    id="session"
                    placeholder="e.g., fall-2025"
                    value={searchParams.get("session") || ""}
                    onChange={(e) =>
                      handleFilterChange("session", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    placeholder="e.g., 1"
                    value={searchParams.get("semester") || ""}
                    onChange={(e) =>
                      handleFilterChange("semester", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <SearchWithUrlSync label="Search by Teacher Name" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Table */}
        <section className="w-full flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Advisors ({advisors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">
                    Loading advisors...
                  </div>
                </div>
              ) : (
                <div className="w-full overflow-auto">
                  <ScrollArea>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {header.map(({ id, label, center }) => (
                            <TableHead
                              key={id}
                              // TableActionHead is a custom component, using TableHead for direct compatibility
                              // If TableActionHead handles sorting, you'd use it here.
                              // For now, assuming basic TableHead.
                              className={`capitalize whitespace-nowrap ${
                                center ? "text-center" : ""
                              }`}
                            >
                              {label}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {advisors.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={header.length}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No advisors found
                            </TableCell>
                          </TableRow>
                        ) : (
                          advisors.map((advisor) => (
                            <TableRow
                              key={advisor._id}
                              className="hover:bg-gray-200/60 duration-100 transition-all"
                            >
                              <TableCell className="font-medium">
                                <Badge variant="secondary">
                                  {advisor.departmentCode.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {advisor.session}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  Semester {advisor.semester}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {advisor.teacher?.fullName || "N/A"}
                              </TableCell>
                              <TableCell className="font-mono">
                                {advisor.teacherId}
                              </TableCell>
                              {user?.role === "admin" && (
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
                                      onClick={() =>
                                        handleDeleteAdvisor(advisor._id)
                                      }
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
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>

          <UsersTableFooter rowSizeList={rowSizeList} totalPages={totalPages} />
        </section>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Advisor
              </DialogTitle>
              <DialogDescription>
                Update advisor assignment information below.
              </DialogDescription>
            </DialogHeader>

            {editingAdvisor && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-departmentCode">Department Code</Label>
                    <Input
                      id="edit-departmentCode"
                      value={editingAdvisor.departmentCode}
                      onChange={(e) =>
                        handleEditFormChange(
                          "departmentCode",
                          e.target.value.toLowerCase()
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-session">Session</Label>
                    <Input
                      id="edit-session"
                      value={editingAdvisor.session}
                      onChange={(e) =>
                        handleEditFormChange(
                          "session",
                          e.target.value.toLowerCase()
                        )
                      }
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
                      onChange={(e) =>
                        handleEditFormChange("semester", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-teacherId">Teacher ID</Label>
                    <Input
                      id="edit-teacherId"
                      value={editingAdvisor.teacherId}
                      onChange={(e) =>
                        handleEditFormChange("teacherId", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateAdvisor}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update Advisor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </PrivateRoute>
  );
}
