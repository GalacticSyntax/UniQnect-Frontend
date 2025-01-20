import { Button } from "~/components/ui/button";
import type { FieldInterface } from "~/components/form/BatManForm";
import clsx from "clsx";

interface BatManFormResetButtonProps {
  field: FieldInterface;
}

const BatManFormResetButton = ({ field }: BatManFormResetButtonProps) => {
  return (
    <Button
      variant={"ghost"}
      className={clsx("w-full ml-auto", field.className)}
      type={"reset"}
    >
      {field.label}
    </Button>
  );
};

export default BatManFormResetButton;
