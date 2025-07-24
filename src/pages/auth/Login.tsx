import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/provider/AuthProvider";
import PreventAuthRoute from "@/components/PreventAuthRoute";

const Login = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { login } = useAuth(); // Get login function from context
  // State to hold all form data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    formData["email"] = formData["email"].trim();
    formData["password"] = formData["password"].trim();

    try {
      const response = await axiosClient.post("/auth/login", {
        ...formData,
        role: "admission-office",
      });

      const data = await response?.data?.data;

      if (!data) return <h1>Hello</h1>;

      login(data.user);

      toast("Loggedin successfully", {
        description: `Loggedin successfully`,
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
    <PreventAuthRoute>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email" // Use the name attribute for state updates
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={formData.email} // Sync with state
                      onChange={handleChange} // Handle change
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
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
                    Login
                  </Button>
                  {/* <a
                  href="#"
                  className="text-sm underline-offset-4 hover:underline text-center"
                >
                  Forgot your password?
                </a> */}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PreventAuthRoute>
  );
};

export default Login;
