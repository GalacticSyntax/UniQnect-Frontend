import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import PrivateRoute from "~/components/PrivateRoute";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { axiosClient } from "~/lib/apiClient";

interface FormData {
  name: string;
  schoolId: string;
}

const AddSchool = () => {
  const { id: schoolId } = useParams();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    schoolId: schoolId ?? "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    handleGetSchoolData();
  }, [schoolId]);

  const handleGetSchoolData = async () => {
    try {
      const response = await axiosClient.get(`/school/${schoolId}`);

      const data = await response.data;

      if (!data || !data.data || !data.data.name) return navigate(-1);

      setFormData((prev) => ({ ...prev, name: data.data?.name }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosClient.patch(`/school/${schoolId}`, {
        name: formData.name,
      });

      const data = await response.data;

      console.log(data);

      if (!data || !data.data || !data.data.name) return navigate(-1);

      setFormData((prev) => ({ ...prev, name: data.data?.name }));

      toast("School updated", {
        description: `${schoolId} to ${data?.data?.name} school updated`,
      });
    } catch (error) {
      console.log(error);
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  return (
    <PrivateRoute>
      <Card className="max-w-lg mx-auto mt-10">
        <CardHeader>
          <CardTitle className="text-center">Update School</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <Label htmlFor="schoolId">Code</Label>
              <Input
                type="text"
                name="schoolId"
                placeholder="Code"
                value={formData.schoolId}
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

export default AddSchool;
