import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { Route } from "./+types/student";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { studenstList } from "~/data/generateStudents";
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
    id: "studentId",
    label: "Id",
    sortable: true,
  },
  {
    id: "department",
    label: "Department",
    sortable: true,
  },
  {
    id: "session",
    label: "Session",
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

const StudentPage = () => {
  const [loader, setLoader] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearcTerm] = useState("");

  useEffect(() => {
    fetchTeacherList();
  }, []);

  const fetchTeacherList = async () => {
    try {
      const response = await axiosClient.get("/student");

      const data = await response.data;

      if (!data || !data.data || !data.data.result) return;

      setStudentList((prev) => data.data?.result ?? []);

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
        <h1 className="text-2xl font-bold">Student list</h1>
        <Link to="/dashboard/student/add-student">
          <Button>
            <Plus /> Add New Student
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
                <SelectItem value="studentId">Student Id</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone number</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="session">Session</SelectItem>
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
            placeholder="Search student"
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
            <Table className="table-auto">
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
                {studentList.map(
                  ({
                    fullName,
                    email,
                    phone,
                    studentId,
                    image,
                    gender,
                    department,
                    session,
                  }) => (
                    <TableRow
                      key={studentId}
                      className="hover:bg-gray-200/60 duration-100 transition-all"
                    >
                      <TableCell className="font-medium">{fullName}</TableCell>
                      <TableCell className="font-medium">{studentId}</TableCell>
                      <TableCell className="font-medium">
                        {department}
                      </TableCell>
                      <TableCell className="font-medium">{session}</TableCell>
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

export default StudentPage;
