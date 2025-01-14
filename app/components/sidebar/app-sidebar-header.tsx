import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "~/components/sidebar/app-sidebar/app-sidebar-root";

const AppSidebarHeader = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link to="/" className="flex items-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd size={18} />
          </div>
          <div className="grid flex-1 text-left leading-tight ml-4">
            <span className="truncate font-semibold">UniQnect</span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default AppSidebarHeader;
