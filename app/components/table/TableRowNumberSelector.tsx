import React, { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Label } from "~/components/ui/label";
import useModifyQueryParams from "~/hooks/use-modify-query-params";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface TableRowNumberSelectorProps {
  rowSizeList?: Array<string>;
  label?: string;
}

const TableRowNumberSelector = ({
  rowSizeList = ["10", "30", "50", "100"],
  label = "Row Per Page",
}: TableRowNumberSelectorProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { modifyParams } = useModifyQueryParams();

  const size = useMemo(
    () => searchParams.get("size") || rowSizeList[0],
    [searchParams]
  );

  const handlePageChange = (size: string) => {
    if (!rowSizeList.includes(size)) return;

    // Get the updated query params URL
    const updatedUrl = modifyParams("set", "size", size.toString());

    // Update the URL with the new page query parameter
    setSearchParams(updatedUrl);
  };
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {label && <Label className="capitalize">{label}:</Label>}
      <Select defaultValue={size} onValueChange={handlePageChange}>
        <SelectTrigger className="w-fit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {rowSizeList.map((rowSize) => (
              <SelectItem key={rowSize} value={rowSize}>
                {rowSize}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TableRowNumberSelector;
