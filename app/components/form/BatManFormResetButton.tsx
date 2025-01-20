import { Button } from "~/components/ui/button";
import type { FieldInterface } from "~/components/form/BatManForm";
import clsx from "clsx";

interface BatManFormResetButtonProps {
  field: FieldInterface;
  onClear?: () => void;
}

const BatManFormResetButton = ({
  field,
  onClear,
}: BatManFormResetButtonProps) => {
  return (
    <Button
      variant={"ghost"}
      className={clsx("w-full ml-auto", field.className)}
      type={"reset"}
      onClick={onClear}
    >
      {field.label}
    </Button>
  );
};

export default BatManFormResetButton;
