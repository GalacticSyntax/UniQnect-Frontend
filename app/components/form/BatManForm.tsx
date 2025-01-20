import clsx from "clsx";
import BatManFormHeading from "~/components/form/BatManFormHeading";
import BatManFormInput from "~/components/form/BatManFormInput";
import BatManFormSubmitButton from "~/components/form/BatManFormSubmitButton";
import BatManFormSelect from "~/components/form/BatManFormSelect";
import BatManFormResetButton from "~/components/form/BatManFormResetButton";

export interface FieldInterface {
  type?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  defaultValue?:
    | {
        value: string;
        label?: string;
      }
    | unknown;
  options?: Array<{
    id: string;
    value: string;
  }>;
  required?: boolean;
  onChange?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  className?: string;
}

export type AlignType = "left" | "center" | "right";

type FieldListType = FieldInterface | Array<FieldListType>;

export interface TitleInterface {
  label: string;
  align: AlignType;
}

export interface FormSchemaInterface {
  title?: TitleInterface;
  fields: Array<FieldListType>;
  onSubmit?: () => void;
}

interface BatManFormProps {
  formSchema: FormSchemaInterface;
  className?: string;
}

const BatManForm = ({ formSchema, className }: BatManFormProps) => {
  const renderFields = (fields: Array<FieldListType>): React.ReactNode => {
    return fields.map((field, index) => {
      if (Array.isArray(field)) {
        // Render nested fields
        return (
          <div
            key={index}
            className={clsx("grid gap-4", {
              "grid-cols-1": field.length === 1,
              "grid-cols-2": field.length === 2,
              "grid-cols-3": field.length === 3,
              "grid-cols-4": field.length === 5,
              "grid-cols-5": field.length === 4,
              "grid-cols-6": field.length === 6,
            })}
          >
            {renderFields(field)}
          </div>
        );
      } else if (field?.type === "text" || !field.type) {
        return <BatManFormInput field={field} />;
      } else if (field?.type === "email") {
        return <BatManFormInput field={field} />;
      } else if (field?.type === "submit") {
        return <BatManFormSubmitButton field={field} />;
      } else if (field?.type === "reset") {
        return <BatManFormResetButton field={field} />;
      } else if (field?.type === "select") {
        return <BatManFormSelect field={field} />;
      }
      return null;
    });
  };

  return (
    <form
      className={clsx(
        "w-full max-w-md px-5 py-6 border rounded-md flex flex-col gap-4",
        className
      )}
    >
      {formSchema.title && <BatManFormHeading {...formSchema.title} />}
      {renderFields(formSchema.fields)}
    </form>
  );
};

export default BatManForm;
