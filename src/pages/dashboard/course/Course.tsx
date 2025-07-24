import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { coursesList } from "@/data/generateCourses";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Plus, Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UsersTableFooter from "@/components/table/TableFooter";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Label } from "@/components/ui/label";

const rowSizeList = ["10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "name",
    label: "Name",
    sortable: true,
  },
  {
    id: "code",
    label: "Code",
    sortable: true,
  },
  {
    id: "credit",
    label: "Credit",
    sortable: true,
  },
  {
    id: "department",
    label: "Department",
  },
  {
    id: "curriculum",
    label: "Curriculum",
  },
  {
    id: "prerequisites",
    label: "Prerequisites",
  },
];

const CoursePage = () => {
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearcTerm] = useState("");

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
        <h1 className="text-2xl font-bold">Courses list</h1>
        <Link to="/dashboard/course/add-course">
          <Button>
            <Plus /> Add New Course
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
                <SelectItem value="code">Code</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
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
            placeholder="Search Course"
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
                      id={id}
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
                {coursesList
                  .slice(0, 100)
                  .map(
                    ({
                      id,
                      name,
                      code,
                      credit,
                      department,
                      curriculum,
                      prerequisites,
                    }) => (
                      <TableRow
                        key={id}
                        className="hover:bg-gray-200/60 duration-100 transition-all"
                      >
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell>{code}</TableCell>
                        <TableCell>{credit}</TableCell>
                        <TableCell>{department}</TableCell>
                        <TableCell>{curriculum}</TableCell>
                        <TableCell>
                          {prerequisites.length ? prerequisites : "N/A"}
                        </TableCell>
                      </TableRow>
                    )
                  )}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
        <UsersTableFooter rowSizeList={rowSizeList} totalPages={10} />
      </section>
    </section>
  );
};

export default CoursePage;
