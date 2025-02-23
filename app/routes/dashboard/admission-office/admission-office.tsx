import type { Route } from "./+types/admission-office";
import {
  Table,
  TableActionHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import UsersTableFooter from "~/components/table/TableFooter";
import { useEffect, useState } from "react";
import { axiosClient } from "~/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import SearchWithUrlSync from "~/components/SearchWithUrlSync";
import SelectWithUrlSync from "~/components/SelectWithUrlSync";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

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
  let [searchParams] = useSearchParams();
  const [loader, setLoader] = useState(false);
  const [admissionOfficerList, setAdmissionOfficerList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    fetchAdmissionOfficers();
  }, [searchParams]);

  const fetchAdmissionOfficers = async () => {
    const limit = searchParams.get("size") ?? 5;
    const page = searchParams.get("page") || 1;
    const searchTerm = searchParams.get("searchTerm");
    const sort = searchParams.get("sort");
    // const fields = searchParams.get("fields");

    try {
      let apiUrl = `/user/admission-officers?limit=${limit}&page=${page}`;
      searchTerm && (apiUrl += `&searchTerm=${searchTerm}`);
      sort && (apiUrl += `&sort=${sort}`);
      // fields && (apiUrl += `&fields=${fields}`);

      const response = await axiosClient.get(apiUrl);

      const data = await response.data;

      if (!data || !data.data || !data.data.result) return;

      setAdmissionOfficerList((prev) => data.data?.result ?? []);
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
    <section className="w-full max-w-6xl mx-auto p-5 flex flex-col gap-5">
      <section className="flex justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Admission officer list</h1>
        <Link to="/dashboard/teacher/add-teacher">
          <Button>
            <Plus /> Add Admission officer
          </Button>
        </Link>
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
                {admissionOfficerList.map(
                  ({ _id, fullName, email, phone, image, gender }) => (
                    <TableRow
                      key={_id}
                      className="hover:bg-gray-200/60 duration-100 transition-all"
                    >
                      <TableCell className="font-medium">{fullName}</TableCell>
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
        <UsersTableFooter rowSizeList={rowSizeList} totalPages={totalPage} />
      </section>
    </section>
  );
};

export default TeacherPage;
