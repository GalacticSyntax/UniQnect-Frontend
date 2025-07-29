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
import { BookOpen, UserCheck, GraduationCap } from "lucide-react"; // Added GraduationCap for overall title

// Types
interface OfferedCourse {
  courseTitle: string;
  courseCode: string;
  credits: number;
  courseTeachers: string[];
}

interface SemesterBlockData {
  id: string; // Unique ID for the block
  semesterName: string;
  totalCredit: number;
  advisorName: string;
  courses: OfferedCourse[];
}

// SemesterCourseBlock Component
interface SemesterCourseBlockProps {
  data: SemesterBlockData;
}

function SemesterCourseBlock({ data }: SemesterCourseBlockProps) {
  return (
    <Card className="w-full h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {data.semesterName}
        </CardTitle>
        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
          <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Advisor:
          </span>{" "}
          {data.advisorName}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          <span className="font-medium text-gray-700 dark:text-gray-200">
            Total Credit:
          </span>{" "}
          {data.totalCredit}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="rounded-lg border overflow-hidden">
          {" "}
          {/* Changed to rounded-lg for softer corners */}
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800">
              {" "}
              {/* Subtle background for header */}
              <TableRow>
                <TableHead className="w-[100px] text-gray-600 dark:text-gray-300 font-medium">
                  Code
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                  Course Title
                </TableHead>
                <TableHead className="text-center text-gray-600 dark:text-gray-300 font-medium w-[80px]">
                  Credits
                </TableHead>
                <TableHead className="text-gray-600 dark:text-gray-300 font-medium">
                  Teachers
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.courses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No courses offered this semester.
                  </TableCell>
                </TableRow>
              ) : (
                data.courses.map((course, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {" "}
                    {/* Hover effect */}
                    <TableCell className="font-mono text-sm font-medium text-gray-900 dark:text-gray-50">
                      {course.courseCode.toUpperCase()}
                    </TableCell>
                    <TableCell className="font-medium text-sm text-gray-800 dark:text-gray-100">
                      {course.courseTitle}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600"
                      >
                        {course.credits}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {course.courseTeachers.map((teacher, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 border-blue-100 dark:border-blue-800"
                          >
                            {teacher}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function OfferedCoursesPage() {
  // Dummy Data for demonstration
  const dummySemesterData: SemesterBlockData[] = [
    {
      id: "fall-25-1-1",
      semesterName: "Fall-25 (1/1)",
      totalCredit: 18,
      advisorName: "Mr. Shahadat Hussain Parvez (SHP)",
      courses: [
        {
          courseCode: "CSE-0613111",
          courseTitle: "Discrete Mathematics",
          credits: 3,
          courseTeachers: ["Dr. Arif Ahmad (AAD)", "Md. Jahidul Islam (MJI)"],
        },
        {
          courseCode: "CSE-0613113",
          courseTitle: "Structured Programming Language",
          credits: 3,
          courseTeachers: [
            "Mr. Sabuj Chandra Paul (SCP)",
            "Mr. Shahadat Hussain Parvez (SHP)",
          ],
        },
        {
          courseCode: "CSE-0613114",
          courseTitle: "Structured Programming Language Lab",
          credits: 1.5,
          courseTeachers: [
            "Mr. Sabuj Chandra Paul (SCP)",
            "Mr. Shahadat Hussain Parvez (SHP)",
          ],
        },
        {
          courseCode: "CSE-0613115",
          courseTitle: "Basic Electrical Engineering",
          credits: 3,
          courseTeachers: ["Mr. Pinok Chowdhury Manik (PCM)"],
        },
        {
          courseCode: "CSE-0613116",
          courseTitle: "Basic Electrical Engineering Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Shahadat Hussain Parvez (SHP)"],
        },
        {
          courseCode: "MAT-0541101",
          courseTitle: "Calculus",
          credits: 3,
          courseTeachers: ["Mr. Rathindra Chandra Gope (RCG)"],
        },
        {
          courseCode: "SSW-03141101",
          courseTitle: "History of the Emergence of Bangladesh",
          credits: 3,
          courseTeachers: ["Ms. Most. Sweety Khatun (MSK)"],
        },
      ],
    },
    {
      id: "spring-25-1-2",
      semesterName: "Spring-25 (1/2)",
      totalCredit: 21,
      advisorName: "Dr. Arif Ahmad (AAD)",
      courses: [
        {
          courseCode: "CSE-06131211",
          courseTitle: "Data Structures and Algorithms",
          credits: 3,
          courseTeachers: ["Ms. Muthmainna Mou (MM)"],
        },
        {
          courseCode: "CSE-06131212",
          courseTitle: "Data Structures and Algorithms Lab",
          credits: 1.5,
          courseTeachers: ["Ms. Muthmainna Mou (MM)"],
        },
        {
          courseCode: "CSE-06131213",
          courseTitle: "Electronic Devices and Circuits",
          credits: 3,
          courseTeachers: ["Mr. Pinok Chowdhury Manik (PCM)"],
        },
        {
          courseCode: "CSE-06131214",
          courseTitle: "Electronic Devices and Circuits Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Pinok Chowdhury Manik (PCM)"],
        },
        {
          courseCode: "MAT-05411203",
          courseTitle: "Linear Algebra",
          credits: 3,
          courseTeachers: ["Mr. Rathindra Chandra Gope (RCG)"],
        },
        {
          courseCode: "PHY-05331201",
          courseTitle: "Fundamentals of Physics",
          credits: 3,
          courseTeachers: ["Mr. Mazharul Islam (MI)"],
        },
        {
          courseCode: "ENG-02321201",
          courseTitle: "Advanced Functional English",
          credits: 3,
          courseTeachers: ["Ms. Bushra Jannat (BJ)"],
        },
        {
          courseCode: "SSW-03141202",
          courseTitle: "Bangladesh Studies",
          credits: 3,
          courseTeachers: ["Ms. Most. Sweety Khatun (MSK)"],
        },
      ],
    },
    {
      id: "fall-24-2-1",
      semesterName: "Fall-24 (2/1)",
      totalCredit: 19.5,
      advisorName: "Ms. Muthmainna Mou (MM)",
      courses: [
        {
          courseCode: "CSE-06132111",
          courseTitle: "Object Oriented Programming Language",
          credits: 3,
          courseTeachers: ["Mr. Khadem Mohammad Asif-uz-zaman (KMA)"],
        },
        {
          courseCode: "CSE-06132112",
          courseTitle: "Object Oriented Programming Language Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Khadem Mohammad Asif-uz-zaman (KMA)"],
        },
        {
          courseCode: "CSE-06132113",
          courseTitle: "Algorithm Design and Analysis",
          credits: 3,
          courseTeachers: ["Dr. Arif Ahmad (AAD)"],
        },
        {
          courseCode: "CSE-06132114",
          courseTitle: "Algorithm Design and Analysis Lab",
          credits: 1.5,
          courseTeachers: ["Dr. Arif Ahmad (AAD)"],
        },
        {
          courseCode: "CSE-0613213",
          courseTitle: "Electronic Devices and Circuits",
          credits: 3,
          courseTeachers: ["Mr. Pinok Chowdhury Manik (PCM)"],
        },
        {
          courseCode: "CSE-0613214",
          courseTitle: "Electronic Devices and Circuits Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Pinok Chowdhury Manik (PCM)"],
        },
        {
          courseCode: "STA-05422101",
          courseTitle: "Basic Statistics and Probability",
          credits: 3,
          courseTeachers: ["Mr. Moammad Salah Uddin (MSU)"],
        },
        {
          courseCode: "BUS-04112101",
          courseTitle: "Principles of Accounting",
          credits: 3,
          courseTeachers: ["Md Ohiduzzaman Anik (MOA)"],
        },
      ],
    },
    {
      id: "spring-24-2-2",
      semesterName: "Spring-24 (2/2)",
      totalCredit: 21,
      advisorName: "Dr. Arif Ahmad (AAD)",
      courses: [
        {
          courseCode: "CSE-06132211",
          courseTitle: "Introduction to Database Systems",
          credits: 3,
          courseTeachers: ["Mr. Razorshi Prozzwal Talukder (RPT)"],
        },
        {
          courseCode: "CSE-06132212",
          courseTitle: "Introduction to Database Systems Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Razorshi Prozzwal Talukder (RPT)"],
        },
        {
          courseCode: "CSE-06132213",
          courseTitle: "Operating System",
          credits: 3,
          courseTeachers: ["Mr. Khadem Mohammad Asif-uz-zaman (KMA)"],
        },
        {
          courseCode: "CSE-06132214",
          courseTitle: "Operating System Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Khadem Mohammad Asif-uz-zaman (KMA)"],
        },
        {
          courseCode: "CSE-06132215",
          courseTitle: "Theory of Computation",
          credits: 3,
          courseTeachers: ["Mr. Sourov Roy Shuvo (SRS)"],
        },
        {
          courseCode: "CSE-06132217",
          courseTitle: "Numerical Analysis",
          credits: 3,
          courseTeachers: ["Mr. Pritom Paul (PRP)"],
        },
        {
          courseCode: "CSE-06132218",
          courseTitle: "Numerical Analysis Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Pritom Paul (PRP)"],
        },
        {
          courseCode: "CSE-06132220",
          courseTitle: "Project Work I",
          credits: 1.5,
          courseTeachers: ["Mr. Khadem Mohammad Asif-uz-zaman (KMA)"],
        },
        {
          courseCode: "MAT-05412205",
          courseTitle:
            "Complex Variables, Laplace Transform and Fourier Series",
          credits: 3,
          courseTeachers: ["Mr. Moammad Salah Uddin (MSU)"],
        },
      ],
    },
    {
      id: "summer-23-3-1",
      semesterName: "Summer-23 (3/1)",
      totalCredit: 21,
      advisorName: "Mr. Shahadat Hussain Parvez (SHP)",
      courses: [
        {
          courseCode: "CSE-06133111",
          courseTitle: "Computer Networks",
          credits: 3,
          courseTeachers: ["Mr. Sourov Roy Shuvo (SRS)"],
        },
        {
          courseCode: "CSE-06133112",
          courseTitle: "Computer Networks Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Sourov Roy Shuvo (SRS)"],
        },
        {
          courseCode: "CSE-06133113",
          courseTitle: "Software Engineering and Design Patterns",
          credits: 3,
          courseTeachers: ["Mr. Pritom Paul (PRP)"],
        },
        {
          courseCode: "CSE-06133114",
          courseTitle: "Software Engineering and Design Patterns Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Pritom Paul (PRP)"],
        },
        {
          courseCode: "CSE-06133115",
          courseTitle: "Artificial Intelligence",
          credits: 3,
          courseTeachers: ["Mr. Razorshi Prozzwal Talukder (RPT)"],
        },
        {
          courseCode: "CSE-06133116",
          courseTitle: "Artificial Intelligence Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Razorshi Prozzwal Talukder (RPT)"],
        },
        {
          courseCode: "CSE-06133117",
          courseTitle: "Microprocessor and Interfacing",
          credits: 3,
          courseTeachers: ["Mr. Shahadat Hussain Parvez (SHP)"],
        },
        {
          courseCode: "CSE-06133118",
          courseTitle: "Microprocessor and Interfacing Lab",
          credits: 1.5,
          courseTeachers: ["Mr. Shahadat Hussain Parvez (SHP)"],
        },
        {
          courseCode: "CSE-06133119",
          courseTitle: "Data Communication",
          credits: 3,
          courseTeachers: ["Md. Jahidul Islam (MJI)"],
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8 px-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {" "}
      {/* Added subtle background */}
      <div className="flex flex-col gap-2 text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-3">
          <GraduationCap className="w-9 h-9 text-blue-600 dark:text-blue-400" />
          Department of CSE; Course Offer List
        </h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive overview of courses offered by semester and assigned
          advisors.
        </p>
      </div>
      {/* Using a responsive grid with `items-start` for a masonry-like effect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-start">
        {dummySemesterData.map((semester) => (
          <SemesterCourseBlock key={semester.id} data={semester} />
        ))}
      </div>
    </div>
  );
}
