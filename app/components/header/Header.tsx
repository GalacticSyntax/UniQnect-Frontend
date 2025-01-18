import React from "react";
import { SidebarTrigger } from "../sidebar/app-sidebar/app-sidebar-root";

const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 shadow-lg border-b">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  );
};

export default Header;
