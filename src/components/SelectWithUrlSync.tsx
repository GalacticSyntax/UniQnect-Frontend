import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router";
import useModifyQueryParams from "@/hooks/use-modify-query-params";

const SelectWithUrlSync = ({
  list,
  value,
  onChange,
}: {
  list: Array<{
    value: string;
    label: string;
  }>;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  const [serchParams, setSearchParams] = useSearchParams();
  const activeValue = serchParams.get("searchFields");
  const { modifyParams } = useModifyQueryParams();

  const handleChange = (value: string) => {
    if (value === "clear")
      return setSearchParams(modifyParams("delete", "searchFields"));

    setSearchParams(modifyParams("set", "searchFields", value ?? activeValue));

    if (onChange) onChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="searchType" className="flex-shrink-0">
        Search by
      </Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger id="searchType" className="max-w-[180px]">
          <SelectValue placeholder="Search by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {list.map(({ value, label }) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
            <SelectItem value={"clear"}>Clear</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectWithUrlSync;
