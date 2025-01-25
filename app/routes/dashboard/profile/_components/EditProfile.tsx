import { Button } from "~/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import BatManForm from "~/components/form/BatManForm";
import { ScrollArea } from "~/components/ui/scroll-area";

const EditProfile = () => {
  const formSchema = {
    fields: [
      {
        type: "text",
        name: "fullName",
        label: "Full Name",
        placeholder: "Full Name",
      },
      [
        {
          type: "email",
          name: "email",
          label: "Email",
          placeholder: "Email",
        },
        {
          type: "text",
          name: "phone",
          label: "Phone number",
          placeholder: "Phone number",
        },
      ],
      [
        {
          type: "textarea",
          name: "presentAddress",
          label: "Present Address",
          placeholder: "Present Address",
          className: "h-24 max-h-24",
        },
        {
          type: "textarea",
          name: "permanentAddress",
          label: "Permanent Address",
          placeholder: "Permanent Address",
          className: "h-24 max-h-24",
        },
      ],
      {
        type: "submit",
        name: "submit",
        label: "Save Changes",
      },
    ],
  };
  const handleFormSubmit = (formData: Record<string, unknown>) => {
    console.log(formData);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"icon"} className="fixed bottom-4 right-4">
                  <Pencil />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Edit Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
      </DialogTrigger>
      <DialogContent className="w-[90%] max-h-[90vh] max-w-3xl overflow-hidden overflow-y-auto">
        <ScrollArea className="w-full h-full">
          <div className="px-1">
            <DialogHeader className="pb-5">
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>Edit your profile</DialogDescription>
            </DialogHeader>

            <BatManForm
              className="border-none w-full max-w-full px-0 py-0"
              formSchema={formSchema}
              onSubmit={handleFormSubmit}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
