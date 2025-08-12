"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Search, X } from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";

interface Teacher {
  _id: string;
  userId: string;
  teacherId: string;
  designation: string;
  joinedAt: string;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
}

interface DepartmentHead {
  _id: string;
  departmentCode: string;
  teacherId: Teacher;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: DepartmentHead[];
}

interface EditForm {
  departmentCode: string;
  teacherId: string;
}

interface User {
  role: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
}

const DepartmentHeadPage: React.FC = () => {
  const { user } = useAuth() as AuthContextType;
  const [departmentHeads, setDepartmentHeads] = useState<DepartmentHead[]>([]);
  const [filteredHeads, setFilteredHeads] = useState<DepartmentHead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingHead, setEditingHead] = useState<DepartmentHead | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    departmentCode: "",
    teacherId: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchDepartmentHeads();
  }, []);

  useEffect(() => {
    filterHeads();
  }, [searchTerm, departmentHeads]);

  const fetchDepartmentHeads = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get<ApiResponse>(
        "/department-head/department-head"
      );

      if (response.data.success) {
        setDepartmentHeads(response.data.data);
      } else {
        toast.error("Failed to fetch department heads");
      }
    } catch (error: unknown) {
      console.error("Error fetching department heads:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to fetch department heads";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterHeads = () => {
    if (!searchTerm.trim()) {
      setFilteredHeads(departmentHeads);
      return;
    }

    const filtered = departmentHeads.filter(
      (head) =>
        head.departmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        head.teacherId.teacherId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        head.teacherId.designation
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredHeads(filtered);
  };

  const handleEdit = (head: DepartmentHead) => {
    setEditingHead(head);
    setEditForm({
      departmentCode: head.departmentCode,
      teacherId: head.teacherId.teacherId,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingHead) return;

    if (!editForm.departmentCode.trim() || !editForm.teacherId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setUpdating(true);
      const response = await axiosClient.patch(
        `/department-head/department-head/${editingHead._id}`,
        {
          departmentCode: editForm.departmentCode,
          teacherId: editForm.teacherId,
        }
      );

      console.log(response);

      toast.success("Department head updated successfully!");
      setIsEditDialogOpen(false);
      setEditingHead(null);
      setEditForm({ departmentCode: "", teacherId: "" });
      fetchDepartmentHeads(); // Refresh the list
    } catch (error: unknown) {
      console.error("Error updating department head:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update department head";
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEditFormChange =
    (field: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading department heads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Department Heads</h1>
          <p className="text-muted-foreground">
            Manage department head assignments
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Total: {departmentHeads.length}
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Department Heads
          </CardTitle>
          <CardDescription>
            Search by department code, teacher ID, or designation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Search department heads..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {searchTerm && (
              <Button variant="outline" size="icon" onClick={handleClearSearch}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Department Heads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Department Head List</CardTitle>
          <CardDescription>
            {filteredHeads.length} department head
            {filteredHeads.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHeads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No department heads found
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Code</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Joined At</TableHead>
                    <TableHead>Created At</TableHead>
                    {isAdmin && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHeads.map((head) => (
                    <TableRow key={head._id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">
                          {head.departmentCode.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{head.teacherId.teacherId}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {head.teacherId.designation}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(head.teacherId.joinedAt)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(head.createdAt)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(head)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department Head</DialogTitle>
            <DialogDescription>
              Update the department head assignment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-departmentCode">Department Code</Label>
              <Input
                id="edit-departmentCode"
                value={editForm.departmentCode}
                onChange={handleEditFormChange("departmentCode")}
                placeholder="Enter department code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-teacherId">Teacher ID</Label>
              <Input
                id="edit-teacherId"
                value={editForm.teacherId}
                onChange={handleEditFormChange("teacherId")}
                placeholder="Enter teacher ID"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={updating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentHeadPage;
