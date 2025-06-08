import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosClient } from "@/lib/apiClient";

const EditDepartment = () => {
  const [, setLoader] = useState(false);
  const { id: code } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    code: code ?? "",
    schoolId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    handleGetSchoolData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const handleGetSchoolData = async () => {
    try {
      const response = await axiosClient.get(`/department/${code}`);

      const data = await response.data;

      if (!data || !data.data) return navigate(-1);

      console.log(data.data);

      setFormData((prev) => ({
        ...prev,
        name: data.data?.name,
        schoolId: data.data?.schoolId,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoader(true);

    try {
      // const response =
       await axiosClient.patch(`/department/${code}`, {
        name: formData.name,
      });

      // const data = await response.data;
      setLoader(false);

      toast("Department update", {
        description: `department updated successfully`,
      });
    } catch (error: unknown) {
      setLoader(false);
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <PrivateRoute>
      <Card className="max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-center">Update Department</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4 [&_label]:pb-2">
            {/* Name Field */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department Code Field */}
            <div>
              <Label htmlFor="code">Department Code</Label>
              <Input
                type="text"
                name="code"
                placeholder="Department Code"
                value={formData.code}
                onChange={handleChange}
                required
                readOnly
                disabled
              />
            </div>

            {/* School Code Field */}
            <div>
              <Label htmlFor="schoolId">School Code</Label>
              <Input
                type="text"
                name="schoolId"
                placeholder="School Code"
                value={formData.schoolId}
                onChange={handleChange}
                required
                readOnly
                disabled
              />
            </div>
            <Button type="submit" className="w-full">
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </PrivateRoute>
  );
};

export default EditDepartment;
