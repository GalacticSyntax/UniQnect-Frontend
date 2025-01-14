import { GalleryVerticalEnd } from "lucide-react";
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium text-lg"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-6" />
          </div>
          UniQnect
        </Link>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
