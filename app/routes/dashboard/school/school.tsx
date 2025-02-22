import type { Route } from "./+types/school";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
// import { schoolList } from "~/data/generateSchools";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import UsersTableFooter from "~/components/table/TableFooter";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Label } from "~/components/ui/label";
import { axiosClient } from "~/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";

const rowSizeList = ["10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "name",
    label: "Name",
  },
  {
    id: "code",
    label: "Code",
  },
  {
    id: "number_of_departments",
    label: "Total departments",
    sortable: true,
  },
];

const SchoolPage = () => {
  const [loader, setLoader] = useState(false);
  const [schoolList, setSchoolList] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearcTerm] = useState("");

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await axiosClient.get("/school");

      const data = await response.data;

      setSchoolList((prev) => data?.data ?? []);

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

  const handleSearchTypeChange = (value: string) => {
    setSearchType(value);
  };

  const handleSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearcTerm(e.target.value);
  };

  const handleClearSearchTerm = () => {
    setSearcTerm("");
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="w-full max-w-6xl mx-auto p-5 flex flex-col gap-5">
      <section className="flex justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">School list</h1>
        <Link to="/dashboard/school/add-school">
          <Button>
            <Plus /> Add New School
          </Button>
        </Link>
      </section>
      <section className="flex justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="searchType" className="flex-shrink-0">
            Search by
          </Label>
          <Select value={searchType} onValueChange={handleSearchTypeChange}>
            <SelectTrigger id="searchType" className="max-w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="schoolId">Code</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <form
          className="flex rounded-sm border pl-3 ml-auto"
          onSubmit={handleSearch}
        >
          <input
            value={searchTerm}
            onChange={handleSearchTermChange}
            className="outline-none bg-transparent w-full"
            placeholder="Search school"
          />
          <div className="size-9">
            {searchTerm && (
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={handleClearSearchTerm}
              >
                <X />
              </Button>
            )}
          </div>
          <Button className="flex-shrink-0 rounded-l-none border">
            <Search />
          </Button>
        </form>
      </section>
      <section className="w-full flex flex-col gap-4">
        <div className="w-full overflow-auto">
          <ScrollArea className="">
            <Table>
              <TableHeader>
                <TableRow>
                  {header.map(({ id, label, sortable }) => (
                    <TableActionHead
                      key={id}
                      sortable={sortable}
                      className="capitalize whitespace-nowrap"
                    >
                      {label}
                    </TableActionHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolList.map(
                  ({ name, schoolId: code, number_of_departments }) => (
                    <TableRow
                      key={code}
                      className="hover:bg-gray-200/60 duration-100 transition-all"
                    >
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell className="font-medium">{code}</TableCell>
                      <TableCell className="font-medium">
                        {number_of_departments}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        {/*<UsersTableFooter rowSizeList={rowSizeList} totalPages={10} />*/}
      </section>
    </section>
  );
};

export default SchoolPage;
