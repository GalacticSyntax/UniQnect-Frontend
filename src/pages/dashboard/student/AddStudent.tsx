import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import type { AlignType } from "@/components/form/BatManForm";
import BatManForm from "@/components/form/BatManForm";
import PrivateRoute from "@/components/PrivateRoute";
import { axiosClient } from "@/lib/apiClient";

const formSchema = {
  title: {
    label: "Add new student",
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
    [
      {
        type: "text",
        name: "studentId",
        label: "Student Id",
        placeholder: "Student Id",
        required: true,
      },
      {
        type: "text",
        name: "departmentId",
        label: "Department Id",
        placeholder: "Department Id",
        required: true,
      },
    ],
    [
      {
        type: "text",
        name: "session",
        label: "Session",
        placeholder: "Session",
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
    ],
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

const AddStudent = () => {
  const [, setLoader] = useState(false);

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    try {
      const response = await axiosClient.post("/user", {
        ...formData,
        role: "student",
      });

      const data = await response.data;
      setLoader(false);

      toast("Student added", {
        description: `${data?.data?.fullName} student added successfully`,
      });

      // navigate("/dashboard/student");
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

export default AddStudent;
