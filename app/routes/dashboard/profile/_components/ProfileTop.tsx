import React, { useEffect, useState } from "react";
import { BadgeCheck, BadgeX } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import ProfileImageEditor from "./ProfileImageEditor";
import { axiosClient } from "~/lib/apiClient";
import { useAuth } from "~/provider/AuthProvider";

interface User {
  [x: string]: any;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  if (!user) return <div>No user found</div>;

  const userRole = user.role
    ? user.role
    : user.teacherId
    ? "teacher"
    : user.studentId
    ? "student"
    : "Admission officer";

  const userImage =
    userRole === "student" || userRole === "teacher"
      ? user?.userId?.image
      : user.image;

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

interface EditProfileImageOverlayProps {}

const EditProfileImageOverlay = ({}: EditProfileImageOverlayProps) => {
  return (
    <div className="absolute w-full h-full top-0 left-0 grid place-items-center duration-100 transition-colors bg-primary/50 opacity-0 hover:opacity-100 rounded-md">
      <ProfileImageEditor />
    </div>
  );
};

export default ProfileTop;
