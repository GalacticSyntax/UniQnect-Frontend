import { Outlet } from "react-router";
import Header from "~/components/header/Header";
import AppSidebar from "~/components/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/sidebar/app-sidebar/app-sidebar-root";

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
