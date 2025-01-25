import { Copy, X } from "lucide-react";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useToast } from "~/hooks/use-toast";

const ProfileDetails = () => {
  const { toast } = useToast();
  const detailsList = useMemo(
    () => [
      {
        id: "name",
        label: "Name",
        value: "John Doe",
      },
      {
        id: "gender",
        label: "Gender",
        value: "Male",
      },
      {
        id: "email",
        label: "Email",
        value: "email@gmail.com",
        copy: true,
      },
      {
        id: "phone",
        label: "Phone Number",
        value: "12345678910",
        copy: true,
      },
      {
        id: "studentId",
        label: "Student ID",
        value: "210303020005",
        copy: true,
      },
      {
        id: "department",
        label: "Department",
        value: "CSE",
      },
      {
        id: "semester",
        label: "Semester",
        value: "8th",
      },
      {
        id: "presentAddress",
        label: "Present Address",
        value: `House No. 24, Block C, Shahjalal University Road, Sylhet-3100, Bangladesh.
This address is situated in a residential area near the Shahjalal University campus, offering easy access to local markets, cafes, and public transport. The area is peaceful and ideal for students and professionals alike. There is a nearby park for relaxation and jogging, and the region is well-connected to the city's main roads.`,
      },
      {
        id: "permanentAddress",
        label: "Permanent Address",
        value: `Flat 2B, Green Valley Tower, Zindabazar, Sylhet-3100, Bangladesh.
Located in a bustling commercial area, this address is close to shopping malls, restaurants, and office buildings. Zindabazar is one of the busiest areas in Sylhet, providing convenience for both work and leisure activities. The building is well-maintained, with modern amenities like a gym and parking space for residents.`,
      },
    ],
    []
  );

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);

    toast({
      title: `${key} coppied to clipboard`,
    });
  };

  return (
    <div className="shadow-lg p-5 rounded-md overflow-hidden border">
      <div>
        <h1 className="inline-block text-2xl font-bold mb-4 pr-3 uppercase relative before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:right-0 before:translate-x-full before:w-24 before:h-1 before:bg-primary">
          Info:
        </h1>
      </div>
      <TooltipProvider>
        <ul className="flex flex-col">
          {detailsList.map(({ id, label, value, copy }) => (
            <li key={id} className={"flex gap-2 text-sm sm:text-base"}>
              <p className={"flex-shrink-0 w-28 sm:min-w-44 py-2"}>{label}:</p>
              {copy ? (
                <div className="flex items-center gap-2 rounded-sm py-1">
                  <p className="leading-relaxed">{value}</p>
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
                <p className="py-2 leading-relaxed">{value}</p>
              )}
            </li>
          ))}
        </ul>
      </TooltipProvider>
    </div>
  );
};

export default ProfileDetails;
