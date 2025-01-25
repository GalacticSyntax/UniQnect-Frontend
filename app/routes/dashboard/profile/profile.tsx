import type { Route } from "./+types/profile";
import ProfileTop from "~/routes/dashboard/profile/_components/ProfileTop";

export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

const ProfilePage = ({ params }: Route.ComponentProps) => {
  const userId = params.id;

  return (
    <section className="w-full max-w-5xl mx-auto p-5">
      <ProfileTop />
    </section>
  );
};

export default ProfilePage;
