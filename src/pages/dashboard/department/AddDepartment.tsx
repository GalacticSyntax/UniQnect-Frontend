import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import { axiosClient } from "@/lib/apiClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const AddDepartment = () => {
  const [, setLoader] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    name: string;
    code: string;
    schoolId: string;
  }>({
    name: "",
    code: "",
    schoolId: "",
  });
  const [schoolList, setSchoolList] = useState<
    Array<
      {
        _id: string;
        name: string;
        schoolId: string;
      } & Record<string, unknown>
    >
  >([]);

  useEffect(() => {
    (async () => await fetchSchools())();
  }, []);

  console.log(schoolList);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSetSchoolId = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      schoolId: value,
    }));
  };

  const fetchSchools = async () => {
    try {
      const response = await axiosClient.get("/school");

      const data = await response.data;

      console.log(data);

      setSchoolList(() => data?.data ?? []);

      setLoader(false);
    } catch (error: unknown) {
      setLoader(false);
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await axiosClient.post("/department", {
        ...formData,
      });

      const data = await response.data;
      setLoader(false);

      toast("Department Created", {
        description: `${data?.data?.name} department created`,
      });

      navigate("/dashboard/department");
    } catch (error: unknown) {
      setLoader(false);
      toast("Error occure", {
        description: axios.isAxiosError(error)
          ? error?.response?.data?.message
          : "Something went wrong",
      });
    }
  };

  return (
    <PrivateRoute>
      <section className="w-full h-full grid place-items-center p-5">
        <form
          onSubmit={handleFormSubmit}
          className="w-full max-w-md px-6 py-6 border rounded-md flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold pb-2 text-center">
            Add new department
          </h1>
          <div className="flex flex-col gap-3">
            <label htmlFor="name">Name</label>
            <Input
              name="name"
              id="name"
              placeholder="Name"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="code">Code</label>
            <Input
              name="code"
              id="code"
              placeholder="Code"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="schoolId">School Id</label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {formData.schoolId
                    ? schoolList.find(
                        (school) => school.schoolId === formData.schoolId
                      )?.name
                    : "Select school..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search school..." />
                  <CommandList>
                    <CommandEmpty>No school found.</CommandEmpty>
                    <CommandGroup>
                      {schoolList.map((school) => (
                        <CommandItem
                          key={school.schoolId}
                          value={school.schoolId}
                          onSelect={(currentValue) => {
                            handleSetSchoolId(
                              currentValue === formData.schoolId
                                ? ""
                                : currentValue
                            );
                            setOpenCombobox(false);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.schoolId === school.schoolId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {school.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <Button variant={"ghost"} className="ml-auto" type={"reset"}>
            Reset
          </Button>
          <Button className="w-full" type="submit">
            Add
          </Button>
        </form>
      </section>
    </PrivateRoute>
  );
};

export default AddDepartment;
