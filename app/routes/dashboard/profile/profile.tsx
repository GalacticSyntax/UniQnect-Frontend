import type { Route } from "./+types/profile";
import ProfileTop from "~/routes/dashboard/profile/_components/ProfileTop";
import ProfileDetails from "~/routes/dashboard/profile/_components/ProfileDetails";
import EditProfile from "~/routes/dashboard/profile/_components/EditProfile";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const ProfilePage = ({ params }: Route.ComponentProps) => {
  const userId = params.id;

  return (
    <section className="w-full max-w-5xl mx-auto p-5 flex flex-col gap-5">
      <ProfileTop />
      <ProfileDetails />
      <EditProfile />
    </section>
  );
};

export default ProfilePage;
