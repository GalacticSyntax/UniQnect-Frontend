import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AlignType } from "~/components/form/BatManForm";
import BatManForm from "~/components/form/BatManForm";
import { axiosClient } from "~/lib/apiClient";

const formSchema = {
  title: {
    label: "Add new teacher",
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
        name: "teacherId",
        label: "Teacher Id",
        placeholder: "Teacher Id",
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
    {
      type: "select",
      name: "designation",
      label: "Designation",
      placeholder: "Designation",
      options: [
        { id: "professor", value: "Professor" },
        { id: "associate_professor", value: "Associate Professor" },
        { id: "assistant_professor", value: "Assistant Professor" },
        { id: "senior_lecturer", value: "Senior Lecturer" },
        { id: "lecturer", value: "Lecturer" },
        { id: "teaching_assistant", value: "Teaching Assistant" },
        { id: "chancellor", value: "Chancellor" },
        { id: "vice_chancellor", value: "Vice Chancellor" },
        { id: "pro_vice_chancellor", value: "Pro Vice Chancellor" },
        { id: "head_of_department", value: "Head of Department" },
        { id: "program_coordinator", value: "Program Coordinator" },
        { id: "course_advisor", value: "Course Advisor" },
      ],
      className: "w-full",
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

const AddTeacher = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    try {
      const response = await axiosClient.post("/user", {
        ...formData,
        role: "teacher",
      });

      const data = await response.data;
      setLoader(false);

      toast("Teacher added", {
        description: `${data?.data?.name} teacher added successfully`,
      });

      navigate("/dashboard/teacher");
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
    <section className="w-full h-full grid place-items-center p-5">
      <BatManForm
        formSchema={formSchema}
        onSubmit={handleFormSubmit}
        className="max-w-3xl"
      />
    </section>
  );
};

export default AddTeacher;
