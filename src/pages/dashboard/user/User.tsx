import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSearchParams } from "react-router";
import UsersTableFooter from "@/components/table/TableFooter";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import SearchWithUrlSync from "@/components/SearchWithUrlSync";
import PrivateRoute from "@/components/PrivateRoute";

const rowSizeList = ["5", "10", "20", "30", "50", "80", "100"];

const header = [
  {
    id: "fullName",
    label: "Full Name",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
  },
  {
    id: "phone",
    label: "Phone Number",
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
  {
    id: "role",
    label: "Role",
  },
];

const UserPage = () => {
  const [searchParams] = useSearchParams();
  const [, setLoader] = useState(false);
  const [userList, setUserList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const fetchUserList = async () => {
    const limit = searchParams.get("size") ?? 5;
    const page = searchParams.get("page") || 1;
    const searchTerm = searchParams.get("searchTerm");
    const sort = searchParams.get("sort");
    // const fields = searchParams.get("fields");
    try {
      let apiUrl = `/user?limit=${limit}&page=${page}`;
      if (searchTerm) apiUrl += `&searchTerm=${searchTerm}`;
      if (sort) apiUrl += `&sort=${sort}`;
      // fields && (apiUrl += `&fields=${fields}`);

      const response = await axiosClient.get(apiUrl);

      const data = await response.data;

      if (!data || !data.data || !data.data.result) return;

      setUserList(() => data.data?.result ?? []);
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
          <h1 className="text-2xl font-bold">User list</h1>
          {/* <Link to="/dashboard/user/add-user">
            <Button>
              <Plus /> Add New User
            </Button>
          </Link> */}
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
                    {header.map(({ id, label, sortable, center }) => (
                      <TableActionHead
                        id={id}
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
                  {userList.map(
                    ({ _id, fullName, email, phone, image, gender, role }) => (
                      <TableRow
                        key={_id}
                        className="hover:bg-gray-200/60 duration-100 transition-all"
                      >
                        <TableCell className="font-medium">
                          {fullName}
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
                        <TableCell className="capitalize">{gender}</TableCell>
                        <TableCell>
                          {role === "admission-office"
                            ? "account-office"
                            : role}
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

export default UserPage;
