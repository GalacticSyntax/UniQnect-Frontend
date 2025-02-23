import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AlignType } from "~/components/form/BatManForm";
import BatManForm from "~/components/form/BatManForm";
import PrivateRoute from "~/components/PrivateRoute";
import { axiosClient } from "~/lib/apiClient";

const formSchema = {
  title: {
    label: "Add new department",
    align: "center" as AlignType,
  },
  fields: [
    {
      type: "text",
      name: "name",
      label: "Name",
      placeholder: "Name",
      required: true,
    },
    {
      type: "text",
      name: "code",
      label: "Department Code",
      placeholder: "Department Code",
      required: true,
    },
    {
      type: "text",
      name: "schoolId",
      label: "School Code",
      placeholder: "School Code",
      required: true,
    },
    {
      type: "reset",
      name: "reset",
      label: "Clear",
      className: "w-fit",
    },
    {
      type: "submit",
      name: "submit",
      label: "Add",
    },
  ],
};

const AddDepartment = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    try {
      const response = await axiosClient.post("/department", {
        ...formData,
      });

      const data = await response.data;
      setLoader(false);

      toast("Department Created", {
        description: `${data?.data?.name} department created`,
      });

      navigate("/dashboard/department");
    } catch (error: unknown) {
      setLoader(false);
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  return (
    <PrivateRoute>
      <section className="w-full h-full grid place-items-center p-5">
        <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit} />
      </section>
    </PrivateRoute>
  );
};

export default AddDepartment;
