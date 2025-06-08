import { type LucideIcon } from "lucide-react";
import { Link } from "react-router";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/sidebar/app-sidebar/app-sidebar-root";

const AppSidebarMenuItem = ({
  id,
  title,
  url,
  icon: Icon,
  isActive,
}: {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
}) => {
  return (
    <SidebarMenuItem key={id}>
      <SidebarMenuButton asChild>
        <Link to={url}>
          {Icon && <Icon />}
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default AppSidebarMenuItem;
