import * as React from "react";
import { Book, NotebookTabs, User } from "lucide-react";
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

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
    // {
    //   title: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
    {
      id: "user",
      title: "user",
      url: "/dashboard/user",
      icon: User,
      isActive: false,
      items: [
        {
          title: "All Users",
          url: "/dashboard/user",
        },
      ],
    },
    {
      id: "teacher",
      title: "teacher",
      url: "/dashboard/user",
      icon: User,
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
      title: "student",
      url: "/dashboard/student",
      icon: User,
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
      title: "attendance",
      url: "/dashboard/attendance",
      icon: NotebookTabs,
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
      title: "course",
      url: "/dashboard/course",
      icon: Book,
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
      isActive: false,
      items: [
        {
          title: "Department",
          url: "/dashboard/department",
        },
      ],
    },
    {
      id: "result",
      title: "Result",
      url: "/dashboard/result",
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
      title: "school",
      url: "/dashboard/school",
      isActive: false,
      items: [
        {
          title: "school",
          url: "/dashboard/school",
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
