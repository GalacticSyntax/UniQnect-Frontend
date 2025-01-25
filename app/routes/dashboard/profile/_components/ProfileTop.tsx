import { Badge } from "~/components/ui/badge";

const ProfileTop = () => {
  const profileImage =
    "https://scontent.fdac24-3.fna.fbcdn.net/v/t39.30808-6/325618153_754096169469617_5563270339517372522_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=xG6Hilk4XycQ7kNvgHKNDZc&_nc_zt=23&_nc_ht=scontent.fdac24-3.fna&_nc_gid=A4dHJC6sj8vIp482qrmxMBQ&oh=00_AYBtHDxc4X-Vqmv-bKhUA1QHfzsimAr7ab7qnwOK9yzQmA&oe=679A6BDC";

  return (
    <div className="flex flex-col sm:flex-row gap-4 shadow-lg p-5 bg-primary rounded-md overflow-hidden">
      <div className="w-full max-w-52 aspect-square overflow-hidden rounded-md ring-2 ring-primary-foreground">
        <img src={profileImage} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="w-full flex flex-col gap-2 items-start text-primary-foreground selection:bg-primary-foreground selection:text-primary">
        <h2 className="text-2xl font-bold">Md. Abdus Shohid Shakil</h2>
        <Badge variant={"secondary"}>Student</Badge>
        <span className="py-1"></span>
        <p>Department: CSE</p>
        <p>Semester: 8th</p>
        <p>Session: Fall-21</p>
      </div>
    </div>
  );
};

export default ProfileTop;
