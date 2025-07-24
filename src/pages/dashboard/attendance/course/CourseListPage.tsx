import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/apiClient";
import axios from "axios";
// import UsersTableFooter from "@/components/table/TableFooter";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import PrivateRoute from "@/components/PrivateRoute";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { coursesList } from "@/data/generateCourses";

// const rowSizeList = ["5", "10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "name",
    label: "Course Name",
    sortable: true,
  },
  {
    id: "id",
    label: "Course Id",
    sortable: true,
  },
];

const CourseListPage = () => {
  const [searchParams] = useSearchParams();
  const [, setLoader] = useState(false);
  const [
    courseList,
    //  setCourseList
  ] = useState(coursesList ?? []);
  // const [totalPage, setTotalPage] = useState(0);

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

      // setCourseList(() => data.data?.result ?? []);
      // setTotalPage(data.data?.meta?.totalPage);

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
          <h1 className="text-2xl font-bold">Course list</h1>
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
                  {courseList.map(({ name, id }) => (
                    <TableRow
                      key={id}
                      className="hover:bg-gray-200/60 duration-100 transition-all"
                    >
                      <TableCell className="font-medium">
                        <Link
                          to={`/dashboard/attendance/course/${id}`}
                          className="hover:underline"
                        >
                          {name}
                        </Link>
                      </TableCell>
                      <TableCell>{id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          {/* <UsersTableFooter rowSizeList={rowSizeList} totalPages={totalPage} /> */}
        </section>
      </section>
    </PrivateRoute>
  );
};

export default CourseListPage;
