import { Label } from "@/components/ui/label";
import FieldWrapper from "@/components/form/FieldWrapper";
import type { FieldInterface } from "@/components/form/BatManForm";
import { cn } from "@/lib/utils";

interface FieldWithLabelWrapperProps {
  field: FieldInterface;
  className?: string;
  children: React.ReactNode;
}
const FieldWithLabelWrapper = ({
  field,
  className,
  children,
}: FieldWithLabelWrapperProps) => {
  return (
    <FieldWrapper key={field.name}>
      <Label
        htmlFor={field.name}
        className={cn(
          "relative",
          {
            "before:content-['*'] before:absolute top-0 left-0 before:-translate-x-full before:-translate-y-1 before:text-xs":
              field.required,
          },
          className
        )}
      >
        {field.label}:
      </Label>
      {children}
    </FieldWrapper>
  );
};

export default FieldWithLabelWrapper;
