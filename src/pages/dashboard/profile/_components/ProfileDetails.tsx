import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";

const calculateSemester = (admittedAt: string): number => {
  const admissionDate = new Date(admittedAt); // Parse the admittedAt date string into a Date object
  const currentDate = new Date(); // Get the current date
  const diffTime = Math.abs(currentDate.getTime() - admissionDate.getTime()); // Calculate the time difference in milliseconds
  const diffMonths = Math.floor(diffTime / (1000 * 3600 * 24 * 30)); // Convert time difference to months

  // Calculate the semester (each semester is 6 months)
  const semester = Math.floor(diffMonths / 6) + 1; // Round down and add 1 to ensure the correct semester is returned

  return semester;
};

interface User {
  [x: string]: unknown;
  fullName: string;
  email: string;
  isVerified: boolean;
  image: string;
  role: string;
  department: string;
  semester: string;
  session: string;
  presentAddress: string;
  permanentAddress: string;
}

const ProfileDetails = () => {
  const { toast } = useToast();
  const { user: localUserData } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  //   const detailsList = useMemo(
  //     () => [
  //       {
  //         id: "name",
  //         label: "Name",
  //         value: "John Doe",
  //       },
  //       {
  //         id: "gender",
  //         label: "Gender",
  //         value: "Male",
  //       },
  //       {
  //         id: "email",
  //         label: "Email",
  //         value: "email@gmail.com",
  //         copy: true,
  //       },
  //       {
  //         id: "phone",
  //         label: "Phone Number",
  //         value: "12345678910",
  //         copy: true,
  //       },
  //       {
  //         id: "studentId",
  //         label: "Student ID",
  //         value: "210303020005",
  //         copy: true,
  //       },
  //       {
  //         id: "department",
  //         label: "Department",
  //         value: "CSE",
  //       },
  //       {
  //         id: "semester",
  //         label: "Semester",
  //         value: "8th",
  //       },
  //       {
  //         id: "presentAddress",
  //         label: "Present Address",
  //         value: `House No. 24, Block C, Shahjalal University Road, Sylhet-3100, Bangladesh.
  // This address is situated in a residential area near the Shahjalal University campus, offering easy access to local markets, cafes, and public transport. The area is peaceful and ideal for students and professionals alike. There is a nearby park for relaxation and jogging, and the region is well-connected to the city's main roads.`,
  //       },
  //       {
  //         id: "permanentAddress",
  //         label: "Permanent Address",
  //         value: `Flat 2B, Green Valley Tower, Zindabazar, Sylhet-3100, Bangladesh.
  // Located in a bustling commercial area, this address is close to shopping malls, restaurants, and office buildings. Zindabazar is one of the busiest areas in Sylhet, providing convenience for both work and leisure activities. The building is well-maintained, with modern amenities like a gym and parking space for residents.`,
  //       },
  //     ],
  //     []
  //   );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient(
          `/user/${localUserData?._id as string}`
        ); // Use the actual API endpoint here
        const data = await response.data;
        if (data.success) {
          setUser(data.data);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);

    toast({
      title: `${key} coppied to clipboard`,
    });
  };

  if (!user) return <div>No user found</div>;

  const userRole = user.role
    ? user.role
    : user.teacherId
    ? "teacher"
    : user.studentId
    ? "student"
    : "Admission officer";

  const userFullName =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.fullName
      : user.fullName;

  const userGender =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.gender
      : user.gender;

  const userEmail =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.email
      : user.email;

  const userPhone =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.phone
      : user.phone;

  const studentId = userRole === "student" ? user?.studentId : null;
  const teacherId = userRole === "teacher" ? user?.teacherId : null;

  console.log(user);

  const userDepartment =
    userRole === "student" || userRole === "teacher"
      ? user?.departmentId?.name
      : "";

  const userSemester =
    userRole === "student" ? calculateSemester(user?.admittedAt) : "";

  const presentAddress =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.presentAddress
      : user?.presentAddress;

  const permanentAddress =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.permanentAddress
      : user?.permanentAddress;

  return (
    <div className="shadow-lg p-5 rounded-md overflow-hidden border">
      <div>
        <h1 className="inline-block text-2xl font-bold mb-4 pr-3 uppercase relative before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:translate-x-full before:w-24 before:h-1 before:bg-primary">
          Info:
        </h1>
      </div>
      <TooltipProvider>
        <ul className="flex flex-col">
          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>Full Name:</p>

            <p className="py-2 leading-relaxed col-span-8">{userFullName}</p>
          </li>
          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>Gender:</p>

            <p className="py-2 leading-relaxed col-span-8">{userGender}</p>
          </li>
          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>Email:</p>

            <div className="flex items-center gap-2 rounded-sm py-1  col-span-8">
              <p className="leading-relaxed">{userEmail}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => handleCopy("email", userEmail)}
                  >
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </li>
          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>Phone:</p>

            <div className="flex items-center gap-2 rounded-sm py-1  col-span-8">
              <p className="leading-relaxed">{userPhone}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"outline"}
                    onClick={() => handleCopy("Phone", userPhone)}
                  >
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={5}>
                  <p>Copy</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </li>
          {studentId && (
            <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
              <p className={"flex-shrink-0 py-2 col-span-4"}>Student Id:</p>

              <div className="flex items-center gap-2 rounded-sm py-1  col-span-8">
                <p className="leading-relaxed">{studentId}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => handleCopy("Student Id", studentId)}
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
          )}

          {teacherId && (
            <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
              <p className={"flex-shrink-0 py-2 col-span-4"}>Teacher Id:</p>

              <div className="flex items-center gap-2 rounded-sm py-1  col-span-8">
                <p className="leading-relaxed">{teacherId}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => handleCopy("Teacher Id", teacherId)}
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </li>
          )}

          {(userRole === "student" || userRole === "teacher") && (
            <>
              <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
                <p className={"flex-shrink-0 py-2 col-span-4"}>Department:</p>

                <p className="py-2 leading-relaxed col-span-8">
                  {userDepartment}
                </p>
              </li>
              <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
                <p className={"flex-shrink-0 py-2 col-span-4"}>Semester:</p>

                <p className="py-2 leading-relaxed col-span-8">
                  {userSemester}
                </p>
              </li>
            </>
          )}

          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>Present Address:</p>

            <p className="py-2 leading-relaxed col-span-8">{presentAddress}</p>
          </li>

          <li className={"text-sm sm:text-base grid grid-cols-12 gap-3"}>
            <p className={"flex-shrink-0 py-2 col-span-4"}>
              Permanent Address:
            </p>

            <p className="py-2 leading-relaxed col-span-8">
              {permanentAddress}
            </p>
          </li>
        </ul>
      </TooltipProvider>
    </div>
  );
};

/* 
{copy ? (
              <div className="flex items-center gap-2 rounded-sm py-1  col-span-8">
                <p className="leading-relaxed">{userFullName}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={() => handleCopy(label, value)}
                    >
                      <Copy />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={5}>
                    <p>Copy</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <p className="py-2 leading-relaxed col-span-8">{userFullName}</p>
            )}
*/

export default ProfileDetails;
