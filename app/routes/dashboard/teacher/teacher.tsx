import type { Route } from "./+types/teacher";

import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { teacherList } from "~/data/generateTeacher";
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
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Label } from "~/components/ui/label";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const rowSizeList = ["10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "fullName",
    label: "Full Name",
    sortable: true,
  },
  {
    id: "teacherId",
    label: "Id",
    sortable: true,
  },
  {
    id: "designation",
    label: "Designation",
  },
  {
    id: "department",
    label: "Department",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    sortable: true,
  },
  {
    id: "phone",
    label: "Phone Number",
    sortable: true,
  },
  {
    id: "image",
    label: "Profile Picture",
    center: true,
  },
  {
    id: "gender",
    label: "Gender",
  },
];

const TeacherPage = () => {
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
        <h1 className="text-2xl font-bold">Teacher list</h1>
        <Link to="/dashboard/teacher/add-teacher">
          <Button>
            <Plus /> Add New Teacher
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
                <SelectItem value="teacherId">Teacher Id</SelectItem>
                <SelectItem value="designation">Designation</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone number</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="department">Department</SelectItem>
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
            placeholder="Search teacher"
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
                  {header.map(({ id, label, sortable, center }) => (
                    <TableActionHead
                      key={id}
                      sortable={sortable}
                      center={center}
                      className="capitalize whitespace-nowrap"
                    >
                      {label}
                    </TableActionHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherList
                  .slice(0, 100)
                  .map(
                    ({
                      fullName,
                      teacherId,
                      designation,
                      department,
                      email,
                      phone,
                      image,
                      gender,
                    }) => (
                      <TableRow
                        key={teacherId}
                        className="hover:bg-gray-200/60 duration-100 transition-all"
                      >
                        <TableCell className="font-medium">
                          {fullName}
                        </TableCell>
                        <TableCell className="font-medium">
                          {teacherId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {designation}
                        </TableCell>
                        <TableCell className="font-medium">
                          {department}
                        </TableCell>
                        <TableCell>{email}</TableCell>
                        <TableCell>{phone}</TableCell>
                        <TableCell className="text-right">
                          <img
                            src={image}
                            alt=""
                            className="size-9 rounded-full object-cover mx-auto select-none"
                          />
                        </TableCell>
                        <TableCell>{gender}</TableCell>
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

export default TeacherPage;
