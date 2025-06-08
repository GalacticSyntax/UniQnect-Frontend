import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import type { FieldInterface } from "@/components/form/BatManForm";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

interface PasswordFieldProps {
  field: FieldInterface;
  value?: string;
  passwordHideState?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleHide?: (name: string) => void;
}

const PasswordField = ({
  field,
  onChange = () => {},
  value,
  onToggleHide = () => {},
  passwordHideState,
}: PasswordFieldProps) => {
  const defaultvalue =
    (field.defaultValue &&
    typeof field.defaultValue === "object" &&
    "value" in field.defaultValue
      ? field.defaultValue?.value
      : field.defaultValue) || "";

  return (
    <div className="flex items-center">
      <Input
        id={field.name}
        name={field.name}
        type={passwordHideState ? "text" : "password"}
        placeholder={field.placeholder}
        required={field.required}
        className={clsx("rounded-r-none", field.className)}
        value={value || (defaultvalue as string)}
        onChange={onChange}
      />
      <Button
        size={"icon"}
        className="rounded-l-none"
        onClick={() => onToggleHide(field.name as string)}
        type="button"
      >
        {passwordHideState ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
};

export default PasswordField;
