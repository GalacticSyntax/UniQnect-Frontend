import { Outlet } from "react-router";

const ProfileLayout = () => {
  return (
    <section className="w-full h-full">
      <Outlet />
    </section>
  );
};

export default ProfileLayout;
