import PrivateRoute from "@/components/PrivateRoute";
import ProfileTop from "@/pages/dashboard/profile/_components/ProfileTop";
import ProfileDetails from "@/pages/dashboard/profile/_components/ProfileDetails";
import EditProfile from "@/pages/dashboard/profile/_components/EditProfile";

const ProfilePage = () => {
  return (
    <PrivateRoute>
      <section className="w-full max-w-5xl mx-auto p-5 flex flex-col gap-5">
        <ProfileTop />
        <ProfileDetails />
        <EditProfile />
      </section>
    </PrivateRoute>
  );
};

export default ProfilePage;
