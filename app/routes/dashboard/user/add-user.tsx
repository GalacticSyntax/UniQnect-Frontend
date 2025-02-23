import BatManForm, { type AlignType } from "~/components/form/BatManForm";
import PrivateRoute from "~/components/PrivateRoute";

const formSchema = {
  title: {
    label: "Add new user",
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
      type: "password",
      name: "password",
      label: "Password",
      placeholder: "Password",
      required: true,
    },
    [
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
        required: true,
      },
      {
        type: "select",
        name: "role",
        label: "Role",
        placeholder: "Role",
        options: [
          {
            id: "student",
            value: "Student",
          },
          {
            id: "teacher",
            value: "Teacher",
          },
          {
            id: "admission_office",
            value: "Admission Office",
          },
        ],
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

const AddUser = () => {
  const handleFormSubmit = (formData: Record<string, unknown>) => {
    console.log(formData);
  };

  return (
    <PrivateRoute>
      <section className="w-full h-full grid place-items-center p-5">
        <BatManForm formSchema={formSchema} onSubmit={handleFormSubmit} />
      </section>
    </PrivateRoute>
  );
};

export default AddUser;
