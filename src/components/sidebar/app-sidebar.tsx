import * as React from "react";
import {
  Book,
  Building,
  CheckSquare,
  // ClipboardList,
  FileText,
  GraduationCap,
  School,
  ShieldPlus,
  User,
  Users,
} from "lucide-react";
import NavMain from "@/components/sidebar/app-nav-main";
import AppNavUser from "@/components/sidebar/app-nav-user";
import AppSidebarHeader from "@/components/sidebar/app-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/sidebar/app-sidebar/app-sidebar-root";
import { useAuth } from "@/provider/AuthProvider";
import { axiosClient } from "@/lib/apiClient";

const adminRoutes = [
  {
    id: "user",
    title: "User",
    url: "/dashboard/user",
    icon: Users, // Represents people/users
    isActive: false,
    items: [
      {
        title: "All Users",
        url: "/dashboard/user",
      },
      // {
      //   title: "Add User",
      //   url: "/dashboard/user/add",
      // },
    ],
  },
  {
    id: "account-office",
    title: "Account Office",
    url: "/dashboard/account-office",
    icon: ShieldPlus,
    isActive: false,
    items: [
      {
        title: "Account Officers",
        url: "/dashboard/account-office",
      },
      {
        title: "Add Account Offices",
        url: "/dashboard/account-office/add",
      },
    ],
  },
  {
    id: "teacher",
    title: "Teacher",
    url: "/dashboard/teacher",
    icon: GraduationCap, // Represents teachers/education
    isActive: false,
    items: [
      {
        title: "Teachers",
        url: "/dashboard/teacher",
      },
      {
        title: "Add Teacher",
        url: "/dashboard/teacher/add",
      },
    ],
  },
  {
    id: "student",
    title: "Student",
    url: "/dashboard/student",
    icon: User, // Represents individual users (e.g., students)
    isActive: false,
    items: [
      {
        title: "Students",
        url: "/dashboard/student",
      },
      {
        title: "Add Student",
        url: "/dashboard/student/add",
      },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    url: "/dashboard/attendance",
    icon: CheckSquare, // Represents checklists or attendance
    isActive: false,
    items: [
      {
        title: "Attendance",
        url: "/dashboard/attendance",
      },
    ],
  },
  {
    id: "course",
    title: "Course",
    url: "/dashboard/course",
    icon: Book, // Represents courses or books
    isActive: false,
    items: [
      {
        title: "Courses",
        url: "/dashboard/course",
      },
      {
        title: "Advisor",
        url: "/dashboard/course/advisor",
      },
      {
        title: "Offered",
        url: "/dashboard/course/offered",
      },
      {
        title: "Registered",
        url: "/dashboard/course/registered",
      },
      {
        title: "Add Course",
        url: "/dashboard/course/add-course",
      },
      {
        title: "Registration Form",
        url: "/dashboard/course/registration-form",
      },
    ],
  },
  // {
  //   id: "curriculum",
  //   title: "Curriculum",
  //   url: "/dashboard/curriculum",
  //   icon: ClipboardList, // Represents a structured list or curriculum
  //   isActive: false,
  //   items: [
  //     {
  //       title: "Curriculum",
  //       url: "/dashboard/curriculum",
  //     },
  //   ],
  // },
  {
    id: "department",
    title: "Department",
    url: "/dashboard/department",
    icon: Building, // Represents departments or buildings
    isActive: false,
    items: [
      {
        title: "Department",
        url: "/dashboard/department",
      },
      {
        title: "Department Head",
        url: "/dashboard/department/department-head",
      },
      {
        title: "Add Department",
        url: "/dashboard/department/add",
      },
      {
        title: "Add Department Head",
        url: "/dashboard/department/add-department-head",
      },
    ],
  },
  {
    id: "result",
    title: "Result",
    url: "/dashboard/result",
    icon: FileText, // Represents results or documents
    isActive: false,
    items: [
      {
        title: "Result",
        url: "/dashboard/result",
      },
    ],
  },
  {
    id: "school",
    title: "School",
    url: "/dashboard/school",
    icon: School, // Represents schools/education institutions
    isActive: false,
    items: [
      {
        title: "School",
        url: "/dashboard/school",
      },
      {
        title: "Add School",
        url: "/dashboard/school/add",
      },
    ],
  },
  {
    id: "Session",
    title: "Session",
    url: "/dashboard/Session",
    icon: School, // Represents schools/education institutions
  },
];

const admissionOfficeRoutes = [
  {
    id: "account-office",
    title: "Account Office",
    url: "/dashboard/account-office",
    icon: ShieldPlus,
    isActive: false,
    items: [
      {
        title: "Account Officers",
        url: "/dashboard/account-office",
      },
    ],
  },
  {
    id: "student",
    title: "Student",
    url: "/dashboard/student",
    icon: User, // Represents individual users (e.g., students)
    isActive: false,
    items: [
      {
        title: "Students",
        url: "/dashboard/student",
      },
      {
        title: "Add Student",
        url: "/dashboard/student/add",
      },
    ],
  },
  {
    id: "department",
    title: "Department",
    url: "/dashboard/department",
    icon: Building, // Represents departments or buildings
    isActive: false,
    items: [
      {
        title: "Department",
        url: "/dashboard/department",
      },
      {
        title: "Department Head",
        url: "/dashboard/department/department-head",
      },
    ],
  },
  {
    id: "course",
    title: "Course",
    url: "/dashboard/course",
    icon: Book, // Represents courses or books
    isActive: false,
    items: [
      {
        title: "Student Registration",
        url: "/dashboard/course/student_registration",
      },
    ],
  },
  {
    id: "school",
    title: "School",
    url: "/dashboard/school",
    icon: School, // Represents schools/education institutions
    isActive: false,
    items: [
      {
        title: "School",
        url: "/dashboard/school",
      },
    ],
  },
];

const teacherRoutes = [
  {
    id: "teacher",
    title: "Teacher",
    url: "/dashboard/teacher",
    icon: GraduationCap, // Represents teachers/education
    isActive: false,
    items: [
      {
        title: "Teachers",
        url: "/dashboard/teacher",
      },
    ],
  },
  {
    id: "student",
    title: "Student",
    url: "/dashboard/student",
    icon: User, // Represents individual users (e.g., students)
    isActive: false,
    items: [
      {
        title: "Students",
        url: "/dashboard/student",
      },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    url: "/dashboard/attendance",
    icon: CheckSquare, // Represents checklists or attendance
    isActive: false,
    items: [
      {
        title: "Attendance",
        url: "/dashboard/attendance",
      },
    ],
  },
  {
    id: "course",
    title: "Course",
    url: "/dashboard/course",
    icon: Book, // Represents courses or books
    isActive: false,
    items: [
      {
        title: "Courses",
        url: "/dashboard/course",
      },
      {
        title: "Advisor",
        url: "/dashboard/course/advisor",
      },
      {
        title: "Offered",
        url: "/dashboard/course/offered",
      },
      {
        title: "Registered",
        url: "/dashboard/course/registered",
      },
      {
        title: "My Offered Courses",
        url: "/dashboard/course/my-offered-courses",
      },
      {
        title: "Attendance For Teacher",
        url: "/dashboard/course/attendance_for_teachers",
      },
      {
        title: "Accept Course",
        url: "/dashboard/course/accept_course",
      },
      {
        title: "Registration Form",
        url: "/dashboard/course/registration-form",
      },
    ],
  },
  // {
  //   id: "curriculum",
  //   title: "Curriculum",
  //   url: "/dashboard/curriculum",
  //   icon: ClipboardList, // Represents a structured list or curriculum
  //   isActive: false,
  //   items: [
  //     {
  //       title: "Curriculum",
  //       url: "/dashboard/curriculum",
  //     },
  //   ],
  // },
  {
    id: "department",
    title: "Department",
    url: "/dashboard/department",
    icon: Building, // Represents departments or buildings
    isActive: false,
    items: [
      {
        title: "Department",
        url: "/dashboard/department",
      },
      {
        title: "Department Head",
        url: "/dashboard/department/department-head",
      },
    ],
  },
  {
    id: "result",
    title: "Result",
    url: "/dashboard/result",
    icon: FileText, // Represents results or documents
    isActive: false,
    items: [
      {
        title: "Result",
        url: "/dashboard/result",
      },
      {
        title: "Submit Result",
        url: "/dashboard/result/submission",
      },
    ],
  },
  {
    id: "school",
    title: "School",
    url: "/dashboard/school",
    icon: School, // Represents schools/education institutions
    isActive: false,
    items: [
      {
        title: "School",
        url: "/dashboard/school",
      },
    ],
  },
];

const studentRoutes = [
  {
    id: "teacher",
    title: "Teacher",
    url: "/dashboard/teacher",
    icon: GraduationCap, // Represents teachers/education
    isActive: false,
    items: [
      {
        title: "Teachers",
        url: "/dashboard/teacher",
      },
    ],
  },
  {
    id: "student",
    title: "Student",
    url: "/dashboard/student",
    icon: User, // Represents individual users (e.g., students)
    isActive: false,
    items: [
      {
        title: "Students",
        url: "/dashboard/student",
      },
    ],
  },
  {
    id: "attendance",
    title: "Attendance",
    url: "/dashboard/attendance",
    icon: CheckSquare, // Represents checklists or attendance
    isActive: false,
    items: [
      {
        title: "Attendance",
        url: "/dashboard/attendance",
      },
    ],
  },
  {
    id: "course",
    title: "Course",
    url: "/dashboard/course",
    icon: Book, // Represents courses or books
    isActive: false,
    items: [
      {
        title: "Courses",
        url: "/dashboard/course",
      },
      {
        title: "Advisor",
        url: "/dashboard/course/advisor",
      },
      {
        title: "Offered",
        url: "/dashboard/course/offered",
      },
      {
        title: "Registered",
        url: "/dashboard/course/registered",
      },
      {
        title: "Attendance For Students",
        url: "/dashboard/course/attendance_for_students",
      },
      {
        title: "Registration Form",
        url: "/dashboard/course/registration-form",
      },
      {
        title: "My Registered Courses",
        url: "/dashboard/course/my_registered_courses",
      },
    ],
  },
  // {
  //   id: "curriculum",
  //   title: "Curriculum",
  //   url: "/dashboard/curriculum",
  //   icon: ClipboardList, // Represents a structured list or curriculum
  //   isActive: false,
  //   items: [
  //     {
  //       title: "Curriculum",
  //       url: "/dashboard/curriculum",
  //     },
  //   ],
  // },
  {
    id: "department",
    title: "Department",
    url: "/dashboard/department",
    icon: Building, // Represents departments or buildings
    isActive: false,
    items: [
      {
        title: "Department",
        url: "/dashboard/department",
      },
      {
        title: "Department Head",
        url: "/dashboard/department/department-head",
      },
    ],
  },
  {
    id: "result",
    title: "Result",
    url: "/dashboard/result",
    icon: FileText, // Represents results or documents
    isActive: false,
    items: [
      {
        title: "Result",
        url: "/dashboard/result",
      },
    ],
  },
  {
    id: "school",
    title: "School",
    url: "/dashboard/school",
    icon: School, // Represents schools/education institutions
    isActive: false,
    items: [
      {
        title: "School",
        url: "/dashboard/school",
      },
    ],
  },
];

// const data = {
//   user: {
//     name: "Abdus Shohid Shakil",
//     email: "shakil102043@gmail.com",
//     avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       id: "user",
//       title: "User",
//       url: "/dashboard/user",
//       icon: Users, // Represents people/users
//       isActive: false,
//       items: [
//         {
//           title: "All Users",
//           url: "/dashboard/user",
//         },
//         // {
//         //   title: "Add User",
//         //   url: "/dashboard/user/add",
//         // },
//       ],
//     },
//     {
//       id: "admission-office",
//       title: "Admission Office",
//       url: "/dashboard/admission-office",
//       icon: ShieldPlus,
//       isActive: false,
//       items: [
//         {
//           title: "Admission Officers",
//           url: "/dashboard/admission-office",
//         },
//         {
//           title: "Add Admission Offices",
//           url: "/dashboard/admission-office/add",
//         },
//       ],
//     },
//     {
//       id: "teacher",
//       title: "Teacher",
//       url: "/dashboard/teacher",
//       icon: GraduationCap, // Represents teachers/education
//       isActive: false,
//       items: [
//         {
//           title: "Teachers",
//           url: "/dashboard/teacher",
//         },
//         {
//           title: "Add Teacher",
//           url: "/dashboard/teacher/add",
//         },
//       ],
//     },
//     {
//       id: "student",
//       title: "Student",
//       url: "/dashboard/student",
//       icon: User, // Represents individual users (e.g., students)
//       isActive: false,
//       items: [
//         {
//           title: "Students",
//           url: "/dashboard/student",
//         },
//         {
//           title: "Add Student",
//           url: "/dashboard/student/add",
//         },
//       ],
//     },
//     {
//       id: "attendance",
//       title: "Attendance",
//       url: "/dashboard/attendance",
//       icon: CheckSquare, // Represents checklists or attendance
//       isActive: false,
//       items: [
//         {
//           title: "Attendance",
//           url: "/dashboard/attendance",
//         },
//       ],
//     },
//     {
//       id: "course",
//       title: "Course",
//       url: "/dashboard/course",
//       icon: Book, // Represents courses or books
//       isActive: false,
//       items: [
//         {
//           title: "Courses",
//           url: "/dashboard/course",
//         },
//         {
//           title: "Advisor",
//           url: "/dashboard/course/advisor",
//         },
//         {
//           title: "Offered",
//           url: "/dashboard/course/offered",
//         },
//         {
//           title: "Registered",
//           url: "/dashboard/course/registered",
//         },
//       ],
//     },
//     {
//       id: "curriculum",
//       title: "Curriculum",
//       url: "/dashboard/curriculum",
//       icon: ClipboardList, // Represents a structured list or curriculum
//       isActive: false,
//       items: [
//         {
//           title: "Curriculum",
//           url: "/dashboard/curriculum",
//         },
//       ],
//     },
//     {
//       id: "department",
//       title: "Department",
//       url: "/dashboard/department",
//       icon: Building, // Represents departments or buildings
//       isActive: false,
//       items: [
//         {
//           title: "Department",
//           url: "/dashboard/department",
//         },
//         {
//           title: "Add Department",
//           url: "/dashboard/department/add",
//         },
//       ],
//     },
//     {
//       id: "result",
//       title: "Result",
//       url: "/dashboard/result",
//       icon: FileText, // Represents results or documents
//       isActive: false,
//       items: [
//         {
//           title: "Result",
//           url: "/dashboard/result",
//         },
//       ],
//     },
//     {
//       id: "school",
//       title: "School",
//       url: "/dashboard/school",
//       icon: School, // Represents schools/education institutions
//       isActive: false,
//       items: [
//         {
//           title: "School",
//           url: "/dashboard/school",
//         },
//         {
//           title: "Add School",
//           url: "/dashboard/school/add",
//         },
//       ],
//     },
//   ],
// };

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { user } = useAuth();

  const [role, setRole] = React.useState(user?.role);

  React.useEffect(() => {
    setRole(user?.role);
  }, [user?.role]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return null;
      try {
        const response = await axiosClient(`/user/${user?._id}`);
        const data = await response.data;
        if (data.success && data.data?.role) {
          console.log(data.data.role);
          setRole(data.data.role ?? "student");
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const routes = React.useMemo(() => {
    switch (role) {
      case "student":
        return studentRoutes;
      case "teacher":
        return teacherRoutes;
      case "admin":
        return adminRoutes;
      case "admission-office":
      default:
        return admissionOfficeRoutes;
    }
  }, [role]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={routes} />
      </SidebarContent>
      <SidebarFooter>
        <AppNavUser
          user={{
            name: String(user?.fullName ?? ""),
            email: String(user?.email ?? ""),
            avatar: String(user?.image ?? ""),
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
