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
import { Plus } from "lucide-react";
import UsersTableFooter from "~/components/table/TableFooter";
import { useEffect, useState } from "react";
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
