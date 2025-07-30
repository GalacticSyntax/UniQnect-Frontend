import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, GraduationCap } from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
}

export default function RegistrationForm() {
  const [semester, setSemester] = useState<"spring" | "fall" | "">("");
  const [year, setYear] = useState("");
  const [studentName, setStudentName] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [section, setSection] = useState("");
  const [semesterNumber, setSemesterNumber] = useState("");
  const [nonCreditCourses, setNonCreditCourses] = useState("");
  const [department, setDepartment] = useState("");
  const [program, setProgram] = useState("");

  const [courses, setCourses] = useState<Course[]>([
    { id: "1", code: "", title: "", credits: 0 },
    { id: "2", code: "", title: "", credits: 0 },
    { id: "3", code: "", title: "", credits: 0 },
  ]);

  // Smart row management
  const manageRows = (updatedCourses: Course[]) => {
    // Count empty rows (rows with no content)
    const emptyRows = updatedCourses.filter(
      (course) =>
        !course.code.trim() && !course.title.trim() && course.credits === 0
    );

    const finalCourses = [...updatedCourses];

    // Remove excess empty rows (keep only 2-3 empty rows)
    if (emptyRows.length > 3) {
      const rowsToRemove = emptyRows.length - 3;
      for (let i = 0; i < rowsToRemove; i++) {
        let lastEmptyIndex = -1;
        for (let i = finalCourses.length - 1; i >= 0; i--) {
          const course = finalCourses[i];
          if (
            !course.code.trim() &&
            !course.title.trim() &&
            course.credits === 0
          ) {
            lastEmptyIndex = i;
            break;
          }
        }
        if (lastEmptyIndex !== -1) {
          finalCourses.splice(lastEmptyIndex, 1);
        }
      }
    }

    // Add a new row if we have less than 2 empty rows
    const remainingEmptyRows = finalCourses.filter(
      (course) =>
        !course.code.trim() && !course.title.trim() && course.credits === 0
    );

    if (remainingEmptyRows.length < 2) {
      const newCourse: Course = {
        id: `${Date.now()}-${Math.random()}`,
        code: "",
        title: "",
        credits: 0,
      };
      finalCourses.push(newCourse);
    }

    return finalCourses;
  };

  const updateCourse = (
    courseId: string,
    field: keyof Course,
    value: string | number
  ) => {
    setCourses((prevCourses) => {
      const updatedCourses = prevCourses.map((course) =>
        course.id === courseId ? { ...course, [field]: value } : course
      );

      // Apply smart row management
      return manageRows(updatedCourses);
    });
  };

  // Clean up rows on component mount and when courses change
  useEffect(() => {
    setCourses((prevCourses) => manageRows(prevCourses));
  }, []);

  const totalCredits = courses
    .filter((course) => course.code.trim() || course.title.trim())
    .reduce((sum, course) => sum + course.credits, 0);

  const downloadPDF = () => {
    // Get the form element
    const formElement = document.getElementById("registration-form");
    if (!formElement) return;

    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Get the form HTML and styles
    const formHTML = formElement.outerHTML;
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch {
          return "";
        }
      })
      .join("");

    // Create the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Course Registration Form</title>
          <style>
            ${styles}
            body { 
              margin: 0; 
              padding: 20px;
              font-family: system-ui, -apple-system, sans-serif;
            }
            .print-hidden { display: none !important; }
            .print-avoid-break { page-break-inside: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            @media print {
              body { margin: 0 !important; }
              .print-hidden { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${formHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const getRomanNumeral = (index: number): string => {
    const romanNumerals = [
      "i",
      "ii",
      "iii",
      "iv",
      "v",
      "vi",
      "vii",
      "viii",
      "ix",
      "x",
      "xi",
      "xii",
      "xiii",
      "xiv",
      "xv",
      "xvi",
      "xvii",
      "xviii",
      "xix",
      "xx",
      "xxi",
      "xxii",
      "xxiii",
      "xxiv",
      "xxv",
      "xxvi",
      "xxvii",
      "xxviii",
      "xxix",
      "xxx",
    ];
    return romanNumerals[index] || `${index + 1}`;
  };

  return (
    <main className="min-h-screen bg-gray-50 print:bg-white">
      <div
        id="registration-form"
        className="max-w-4xl mx-auto p-8 bg-white shadow-lg print:shadow-none print:p-6"
      >
        {/* University Header */}
        <div className="text-center mb-8 pb-4 border-b-4 border-black print-avoid-break">
          <div className="flex items-center justify-center gap-6 mb-4">
            {/* University Logo */}
            <div className="w-20 h-20 border-4 border-green-700 rounded-full flex items-center justify-center bg-green-50">
              <GraduationCap className="w-10 h-10 text-green-700" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold uppercase tracking-wider text-black">
                North East University Bangladesh
              </h1>
              <h2 className="text-xl font-bold mt-2 text-black tracking-wide">
                COURSE REGISTRATION FORM
              </h2>
            </div>
          </div>

          {/* Semester Selection */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-black flex items-center justify-center">
                {semester === "spring" && (
                  <div className="w-2 h-2 bg-black"></div>
                )}
              </div>
              <button
                onClick={() =>
                  setSemester(semester === "spring" ? "" : "spring")
                }
                className="text-lg font-semibold print:pointer-events-none"
              >
                Spring
              </button>
            </div>
            <span className="text-2xl font-bold">/</span>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-black flex items-center justify-center">
                {semester === "fall" && (
                  <div className="w-2 h-2 bg-black"></div>
                )}
              </div>
              <button
                onClick={() => setSemester(semester === "fall" ? "" : "fall")}
                className="text-lg font-semibold print:pointer-events-none"
              >
                Fall
              </button>
            </div>
            <span className="text-lg font-semibold ml-4">Semester 20</span>
            <div className="border-b-2 border-black">
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-12 text-center text-lg font-semibold bg-transparent border-none outline-none"
                placeholder="25"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Department and Program - Now Editable */}
        <div className="grid grid-cols-2 gap-8 mb-8 print-avoid-break">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Department:</span>
            <div className="flex-1 border-b-2 border-black">
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-lg bg-transparent border-none outline-none py-1"
                placeholder="e.g., CSE"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Program:</span>
            <div className="flex-1 border-b-2 border-black">
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full text-lg bg-transparent border-none outline-none py-1"
                placeholder="e.g., B.Sc (Engg.) in CSE"
              />
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="space-y-6 mb-8 print-avoid-break">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold whitespace-nowrap">
                1) Name of the Student:
              </span>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-lg bg-transparent border-none outline-none py-1"
                  placeholder="Enter student name"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold whitespace-nowrap">
                Section (if any):
              </span>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full text-lg bg-transparent border-none outline-none py-1"
                  placeholder="Enter section"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold whitespace-nowrap">
                2) Registration/ID No.:
              </span>
              <div className="flex-1 border-b-2 border-black">
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="w-full text-lg bg-transparent border-none outline-none py-1"
                  placeholder="Enter registration number"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold whitespace-nowrap">
                Semester(s) Number:
              </span>
              <div className="w-20 border-b-2 border-black">
                <input
                  type="text"
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(e.target.value)}
                  className="w-full text-lg text-center bg-transparent border-none outline-none py-1"
                  placeholder="1st"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Course Table */}
        <div className="mb-8">
          <div className="mb-4 print-avoid-break">
            <span className="text-lg font-semibold">
              3) Courses taken in current semester
            </span>
          </div>

          <div className="border-4 border-black">
            <table className="w-full">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="border-r-2 border-black p-3 text-center font-bold text-lg bg-gray-50 w-16"></th>
                  <th className="border-r-2 border-black p-3 text-center font-bold text-lg bg-gray-50">
                    Course Code
                  </th>
                  <th className="border-r-2 border-black p-3 text-center font-bold text-lg bg-gray-50">
                    Course Title
                  </th>
                  <th className="p-3 text-center font-bold text-lg bg-gray-50 w-24">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id} className="border-b-2 border-black">
                    <td className="border-r-2 border-black p-3 text-center font-bold text-lg">
                      ({getRomanNumeral(index)})
                    </td>
                    <td className="border-r-2 border-black p-2">
                      <input
                        type="text"
                        value={course.code}
                        onChange={(e) =>
                          updateCourse(course.id, "code", e.target.value)
                        }
                        className="w-full text-lg font-mono bg-transparent border-none outline-none p-1"
                        placeholder="Enter course code"
                      />
                    </td>
                    <td className="border-r-2 border-black p-2">
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) =>
                          updateCourse(course.id, "title", e.target.value)
                        }
                        className="w-full text-lg bg-transparent border-none outline-none p-1"
                        placeholder="Enter course title"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="6"
                        value={course.credits || ""}
                        onChange={(e) =>
                          updateCourse(
                            course.id,
                            "credits",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full text-lg text-center bg-transparent border-none outline-none p-1"
                        placeholder="0.0"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credits Summary */}
        <div className="grid grid-cols-2 gap-8 mb-16 print-avoid-break">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              4) Regular/Drop credits taken:
            </span>
            <div className="w-20 border-b-2 border-black">
              <input
                type="text"
                value={totalCredits.toString()}
                readOnly
                className="w-full text-lg text-center font-bold bg-transparent border-none outline-none py-1"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              5) Number of Non Credit Courses:
            </span>
            <div className="w-20 border-b-2 border-black">
              <input
                type="text"
                value={nonCreditCourses}
                onChange={(e) => setNonCreditCourses(e.target.value)}
                className="w-full text-lg text-center bg-transparent border-none outline-none py-1"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-8 mt-20 mb-8 print-avoid-break">
          <div className="text-center">
            <div className="border-b-2 border-black w-64 mx-auto mb-3 h-12"></div>
            <span className="text-lg font-semibold">
              Signature of the Student
            </span>
          </div>
          <div className="text-center">
            <div className="border-b-2 border-black w-64 mx-auto mb-3 h-12"></div>
            <span className="text-lg font-semibold">
              Course Advisor/Head of the Dept.
            </span>
          </div>
        </div>

        {/* Download Button - Hidden in print */}
        <div className="fixed bottom-6 right-6 print-hidden">
          <Button
            onClick={downloadPDF}
            className="bg-green-700 hover:bg-green-800 text-white shadow-lg"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Row count indicator - Hidden in print */}
        <div className="fixed bottom-6 left-6 print-hidden bg-white p-2 rounded shadow text-sm text-gray-600">
          Total courses: {courses.length} | Filled:{" "}
          {
            courses.filter(
              (c) => c.code.trim() || c.title.trim() || c.credits > 0
            ).length
          }{" "}
          | Empty:{" "}
          {
            courses.filter(
              (c) => !c.code.trim() && !c.title.trim() && c.credits === 0
            ).length
          }
        </div>
      </div>
    </main>
  );
}
