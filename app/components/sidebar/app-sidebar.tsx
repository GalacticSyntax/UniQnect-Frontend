import * as React from "react";
import {
  Book,
  Building,
  CheckSquare,
  ClipboardList,
  FileText,
  GraduationCap,
  School,
  User,
  Users,
} from "lucide-react";
import NavMain from "~/components/sidebar/app-nav-main";
import AppNavUser from "~/components/sidebar/app-nav-user";
import AppSidebarHeader from "~/components/sidebar/app-sidebar-header";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/sidebar/app-sidebar/app-sidebar-root";

const data = {
  user: {
    name: "Abdus Shohid Shakil",
    email: "shakil102043@gmail.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
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
        {
          title: "Add User",
          url: "/dashboard/user/add-user",
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
          url: "/dashboard/teacher/add-teacher",
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
          url: "/dashboard/student/add-student",
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
      ],
    },
    {
      id: "curriculum",
      title: "Curriculum",
      url: "/dashboard/curriculum",
      icon: ClipboardList, // Represents a structured list or curriculum
      isActive: false,
      items: [
        {
          title: "Curriculum",
          url: "/dashboard/curriculum",
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
          title: "Add Department",
          url: "/dashboard/department/add-department",
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
          url: "/dashboard/school/add-school",
        },
      ],
    },
  ],
};
const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AppNavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
