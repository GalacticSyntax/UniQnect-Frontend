import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AlignType } from "@/components/form/BatManForm";
import BatManForm from "@/components/form/BatManForm";
import PrivateRoute from "@/components/PrivateRoute";
import axios from "axios";
import { toast } from "sonner";
import Papa from "papaparse";

const formSchema = {
  title: {
    label: "Add new course",
    align: "center" as AlignType,
  },
  fields: [
    {
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Name",
      required: true,
    },
    {
      type: "text",
      name: "code",
      label: "Code",
      placeholder: "Code",
      required: true,
    },
    {
      type: "number",
      name: "credit",
      label: "Credit",
      placeholder: "Credit",
      required: true,
    },
    {
      type: "text",
      name: "depart",
      label: "Depart",
      placeholder: "Depart",
      required: true,
    },
    {
      type: "text",
      name: "prerequisiteCourse",
      label: "Prerequisite Course codes",
      placeholder: "Add course codes separated by ,",
      required: true,
    },
    {
      type: "reset",
      name: "reset",
      label: "Clear",
      className: "w-fit",
    },
    {
      type: "submit",
      name: "submit",
      label: "Add",
    },
  ],
};

const AddCoursePage = () => {
  const [, setLoader] = useState(false);

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    const payload = [
      {
        ...formData,
        prerequisiteCourse: (formData["prerequisiteCourse"] as string)
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
    ];

    try {
      await axios.post("/api/add-courses", {
        courses: payload,
      });
      toast.success("Course added successfully");
    } catch {
      toast.error("Error adding course");
    } finally {
      setLoader(false);
    }
  };

  return (
    <PrivateRoute>
      <section className="w-full h-full grid place-items-center p-5">
        <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit}>
          <UploadData />
        </BatManForm>
      </section>
    </PrivateRoute>
  );
};

const UploadData = () => {
  const [dataList, setDataList] = useState<Array<Record<string, unknown>>>([]);
  const [open, setOpen] = useState(false);

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

    try {
      await axios.post("/api/add-courses", {
        courses: dataList.map((course) => ({
          ...course,
          prerequisiteCourse: (course["prerequisiteCourse"] as string)
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean),
        })),
      });
      toast.success("Courses uploaded successfully");
      setDataList([]);
      setOpen(false);
    } catch {
      toast.error("Error uploading courses");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setDataList([]); // clear data when dialog closes
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Upload JSON or CSV
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload CSV or JSON file</DialogTitle>
          <DialogDescription>
            Upload a course list with <code>name</code>, <code>code</code>,{" "}
            <code>credit</code>, <code>depart</code>,{" "}
            <code>prerequisiteCourse</code>. For CSV, header must match.
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
            <Button className="w-full pointer-events-none">Choose File</Button>
          </label>

          {dataList.length > 0 && (
            <div className="w-full overflow-x-auto border rounded p-2">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    {Object.keys(dataList[0]).map((key) => (
                      <th key={key} className="px-2 py-1 font-semibold">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataList.slice(0, 2).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      {Object.keys(row).map((key) => (
                        <td key={key} className="px-2 py-1">
                          {String(row[key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {dataList.length > 0 && (
            <Button type="button" onClick={handleUpload} className="w-full">
              Save Uploaded Courses ({dataList.length})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCoursePage;
