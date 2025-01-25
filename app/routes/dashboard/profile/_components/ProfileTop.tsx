import { BadgeCheck, BadgeX } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

const ProfileTop = () => {
  const profileImage =
    "https://scontent.fdac24-3.fna.fbcdn.net/v/t39.30808-6/325618153_754096169469617_5563270339517372522_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=xG6Hilk4XycQ7kNvgHKNDZc&_nc_zt=23&_nc_ht=scontent.fdac24-3.fna&_nc_gid=A4dHJC6sj8vIp482qrmxMBQ&oh=00_AYBtHDxc4X-Vqmv-bKhUA1QHfzsimAr7ab7qnwOK9yzQmA&oe=679A6BDC";

  const isVerified = true;

  return (
    <div className="flex flex-col sm:flex-row gap-4 shadow-lg p-5 bg-primary rounded-md overflow-hidden">
      <div className="w-full max-w-52 aspect-square rounded-md ring-2 ring-primary-foreground relative">
        <img src={profileImage} alt="" className="w-full h-full object-cover" />
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
      </div>
      <div className="w-full flex flex-col gap-2 items-start text-primary-foreground selection:bg-primary-foreground selection:text-primary">
        <h2 className="text-2xl font-bold">Md. Abdus Shohid Shakil</h2>
        <Badge variant={"secondary"}>Student</Badge>
        <span className="py-1"></span>
        <p>Department: CSE</p>
        <p>Semester: 8th</p>
        <p>Session: Fall-21</p>
      </div>
    </div>
  );
};

export default ProfileTop;
