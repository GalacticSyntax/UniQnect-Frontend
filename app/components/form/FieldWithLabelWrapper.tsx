import clsx from "clsx";
import { Label } from "~/components/ui/label";
import FieldWrapper from "~/components/form/FieldWrapper";
import type { FieldInterface } from "~/components/form/BatManForm";

interface FieldWithLabelWrapperProps {
  field: FieldInterface;
  children: React.ReactNode;
}
const FieldWithLabelWrapper = ({
  field,
  children,
}: FieldWithLabelWrapperProps) => {
  return (
    <FieldWrapper key={field.name}>
      <Label
        htmlFor={field.name}
        className={clsx("relative", {
          "before:content-['*'] before:absolute top-0 left-0 before:-translate-x-full before:-translate-y-1 before:text-xs":
            field.required,
        })}
      >
        {field.label}:
      </Label>
      {children}
    </FieldWrapper>
  );
};

export default FieldWithLabelWrapper;
