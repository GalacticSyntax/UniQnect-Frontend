import { Button } from "@/components/ui/button";
import type { FieldInterface } from "@/components/form/BatManForm";
import clsx from "clsx";

interface BatManFormSubmitButtonProps {
  field: FieldInterface;
}

const BatManFormSubmitButton = ({ field }: BatManFormSubmitButtonProps) => {
  return (
    <Button className={clsx("w-full", field.className)} type="submit">
      {field.label}
    </Button>
  );
};

export default BatManFormSubmitButton;
