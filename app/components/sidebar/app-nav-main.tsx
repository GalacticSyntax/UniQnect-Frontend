import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
} from "~/components/ui/sidebar";
import AppCollapsibleMenuItem from "~/components/sidebar/app-sidebar-collapsible-menu-item";
import AppSidebarMenuItem from "~/components/sidebar/app-sidebar-menu-item";
import { Fragment } from "react/jsx-runtime";

const NavMain = ({
  items,
}: {
  items: {
    id: string;
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) => {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <Fragment key={item.id}>
            {item.items ? (
              <AppCollapsibleMenuItem {...item} />
            ) : (
              <AppSidebarMenuItem {...item} />
            )}
          </Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;
