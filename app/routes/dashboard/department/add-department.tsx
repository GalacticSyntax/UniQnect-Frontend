import type { AlignType } from "~/components/form/BatManForm";
import BatManForm from "~/components/form/BatManForm";

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
      label: "Code",
      placeholder: "Code",
      required: true,
    },
    {
      type: "select",
      name: "school",
      label: "School",
      placeholder: "School",
      options: [
        {
          id: "school_1",
          value: "School 1",
        },
        {
          id: "school_2",
          value: "School 2",
        },
        {
          id: "school_3",
          value: "School 3",
        },
        {
          id: "school_4",
          value: "School 4",
        },
        {
          id: "school_5",
          value: "School 5",
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

const AddDepartment = () => {
  const handleFormSubmit = (formData: Record<string, unknown>) => {
    console.log(formData);
  };

  return (
    <section className="w-full h-full grid place-items-center p-5">
      <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit} />
    </section>
  );
};

export default AddDepartment;
