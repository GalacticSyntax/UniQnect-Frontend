import type React from "react";
import { useEffect, useState, useRef } from "react";
import { BadgeCheck, BadgeX, Camera, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_BASE_URL } from "@/constant";
import { useProfile } from "../ProfileProvider";
import { useProfileData } from "../user-profile-data";
import { axiosClient } from "@/lib/apiClient";

export interface ProfileTopProps {
  className?: string;
}

const ProfileTop: React.FC<ProfileTopProps> = ({ className }) => {
  const { user, isLoading, error, fetchUserData, updateUser } = useProfile();
  const profileData = useProfileData(user);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosClient.patch(`/user/${user?._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);

      if (response.statusText !== "OK") {
        return toast({
          title: "Something went wrong",
          description: "We are facing some problem.",
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...data } = response.data.data ?? {};

      await updateUser({ image: data.imagePath });

      toast({
        title: "Image updated successfully",
        description: "Your profile image has been updated",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast({
        title: "Upload failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditImageClick = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return <ProfileTopSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-destructive font-medium">Error loading profile</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchUserData}
          className="mt-3 bg-transparent"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="bg-muted/50 border rounded-lg p-6 text-center">
        <p className="text-muted-foreground">No profile data available</p>
      </div>
    );
  }

  const imageUrl = profileData.image
    ? `${BACKEND_BASE_URL}${profileData.image}`
    : "/placeholder.svg?height=200&width=200";

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground shadow-xl ${
        className || ""
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative mx-auto sm:mx-0">
          <div className="group relative h-32 w-32 overflow-hidden rounded-2xl border-4 border-primary-foreground/20 bg-primary-foreground/10 shadow-2xl transition-transform hover:scale-105">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`${profileData.fullName}'s profile`}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=200&width=200";
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={handleEditImageClick}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <>
                    <Upload className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute -bottom-2 -right-2 rounded-full bg-background p-1 shadow-lg">
                  {profileData.isVerified ? (
                    <BadgeCheck className="h-6 w-6 text-green-500" />
                  ) : (
                    <BadgeX className="h-6 w-6 text-red-500" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {profileData.isVerified
                    ? "Verified Account"
                    : "Unverified Account"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profileData.fullName}
            </h1>
            <p className="text-lg text-primary-foreground/80 capitalize">
              {profileData.gender}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            <Badge
              variant="secondary"
              className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
            >
              {profileData.role}
            </Badge>
            {profileData.department && (
              <Badge
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground"
              >
                {profileData.department}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm text-primary-foreground/90">
            {profileData.studentId && (
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <p>
                  <span className="font-medium">Student ID:</span>{" "}
                  {profileData.studentId}
                </p>
                {profileData.semester && (
                  <p>
                    <span className="font-medium">Semester:</span>{" "}
                    {profileData.semester}
                  </p>
                )}
              </div>
            )}

            {profileData.teacherId && (
              <div className="flex flex-col sm:flex-row sm:gap-6">
                <p>
                  <span className="font-medium">Teacher ID:</span>{" "}
                  {profileData.teacherId}
                </p>
                {profileData.designation && (
                  <p>
                    <span className="font-medium">Designation:</span>{" "}
                    {profileData.designation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileTopSkeleton: React.FC = () => (
  <div className="rounded-xl bg-muted p-8">
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <Skeleton className="mx-auto h-32 w-32 rounded-2xl sm:mx-0" />
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
          <Skeleton className="mx-auto h-5 w-24 sm:mx-0" />
        </div>
        <div className="flex gap-2 justify-center sm:justify-start">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  </div>
);

export default ProfileTop;
