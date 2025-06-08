import type { FieldInterface } from "@/components/form/BatManForm";
import FieldWithLabelWrapper from "@/components/form/FieldWithLabelWrapper";
import TextAreaField from "@/components/form/TextAreaField";

interface BatManFormTextAreaProps {
  field: FieldInterface;
  [key: string]: unknown;
}
const BatManFormTextArea = ({ field, ...props }: BatManFormTextAreaProps) => {
  if (!field.label) return <TextAreaField field={field} {...props} />;

  return (
    <FieldWithLabelWrapper field={field}>
      {field.type !== "password" && <TextAreaField field={field} {...props} />}
    </FieldWithLabelWrapper>
  );
};

export default BatManFormTextArea;
