import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "recharts";
import { useAuth } from "@/provider/AuthProvider";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";

interface User {
  fullName: string;
  email: string;
  phone: string;
  presentAddress: string;
  permanentAddress: string;
}

const EditProfile = () => {
  const { user: localUserData } = useAuth();
  // const [user, setUser] = useState<User | null>(null);
  const [, setLoading] = useState(true);
  const [formData, setFormData] = useState<User>({
    fullName: "",
    email: "",
    phone: "",
    presentAddress: "",
    permanentAddress: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosClient(
          `/user/${localUserData?._id as string}`
        ); // Use the actual API endpoint here
        const data = await response.data;
        if (data.success) {
          const user = data.data;

          const userRole = user.role
            ? user.role
            : user.teacherId
            ? "teacher"
            : user.studentId
            ? "student"
            : "Admission officer";

          const newData: Partial<User> = {};
          newData.fullName =
            userRole === "student" || userRole === "teacher"
              ? user?.userId?.fullName
              : user.fullName;
          newData.email =
            userRole === "student" || userRole === "teacher"
              ? user?.userId?.email
              : user.email;
          newData.phone =
            userRole === "student" || userRole === "teacher"
              ? user?.userId?.phone
              : user.phone;
          newData.presentAddress =
            (userRole === "student" || userRole === "teacher"
              ? user?.userId?.presentAddress
              : user.presentAddress) ?? "";
          newData.permanentAddress =
            (userRole === "student" || userRole === "teacher"
              ? user?.userId?.permanentAddress
              : user.permanentAddress) ?? "";

          setFormData(newData as User);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosClient.patch(`/user/${localUserData?._id}`, {
        ...formData,
      });

      // const data =
      await response.data;

      toast("Update successfully", {
        description: `Information updated successfully`,
      });
      console.log("===================")
    } catch (error: unknown) {
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
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
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Edit your profile details below.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <Label>Full Name</Label>

                <Input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>

                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Present Address</Label>
                  <Textarea
                    name="presentAddress"
                    value={formData.presentAddress}
                    onChange={handleChange}
                    placeholder="Present Address"
                    className="h-24 max-h-24"
                  />
                </div>

                <div>
                  <Label>Permanent Address</Label>
                  <Textarea
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="Permanent Address"
                    className="h-24 max-h-24"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
