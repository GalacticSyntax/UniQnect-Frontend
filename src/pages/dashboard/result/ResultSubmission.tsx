"use client";

import { useState } from "react";
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
import { Upload, Plus, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudentMark {
  studentId: string;
  courseId: string;
  session: string;
  midMarks: number;
  finalMarks: number;
  assignmentTutorial: number;
  total: number;
}

const ResultSubmissionPage = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualEntries, setManualEntries] = useState<StudentMark[]>([
    {
      studentId: "",
      courseId: "",
      session: "",
      midMarks: 0,
      finalMarks: 0,
      assignmentTutorial: 0,
      total: 0,
    },
  ]);

  const calculateTotal = (mid: number, final: number, assignment: number) => {
    return mid + final + assignment + 10; // Added attendance marks
  };

  const handleManualInputChange = (
    index: number,
    field: keyof StudentMark,
    value: string | number
  ) => {
    const updatedEntries = [...manualEntries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };

    if (
      field === "midMarks" ||
      field === "finalMarks" ||
      field === "assignmentTutorial"
    ) {
      const mid =
        field === "midMarks" ? Number(value) : updatedEntries[index].midMarks;
      const final =
        field === "finalMarks"
          ? Number(value)
          : updatedEntries[index].finalMarks;
      const assignment =
        field === "assignmentTutorial"
          ? Number(value)
          : updatedEntries[index].assignmentTutorial;
      updatedEntries[index].total = calculateTotal(mid, final, assignment);
    }

    setManualEntries(updatedEntries);
  };

  const addNewEntry = () => {
    setManualEntries([
      ...manualEntries,
      {
        studentId: "",
        courseId: "",
        session: "",
        midMarks: 0,
        finalMarks: 0,
        assignmentTutorial: 0,
        total: 0,
      },
    ]);
  };

  const removeEntry = (index: number) => {
    if (manualEntries.length > 1) {
      const updatedEntries = manualEntries.filter((_, i) => i !== index);
      setManualEntries(updatedEntries);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("csvFile", csvFile);

      // Replace with your actual API endpoint
      const response = await fetch("/api/results/upload-csv", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("CSV file uploaded successfully!");
        setCsvFile(null);
      } else {
        toast.error("Failed to upload CSV file");
      }
    } catch {
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualSubmit = async () => {
    const validEntries = manualEntries.filter(
      (entry) => entry.studentId && entry.courseId && entry.session
    );

    if (validEntries.length === 0) {
      toast.error("Please fill in at least one complete entry");
      return;
    }

    // Validate marks
    const invalidEntries = validEntries.some(
      (entry) =>
        entry.midMarks > 30 ||
        entry.finalMarks > 40 ||
        entry.assignmentTutorial > 20
    );

    if (invalidEntries) {
      toast.error(
        "Marks exceed maximum limits (Mid: 30, Final: 40, Assignment: 20)"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/results/manual-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: validEntries }),
      });

      if (response.ok) {
        toast.success(
          `${validEntries.length} result(s) submitted successfully!`
        );
        setManualEntries([
          {
            studentId: "",
            courseId: "",
            session: "",
            midMarks: 0,
            finalMarks: 0,
            assignmentTutorial: 0,
            total: 0,
          },
        ]);
      } else {
        toast.error("Failed to submit results");
      }
    } catch {
      toast.error("Error submitting results");
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "studentId,courseId,session,midMarks,finalMarks,assignmentTutorial\n";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Result Submission
          </h1>
          <p className="text-gray-600">
            Upload CSV file or manually input student marks
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Student Results</CardTitle>
            <CardDescription>
              Choose between CSV upload for bulk submission or manual entry for
              individual results
            </CardDescription>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800 font-medium">
                📋 Note: 10 marks for attendance will be automatically added to
                the total score
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="csv" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="csv" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="csv-file" className="cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload CSV file or drag and drop
                      </span>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) =>
                          setCsvFile(e.target.files?.[0] || null)
                        }
                      />
                    </Label>
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                </div>

                {csvFile && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Selected: {csvFile.name}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Download className="h-4 w-4" />
                    Download Template
                  </Button>
                  <Button
                    onClick={handleCsvUpload}
                    disabled={!csvFile || isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload CSV"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-4">
                  {manualEntries.map((entry, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Student {index + 1}</h4>
                        {manualEntries.length > 1 && (
                          <Button
                            onClick={() => removeEntry(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`studentId-${index}`}>
                            Student ID
                          </Label>
                          <Input
                            id={`studentId-${index}`}
                            value={entry.studentId}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "studentId",
                                e.target.value
                              )
                            }
                            placeholder="Enter student ID"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`courseId-${index}`}>Course ID</Label>
                          <Input
                            id={`courseId-${index}`}
                            value={entry.courseId}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "courseId",
                                e.target.value
                              )
                            }
                            placeholder="Enter course ID"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`session-${index}`}>Session</Label>
                          <Input
                            id={`session-${index}`}
                            value={entry.session}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "session",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Spring 2024"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`midMarks-${index}`}>
                            Mid Marks (30)
                          </Label>
                          <Input
                            id={`midMarks-${index}`}
                            type="number"
                            min="0"
                            max="30"
                            value={entry.midMarks}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "midMarks",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`finalMarks-${index}`}>
                            Final Marks (40)
                          </Label>
                          <Input
                            id={`finalMarks-${index}`}
                            type="number"
                            min="0"
                            max="40"
                            value={entry.finalMarks}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "finalMarks",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label htmlFor={`assignment-${index}`}>
                            Assignment & Tutorial (20)
                          </Label>
                          <Input
                            id={`assignment-${index}`}
                            type="number"
                            min="0"
                            max="20"
                            value={entry.assignmentTutorial}
                            onChange={(e) =>
                              handleManualInputChange(
                                index,
                                "assignmentTutorial",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Label>Total (90)</Label>
                          <Input
                            value={entry.total}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="col-span-full">
                          <p className="text-xs text-gray-500 mt-1">
                            * Final total will include 10 attendance marks
                            (Total out of 100)
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={addNewEntry}
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Student
                  </Button>
                  <Button
                    onClick={handleManualSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Results"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultSubmissionPage;
