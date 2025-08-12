import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosClient } from "@/lib/apiClient";
import type React from "react";
import { useState } from "react";

export default function AddDepartmentHead() {
  const [formData, setFormData] = useState({
    departmentCode: "",
    teacherId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.departmentCode || !formData.teacherId) {
      setMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await axiosClient.post(
        "/department-head/department-head",
        formData
      );

      console.log(response);

      setMessage("Department head added successfully!");
      setFormData({ departmentCode: "", teacherId: "" });
    } catch {
      setMessage("Failed to add department head");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ departmentCode: "", teacherId: "" });
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Department Head</CardTitle>
          <CardDescription>Assign a teacher as department head</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departmentCode">Department Code</Label>
              <Input
                id="departmentCode"
                name="departmentCode"
                type="text"
                value={formData.departmentCode}
                onChange={handleInputChange}
                placeholder="Enter department code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input
                id="teacherId"
                name="teacherId"
                type="text"
                value={formData.teacherId}
                onChange={handleInputChange}
                placeholder="Enter teacher ID"
                required
              />
            </div>

            {message && (
              <div
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Adding..." : "Add Department Head"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
