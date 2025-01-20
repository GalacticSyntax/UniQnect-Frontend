import clsx from "clsx";
import React from "react";

interface FieldWrapperProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const FieldWrapper = ({ children, className, ...props }: FieldWrapperProps) => {
  return (
    <div className={clsx("flex flex-col gap-3", className)} {...props}>
      {children}
    </div>
  );
};

export default FieldWrapper;
