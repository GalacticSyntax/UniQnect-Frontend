import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AlignType } from "~/components/form/BatManForm";
import BatManForm from "~/components/form/BatManForm";
import { axiosClient } from "~/lib/apiClient";

const formSchema = {
  title: {
    label: "Add new school",
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
      name: "schoolId",
      label: "Code",
      placeholder: "Code",
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

const AddSchool = () => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    setLoader(true);

    try {
      const response = await axiosClient.post("/school", {
        ...formData,
      });

      const data = await response.data;
      setLoader(false);

      toast("School Created", {
        description: `${data?.data?.name} school created`,
      });

      navigate("/dashboard/school");
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
      <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit} />
    </section>
  );
};

export default AddSchool;
