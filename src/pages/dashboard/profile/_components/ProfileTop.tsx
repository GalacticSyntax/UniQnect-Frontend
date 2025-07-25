import { useEffect } from "react";
import { BadgeCheck, BadgeX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ProfileImageEditor from "./ProfileImageEditor";
import { useAuth } from "@/provider/AuthProvider";
import { BACKEND_BASE_URL } from "@/constant";
import { useProfile } from "../ProfileProvider";

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
}

const calculateSemester = (admittedAt: string): number => {
  const admissionDate = new Date(admittedAt); // Parse the admittedAt date string into a Date object
  const currentDate = new Date(); // Get the current date
  const diffTime = Math.abs(currentDate.getTime() - admissionDate.getTime()); // Calculate the time difference in milliseconds
  const diffMonths = Math.floor(diffTime / (1000 * 3600 * 24 * 30)); // Convert time difference to months

  // Calculate the semester (each semester is 6 months)
  const semester = Math.floor(diffMonths / 6) + 1; // Round down and add 1 to ensure the correct semester is returned

  return semester;
};

const ProfileTop = () => {
  const { user: localUserData } = useAuth();
  const { user, fetchUserData, error, isLoading } = useProfile();

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!user) return <div>No user found</div>;

  const userRole = user.role
    ? user.role
    : user.teacherId
    ? "teacher"
    : user.studentId
    ? "student"
    : "admission-office";

  const userImage =
    BACKEND_BASE_URL +
    (userRole === "student" || userRole === "teacher"
      ? localUserData?.userId?.image
      : user.image);

  console.log({ userImage });

  const userFullName =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.fullName
      : user.fullName;

  const userIsVerified =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.isVerified
      : user.isVerified;

  const userDepartment =
    userRole === "student" || userRole === "teacher"
      ? user?.departmentId?.name
      : "";

  const userSemester =
    userRole === "student" ? calculateSemester(user?.admittedAt) : "";

  return (
    <div className="flex flex-col sm:flex-row gap-4 shadow-lg p-5 sm:py-8 bg-primary rounded-md overflow-hidden">
      <div className="w-full max-w-52 aspect-square rounded-md ring-2 ring-primary-foreground relative">
        <img
          src={userImage}
          alt="Profile Image"
          className="w-full h-full object-cover"
        />
        <EditProfileImageOverlay />
        <VerifyTag isVerified={userIsVerified} />
      </div>
      <div className="w-full flex flex-col gap-2 items-start text-primary-foreground selection:bg-primary-foreground selection:text-primary">
        <h2 className="text-2xl font-bold">{userFullName}</h2>
        <Badge variant={"secondary"}>{userRole}</Badge>
        <span className="py-1"></span>
        {(userRole === "student" || userRole === "teacher") && (
          <>
            <p>Department: {userDepartment}</p>
            {userRole === "student" && userSemester && (
              <>
                <p>Semester: {userSemester}</p>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface VerifyTagProps {
  isVerified: boolean;
}

const VerifyTag = ({ isVerified }: VerifyTagProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {isVerified ? (
            <span className="bg-green-500 text-white absolute bottom-0 right-0 z-10 rounded-full p-1 translate-x-2 translate-y-2">
              <BadgeCheck />
            </span>
          ) : (
            <span className="bg-red-500 text-white absolute bottom-0 right-0 z-10 rounded-full p-1 translate-x-2 translate-y-2">
              <BadgeX />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={3}
          className={cn({
            "bg-red-500": !isVerified,
            "bg-green-500": isVerified,
          })}
        >
          <p>{isVerified ? "verified" : "unverified"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const EditProfileImageOverlay = () => {
  return (
    <div className="absolute w-full h-full top-0 left-0 grid place-items-center duration-100 transition-colors bg-primary/50 opacity-0 hover:opacity-100 rounded-md">
      <ProfileImageEditor />
    </div>
  );
};

export default ProfileTop;
