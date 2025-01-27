import type { AlignType } from "~/components/form/BatManForm";
import BatManForm from "~/components/form/BatManForm";

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
      name: "code",
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
  const handleFormSubmit = (formData: Record<string, unknown>) => {
    console.log(formData);
  };

  return (
    <section className="w-full h-full grid place-items-center p-5">
      <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit} />
    </section>
  );
};

export default AddSchool;
