import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AlignType } from "@/components/form/BatManForm";
import BatManForm from "@/components/form/BatManForm";
import PrivateRoute from "@/components/PrivateRoute";
import { axiosClient } from "@/lib/apiClient";

const formSchema = {
  title: {
    label: "Add new account officer",
    align: "center" as AlignType,
  },
  fields: [
    {
      type: "text",
      name: "fullName",
      label: "Full Name",
      placeholder: "Full Name",
      required: true,
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      placeholder: "Email",
      required: true,
    },
    {
      type: "text",
      name: "phone",
      label: "Phone number",
      placeholder: "Phone number",
      required: true,
    },
    {
      type: "select",
      name: "gender",
      label: "Gender",
      placeholder: "Gender",
      options: [
        {
          id: "male",
          value: "Male",
        },
        {
          id: "female",
          value: "Female",
        },
      ],
      className: "w-full",
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

const AddAccountOffice = () => {
  const [, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    try {
      const response = await axiosClient.post("/user", {
        ...formData,
        role: "admission-office",
      });

      const data = await response.data;
      setLoader(false);

      toast("Employeed added", {
        description: `${data?.data?.fullName} Employeed added successfully`,
      });

      navigate("/dashboard/account-office");
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
        <BatManForm
          formSchema={formSchema}
          onSubmit={handleFormSubmit}
          className="max-w-3xl"
        />
      </section>
    </PrivateRoute>
  );
};

export default AddAccountOffice;
