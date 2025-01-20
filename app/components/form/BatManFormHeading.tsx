import clsx from "clsx";
import type { TitleInterface } from "~/components/form/BatManForm";

interface BatManFormHeadingProps extends TitleInterface {
  className?: string;
  [key: string]: unknown;
}

const BatManFormHeading = ({
  label,
  align,
  className,
  ...props
}: BatManFormHeadingProps) => {
  return (
    <h1
      className={clsx(
        "text-2xl font-bold pb-2",
        {
          "text-center": !align || align === "center",
          "text-left": align === "left",
          "text-right": align === "right",
        },
        className
      )}
      {...props}
    >
      {label}
    </h1>
  );
};

export default BatManFormHeading;
