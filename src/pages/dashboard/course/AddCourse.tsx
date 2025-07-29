import type React from "react";
import { useState, type ChangeEvent } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Papa from "papaparse";
import { Plus, Upload, FileText, BookOpen, X } from "lucide-react";
import axios from "axios";

// Types
interface Course {
  _id?: string;
  name: string;
  code: string;
  credit: number;
  depart: string;
  prerequisiteCourse: string[];
}

// Axios client
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default function AddCoursePage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Course>({
    name: "",
    code: "",
    credit: 0,
    depart: "",
    prerequisiteCourse: [],
  });

  const handleInputChange = (field: keyof Course, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePrerequisiteChange = (value: string) => {
    const prerequisites = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      prerequisiteCourse: prerequisites,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/course/course", formData);
      toast.success("Course added successfully");

      // Reset form
      setFormData({
        name: "",
        code: "",
        credit: 0,
        depart: "",
        prerequisiteCourse: [],
      });
    } catch {
      toast.error("Error adding course");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      code: "",
      credit: 0,
      depart: "",
      prerequisiteCourse: [],
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Add New Course</h1>
        <p className="text-muted-foreground">
          Add individual courses or upload multiple courses via CSV/JSON
        </p>
      </div>

      {/* Add Course Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Course Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Fundamentals of Computers"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., CSE111"
                  value={formData.code}
                  onChange={(e) =>
                    handleInputChange("code", e.target.value.toUpperCase())
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credit">Credit Hours *</Label>
                <Input
                  id="credit"
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="e.g., 3"
                  value={formData.credit || ""}
                  onChange={(e) =>
                    handleInputChange("credit", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="depart">Department *</Label>
                <Input
                  id="depart"
                  placeholder="e.g., CSE"
                  value={formData.depart}
                  onChange={(e) =>
                    handleInputChange("depart", e.target.value.toUpperCase())
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisite">Prerequisite Course Codes</Label>
              <Input
                id="prerequisite"
                placeholder="e.g., CSE111, CSE113 (separate with commas)"
                value={formData.prerequisiteCourse.join(", ")}
                onChange={(e) => handlePrerequisiteChange(e.target.value)}
              />
              {formData.prerequisiteCourse.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.prerequisiteCourse.map((prereq, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add Course"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <UploadData />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

const UploadData = () => {
  const [dataList, setDataList] = useState<Array<Record<string, unknown>>>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string).trim();

      if (file.type === "application/json" || file.name.endsWith(".json")) {
        try {
          const json = JSON.parse(content);
          if (Array.isArray(json)) {
            setDataList(json);
          } else {
            setDataList([json]);
          }
        } catch {
          toast.error("Invalid JSON file");
          setDataList([]);
        }
      } else if (
        file.type === "text/csv" ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx")
      ) {
        const parsed = Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
        });
        if (parsed.errors.length) {
          toast.error("CSV parse error");
          setDataList([]);
        } else {
          setDataList(parsed.data as Array<Record<string, unknown>>);
        }
      } else {
        toast.error("Unsupported file type");
        setDataList([]);
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (dataList.length === 0) return;
    setUploading(true);

    const payload = dataList
      .map((course) => ({
        ...course,
        prerequisiteCourse:
          typeof course["prerequisiteCourse"] === "string"
            ? course["prerequisiteCourse"]
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : course["prerequisiteCourse"],
      }))
      .map((course) => ({
        ...course,
        credit: Number((course as unknown as { credit: number }).credit),
      }));

    try {
      await axiosClient.post("/course/courses", payload);
      toast.success("Courses uploaded successfully");
      setDataList([]);
      setOpen(false);
    } catch {
      toast.error("Error uploading courses");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setDataList([]);
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Upload CSV/JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Upload Course Data
          </DialogTitle>
          <DialogDescription>
            Upload a course list with{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">name</code>,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">code</code>,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">credit</code>
            ,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">depart</code>
            ,{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              prerequisiteCourse
            </code>
            . For CSV, headers must match exactly.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex flex-col gap-4">
          <input
            type="file"
            id="upload-course-file"
            accept=".csv, application/json"
            hidden
            onChange={handleChange}
          />
          <label htmlFor="upload-course-file">
            <Button
              className="w-full pointer-events-none bg-transparent"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </label>

          {dataList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-4 h-4" />
                  Preview ({dataList.length} courses)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto border rounded">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(dataList[0]).map((key) => (
                          <TableHead key={key} className="font-semibold">
                            {key}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataList.slice(0, 3).map((row, idx) => (
                        <TableRow key={idx}>
                          {Object.keys(row).map((key) => (
                            <TableCell
                              key={key}
                              className="max-w-[200px] truncate"
                            >
                              {key === "prerequisiteCourse" &&
                              Array.isArray(row[key]) ? (
                                <div className="flex flex-wrap gap-1">
                                  {(row[key] as string[]).map((prereq, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {prereq}
                                    </Badge>
                                  ))}
                                </div>
                              ) : key === "credit" ? (
                                <Badge variant="outline">
                                  {String(row[key] ?? "")} credits
                                </Badge>
                              ) : key === "depart" ? (
                                <Badge variant="secondary">
                                  {String(row[key]).toUpperCase()}
                                </Badge>
                              ) : key === "code" ? (
                                <span className="font-mono font-medium">
                                  {String(row[key]).toUpperCase()}
                                </span>
                              ) : (
                                String(row[key] ?? "")
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                      {dataList.length > 3 && (
                        <TableRow>
                          <TableCell
                            colSpan={Object.keys(dataList[0]).length}
                            className="text-center text-muted-foreground"
                          >
                            ... and {dataList.length - 3} more courses
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {dataList.length > 0 && (
            <Button
              type="button"
              onClick={handleUpload}
              className="w-full"
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : `Upload ${dataList.length} Courses`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
