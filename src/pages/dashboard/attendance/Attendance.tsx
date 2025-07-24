
import {  useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { axiosClient } from "@/lib/apiClient";
import { toast } from "sonner";
import axios from "axios";
import PrivateRoute from "@/components/PrivateRoute";
// import { useAuth } from "@/provider/AuthProvider";
import CourseListPage from "./course/CourseListPage";

const AttendancePage = () => {
  // const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [, setLoader] = useState(false);

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
      <CourseListPage />
    </PrivateRoute>
  );
};

export default AttendancePage;
