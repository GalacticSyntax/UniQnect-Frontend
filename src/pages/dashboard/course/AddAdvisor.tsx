import type React from "react";
import {
  useState,
  //  type ChangeEvent
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { toast } from "sonner";
// import Papa from "papaparse";
import {
  Plus,
  //  Upload, FileText, UserCheck,
  X,
} from "lucide-react";
import axios from "axios";

// Types
interface Advisor {
  _id?: string;
  departmentCode: string;
  session: string;
  semester: number;
  teacherId: string;
}

// Axios client
const axiosClient = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

export default function AddAdvisorPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Advisor>({
    departmentCode: "",
    session: "",
    semester: 1,
    teacherId: "",
  });

  const handleInputChange = (field: keyof Advisor, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/advisor", formData);
      toast.success("Advisor added successfully");

      // Reset form
      setFormData({
        departmentCode: "",
        session: "",
        semester: 1,
        teacherId: "",
      });
    } catch {
      toast.error("Error adding advisor");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      departmentCode: "",
      session: "",
      semester: 1,
      teacherId: "",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-6 px-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Add New Advisor</h1>
        <p className="text-muted-foreground">
          Add individual advisors or upload multiple advisors via CSV/JSON
        </p>
      </div>

      {/* Add Advisor Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Advisor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentCode">Department Code *</Label>
                <Input
                  id="departmentCode"
                  placeholder="e.g., CSE"
                  value={formData.departmentCode}
                  onChange={(e) =>
                    handleInputChange(
                      "departmentCode",
                      e.target.value.toLowerCase()
                    )
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Session *</Label>
                <Input
                  id="session"
                  placeholder="e.g., fall-2025"
                  value={formData.session}
                  onChange={(e) =>
                    handleInputChange("session", e.target.value.toLowerCase())
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="e.g., 1"
                  value={formData.semester || ""}
                  onChange={(e) =>
                    handleInputChange("semester", Number(e.target.value))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher ID *</Label>
                <Input
                  id="teacherId"
                  placeholder="e.g., 2344455"
                  value={formData.teacherId}
                  onChange={(e) =>
                    handleInputChange("teacherId", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                {loading ? "Adding..." : "Add Advisor"}
              </Button>
              <Button type="button" variant="outline" onClick={handleClear}>
                <X className="w-4 h-4 mr-2" />
                Clear
              </Button>
              {/* <UploadData /> */}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// const UploadData = () => {
//   const [dataList, setDataList] = useState<Array<Record<string, unknown>>>([]);
//   const [open, setOpen] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const content = (event.target?.result as string).trim();

//       if (file.type === "application/json" || file.name.endsWith(".json")) {
//         try {
//           const json = JSON.parse(content);
//           if (Array.isArray(json)) {
//             setDataList(json);
//           } else {
//             setDataList([json]);
//           }
//         } catch {
//           toast.error("Invalid JSON file");
//           setDataList([]);
//         }
//       } else if (
//         file.type === "text/csv" ||
//         file.name.endsWith(".csv") ||
//         file.name.endsWith(".xlsx")
//       ) {
//         const parsed = Papa.parse(content, {
//           header: true,
//           skipEmptyLines: true,
//         });
//         if (parsed.errors.length) {
//           toast.error("CSV parse error");
//           setDataList([]);
//         } else {
//           setDataList(parsed.data as Array<Record<string, unknown>>);
//         }
//       } else {
//         toast.error("Unsupported file type");
//         setDataList([]);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const handleUpload = async () => {
//     if (dataList.length === 0) return;
//     setUploading(true);

//     const payload = dataList.map((advisor) => ({
//       ...advisor,
//       semester: Number((advisor as unknown as { semester: number }).semester),
//     }));

//     try {
//       await axiosClient.post("/advisors", payload);
//       toast.success("Advisors uploaded successfully");
//       setDataList([]);
//       setOpen(false);
//     } catch {
//       toast.error("Error uploading advisors");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(isOpen) => {
//         if (!isOpen) {
//           setDataList([]);
//         }
//         setOpen(isOpen);
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <Upload className="w-4 h-4 mr-2" />
//           Upload CSV/JSON
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Upload Advisor Data
//           </DialogTitle>
//           <DialogDescription>
//             Upload an advisor list with{" "}
//             <code className="bg-muted px-1 py-0.5 rounded text-xs">
//               departmentCode
//             </code>
//             ,{" "}
//             <code className="bg-muted px-1 py-0.5 rounded text-xs">
//               session
//             </code>
//             ,{" "}
//             <code className="bg-muted px-1 py-0.5 rounded text-xs">
//               semester
//             </code>
//             ,{" "}
//             <code className="bg-muted px-1 py-0.5 rounded text-xs">
//               teacherId
//             </code>
//             . For CSV, headers must match exactly.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="w-full flex flex-col gap-4">
//           <input
//             type="file"
//             id="upload-advisor-file"
//             accept=".csv, application/json"
//             hidden
//             onChange={handleChange}
//           />
//           <label htmlFor="upload-advisor-file">
//             <Button
//               className="w-full pointer-events-none bg-transparent"
//               variant="outline"
//             >
//               <Upload className="w-4 h-4 mr-2" />
//               Choose File
//             </Button>
//           </label>

//           {dataList.length > 0 && (
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-lg">
//                   <UserCheck className="w-4 h-4" />
//                   Preview ({dataList.length} advisors)
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="w-full overflow-x-auto border rounded">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         {Object.keys(dataList[0]).map((key) => (
//                           <TableHead key={key} className="font-semibold">
//                             {key}
//                           </TableHead>
//                         ))}
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {dataList.slice(0, 3).map((row, idx) => (
//                         <TableRow key={idx}>
//                           {Object.keys(row).map((key) => (
//                             <TableCell
//                               key={key}
//                               className="max-w-[200px] truncate"
//                             >
//                               {key === "departmentCode" ? (
//                                 <Badge variant="secondary">
//                                   {String(row[key]).toUpperCase()}
//                                 </Badge>
//                               ) : key === "session" ? (
//                                 <Badge variant="outline">
//                                   {String(row[key])}
//                                 </Badge>
//                               ) : key === "semester" ? (
//                                 <Badge variant="outline">
//                                   Semester {String(row[key])}
//                                 </Badge>
//                               ) : key === "teacherId" ? (
//                                 <span className="font-mono font-medium">
//                                   {String(row[key])}
//                                 </span>
//                               ) : (
//                                 String(row[key] ?? "")
//                               )}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       ))}
//                       {dataList.length > 3 && (
//                         <TableRow>
//                           <TableCell
//                             colSpan={Object.keys(dataList[0]).length}
//                             className="text-center text-muted-foreground"
//                           >
//                             ... and {dataList.length - 3} more advisors
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {dataList.length > 0 && (
//             <Button
//               type="button"
//               onClick={handleUpload}
//               className="w-full"
//               disabled={uploading}
//             >
//               <Upload className="w-4 h-4 mr-2" />
//               {uploading
//                 ? "Uploading..."
//                 : `Upload ${dataList.length} Advisors`}
//             </Button>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
