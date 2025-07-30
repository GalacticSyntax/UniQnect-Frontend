import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/provider/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import { GalleryVerticalEnd } from "lucide-react";

const ChangePassword = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const {
    // login,
    user,
  } = useAuth(); // Get login function from context
  // State to hold all form data
  const [formData, setFormData] = useState({
    password: "",
    email: user?.email ? user.email : "",
  });
  const navigate = useNavigate();

  // Handle input change for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the corresponding field
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the login logic here, e.g., call an API

    try {
      const response = await axiosClient.post("/auth/changePassword", {
        ...formData,
      });

      const data = await response?.data?.data;

      console.log({ data });

      if (!data) return null;

      toast("Password Changed successfully", {
        description: `Password Changed successfully`,
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  return (
    <PrivateRoute>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium text-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-6" />
            </div>
            UniQnect
          </Link>
          <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-6">
                    <div className="grid gap-6">
                      <Input
                        hidden
                        className="hidden"
                        id="password"
                        name="password" // Use the name attribute for state updates
                        type="password"
                        required
                        value={formData.password} // Sync with state // Handle change
                      />
                      <div className="grid gap-2">
                        <div className="flex items-center">
                          <Label htmlFor="password">New Password</Label>
                        </div>
                        <Input
                          id="password"
                          name="password" // Use the name attribute for state updates
                          type="password"
                          required
                          value={formData.password} // Sync with state
                          onChange={handleChange} // Handle change
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Change Now
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ChangePassword;
