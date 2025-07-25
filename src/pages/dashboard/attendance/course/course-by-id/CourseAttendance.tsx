import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams } from "react-router";
import UsersTableFooter from "@/components/table/TableFooter";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import SearchWithUrlSync from "@/components/SearchWithUrlSync";
import PrivateRoute from "@/components/PrivateRoute";
// import { useAuth } from "@/provider/AuthProvider";
import { Textarea } from "@/components/ui/textarea";

const rowSizeList = ["5", "10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "fullName",
    label: "Full Name",
  },
  {
    id: "studentId",
    label: "Id",
  },
  {
    id: "status",
    label: "Status",
  },
  {
    id: "comment",
    label: "Comment",
  },
];

const CourseAttendance = () => {
  // const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [, setLoader] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchAdmissionOfficers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchAdmissionOfficers = async () => {
    const limit = searchParams.get("size") ?? 5;
    const page = searchParams.get("page") || 1;
    const searchTerm = searchParams.get("searchTerm");
    const sort = searchParams.get("sort");
    // const fields = searchParams.get("fields");

    try {
      let apiUrl = `/user/admission-officers?limit=${limit}&page=${page}`;
      if (searchTerm) apiUrl += `&searchTerm=${searchTerm}`;
      if (sort) apiUrl += `&sort=${sort}`;
      // fields && (apiUrl += `&fields=${fields}`);

      const response = await axiosClient.get(apiUrl);

      const data = await response.data;

      if (!data || !data.data || !data.data.result) return;

      setAttendanceList(() => data.data?.result ?? []);
      setTotalPage(data.data?.meta?.totalPage);

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

  return (
    <PrivateRoute>
      <section className="w-full max-w-6xl mx-auto p-5 flex flex-col gap-5">
        <section className="flex justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">Course Name</h1>
        </section>
        <section className="flex justify-between flex-wrap gap-2">
          {/* <SelectWithUrlSync list={searchList} /> */}
          <SearchWithUrlSync label="Search by email address" />
        </section>
        <section className="w-full flex flex-col gap-4">
          <div className="w-full overflow-auto">
            <ScrollArea className="">
              <Table>
                <TableHeader>
                  <TableRow>
                    {header.map(({ id, label }) => (
                      <TableActionHead
                        id={id}
                        key={id}
                        className="capitalize whitespace-nowrap"
                      >
                        {label}
                      </TableActionHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceList.map(
                    ({ _id, fullName, studentId, status, comment }) => (
                      <TableRow
                        key={_id}
                        className="hover:bg-gray-200/60 duration-100 transition-all"
                      >
                        <TableCell className="font-medium">
                          {fullName}
                        </TableCell>
                        <TableCell>{studentId}</TableCell>
                        <TableCell>
                          <Select value={status} defaultValue="absent">
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="present">PRESENT</SelectItem>
                                <SelectItem value="late">LATE</SelectItem>
                                <SelectItem value="absent">ABSENT</SelectItem>
                                <SelectItem value="excused">EXCUSED</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Textarea className="h-8" value={comment} />
                          {comment}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <UsersTableFooter rowSizeList={rowSizeList} totalPages={totalPage} />
        </section>
      </section>
    </PrivateRoute>
  );
};

export default CourseAttendance;
