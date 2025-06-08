import { Link } from "react-router";
import { SidebarTrigger } from "@/components/sidebar/app-sidebar/app-sidebar-root";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/provider/AuthProvider";

const Header = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="w-full flex justify-between h-16 px-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14 shadow-lg border-b !sticky top-0 left-0 backdrop-blur-lg z-20">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
      <Link to={`/dashboard/profile/${user?._id}`}>
        <Avatar>
          <AvatarImage src={user.image as string} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
    </header>
  );
};

export default Header;
