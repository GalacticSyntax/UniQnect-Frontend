import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import PrivateRoute from "@/components/PrivateRoute";
import { useAuth } from "@/provider/AuthProvider";

// const rowSizeList = ["5", "10", "20", "30", "50", "80", "100"];

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
    id: "school",
    label: "School",
  },
  {
    id: "number_of_teachers",
    label: "Total teachers",
    // sortable: true,
  },
  {
    id: "number_of_students",
    label: "Total students",
    // sortable: true,
  },
];

const DepartmentPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [, setLoader] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  // const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchDepartment();
  }, [searchParams]);

  const fetchDepartment = async () => {
    // const limit = searchParams.get("size") ?? 5;
    // const page = searchParams.get("page") || 1;
    // const searchTerm = searchParams.get("searchTerm");
    // const sort = searchParams.get("sort");
    // const fields = searchParams.get("fields");
    try {
      const apiUrl = `/department`;
      // let apiUrl = `/department?limit=${limit}&page=${page}`;
      // searchTerm && (apiUrl += `&searchTerm=${searchTerm}`);
      // sort && (apiUrl += `&sort=${sort}`);
      // fields && (apiUrl += `&fields=${fields}`);

      const response = await axiosClient.get(apiUrl);

      const data = await response.data;

      setDepartmentList(() => data?.data ?? []);
      // setTotalPage(data.data?.meta?.totalPage);

      setLoader(false);
    } catch (error: unknown) {
      console.log(error);
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
          <h1 className="text-2xl font-bold">Departments list</h1>
          {user?.role === "admin" && (
            <Link to="/dashboard/department/add">
              <Button>
                <Plus /> Add New Department
              </Button>
            </Link>
          )}
        </section>
        <section className="flex justify-between flex-wrap gap-2">
          {/* <SelectWithUrlSync list={searchList} /> */}
          {/* <SearchWithUrlSync label="Search by name" /> */}
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
                    {user?.role === "admin" && (
                      <TableHead className="text-center">Action</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentList.map(
                    ({
                      name,
                      code,
                      school,
                      number_of_teachers,
                      number_of_students,
                    }) => (
                      <TableRow
                        key={code}
                        className="hover:bg-gray-200/60 duration-100 transition-all"
                      >
                        <TableCell className="font-medium">{name}</TableCell>
                        <TableCell className="font-medium">{code}</TableCell>
                        <TableCell className="font-medium">{school}</TableCell>
                        <TableCell>{number_of_teachers}</TableCell>
                        <TableCell>{number_of_students}</TableCell>
                        {user?.role === "admin" && (
                          <TableCell className="font-medium text-center">
                            <Link to={`/dashboard/department/edit/${code}`}>
                              <Button size={"icon"}>
                                <Pencil />
                              </Button>
                            </Link>
                          </TableCell>
                        )}
                      </TableRow>
                    )
                  )}
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

export default DepartmentPage;
