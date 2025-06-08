import BatManFormHeading from "@/components/form/BatManFormHeading";
import BatManFormInput from "@/components/form/BatManFormInput";
import BatManFormSubmitButton from "@/components/form/BatManFormSubmitButton";
import BatManFormSelect from "@/components/form/BatManFormSelect";
import BatManFormResetButton from "@/components/form/BatManFormResetButton";
import { useEffect, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import BatManFormTextArea from "@/components/form/BatManFormTextArea";

export interface FieldInterface {
  type?: string;
  name?: string;
  label?: string;
  readOnly?: boolean;
  disabled?: boolean;
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
}

interface BatManFormProps {
  formSchema: FormSchemaInterface;
  className?: string;
  onSubmit?: (formData: Record<string, unknown>) => void;
}

const BatManForm = ({ formSchema, className, onSubmit }: BatManFormProps) => {
  const [formState, setFormState] = useState<Record<string, unknown>>({});
  const [passwordToggleState, setPasswordToggleState] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const initialState: Record<string, unknown> = {};
    const initialPasswordToggleState: Record<string, boolean> = {};
    const initializeState = (fields: Array<FieldListType>) => {
      fields.forEach((field) => {
        if (Array.isArray(field)) {
          initializeState(field);
        } else if (field.name) {
          const defaultvalue =
            (field.defaultValue &&
            typeof field.defaultValue === "object" &&
            "value" in field.defaultValue
              ? field.defaultValue?.value
              : field.defaultValue) || "";
          initialState[field.name] = defaultvalue;

          if (field.type === "password")
            initialPasswordToggleState[field.name] = false;
        }
      });
    };
    initializeState(formSchema.fields);
    setFormState(initialState);
    setPasswordToggleState(initialPasswordToggleState);
  }, [formSchema.fields]);

  const handleTogglePassword = (name: string) => {
    setPasswordToggleState((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleClearForm = () => {
    const initialFormState = { ...formState };
    for (const name in formState) {
      initialFormState[name] = "";
    }

    setFormState(initialFormState);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (newValue: string, name: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formState);

    if (onSubmit) {
      onSubmit(formState);
    }
  };

  const renderFields = (fields: Array<FieldListType>): React.ReactNode => {
    return fields.map((field, index) => {
      if (Array.isArray(field)) {
        // Render nested fields
        return (
          <div
            key={index}
            className={cn("grid gap-4", {
              "sm:grid-cols-1": field.length === 1,
              "sm:grid-cols-2": field.length === 2,
              "sm:grid-cols-3": field.length === 3,
              "sm:grid-cols-4": field.length === 5,
              "sm:grid-cols-5": field.length === 4,
              "sm:grid-cols-6": field.length === 6,
            })}
          >
            {renderFields(field)}
          </div>
        );
      } else if (field?.type === "text" || !field.type) {
        return (
          <BatManFormInput
            key={field.name}
            field={field}
            onChange={handleInputChange}
            value={formState[field.name as string]}
          />
        );
      } else if (field?.type === "email") {
        return (
          <BatManFormInput
            key={field.name}
            field={field}
            onChange={handleInputChange}
            value={formState[field.name as string]}
          />
        );
      } else if (field?.type === "password") {
        return (
          <BatManFormInput
            onToggleHide={handleTogglePassword}
            key={field.name}
            field={field}
            passwordHideState={passwordToggleState[field.name as string]}
            onChange={handleInputChange}
            value={formState[field.name as string]}
          />
        );
      } else if (field?.type === "submit") {
        return <BatManFormSubmitButton key={field.name} field={field} />;
      } else if (field?.type === "reset") {
        return (
          <BatManFormResetButton
            key={field.name}
            field={field}
            onClear={handleClearForm}
          />
        );
      } else if (field?.type === "select") {
        return (
          <BatManFormSelect
            key={field.name}
            field={field}
            value={formState[field.name as string]}
            onChange={handleSelectChange}
          />
        );
      } else if (field?.type === "textarea") {
        return (
          <BatManFormTextArea
            key={field.name}
            field={field}
            value={formState[field.name as string]}
            onChange={handleInputChange}
          />
        );
      }
      return null;
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn(
        "w-full max-w-md px-6 py-6 border rounded-md flex flex-col gap-4",
        className
      )}
    >
      {formSchema.title && <BatManFormHeading {...formSchema.title} />}
      {renderFields(formSchema.fields)}
    </form>
  );
};

export default BatManForm;
