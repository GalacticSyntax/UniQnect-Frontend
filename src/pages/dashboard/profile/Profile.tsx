import PrivateRoute from "@/components/PrivateRoute"
import { ProfileProvider } from "./ProfileProvider"
import ProfileTop from "./_components/ProfileTop"
import ProfileDetails from "./_components/ProfileDetails"
import EditProfile from "./_components/EditProfile"

const ProfilePage = () => {
  return (
    <ProfileProvider>
      <PrivateRoute>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="space-y-8">
              <ProfileTop />
              <ProfileDetails />
              <EditProfile />
            </div>
          </div>
        </div>
      </PrivateRoute>
    </ProfileProvider>
  )
}

export default ProfilePage
