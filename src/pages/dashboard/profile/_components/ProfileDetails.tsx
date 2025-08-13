import type React from "react";
import { Copy, Mail, Phone, MapPin, User, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useProfile } from "../ProfileProvider";
import { useProfileData } from "../user-profile-data";

export interface ProfileDetailsProps {
  className?: string;
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  copyable?: boolean;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ className }) => {
  const { user } = useProfile();
  const profileData = useProfileData(user);

  const handleCopy = async (label: string, value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!profileData) return null;

  const contactInfo: InfoItemProps[] = [
    {
      icon: Mail,
      label: "Email",
      value: profileData.email,
      copyable: true,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profileData.phone,
      copyable: true,
    },
  ];

  const personalInfo: InfoItemProps[] = [
    {
      icon: User,
      label: "Full Name",
      value: profileData.fullName,
    },
    {
      icon: User,
      label: "Gender",
      value: profileData.gender,
    },
  ];

  const roleInfo: InfoItemProps[] = [];
  if (profileData.studentId) {
    roleInfo.push({
      icon: Hash,
      label: "Student ID",
      value: profileData.studentId,
      copyable: true,
    });
  }
  if (profileData.teacherId) {
    roleInfo.push({
      icon: Hash,
      label: "Teacher ID",
      value: profileData.teacherId,
      copyable: true,
    });
  }
  if (profileData.department) {
    roleInfo.push({
      icon: User,
      label: "Department",
      value: profileData.department,
    });
  }
  if (profileData.designation) {
    roleInfo.push({
      icon: User,
      label: "Designation",
      value: profileData.designation,
    });
  }

  const addressInfo: InfoItemProps[] = [
    {
      icon: MapPin,
      label: "Present Address",
      value: profileData.presentAddress,
    },
    {
      icon: MapPin,
      label: "Permanent Address",
      value: profileData.permanentAddress,
    },
  ];

  const InfoItem: React.FC<InfoItemProps> = ({
    icon: Icon,
    label,
    value,
    copyable = false,
  }) => (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm break-words">{value}</p>
          {copyable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(label, value)}
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy {label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className || ""}`}>
      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {contactInfo.map((item, index) => (
            <InfoItem key={index} {...item} />
          ))}
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {personalInfo.map((item, index) => (
            <InfoItem key={index} {...item} />
          ))}
          {roleInfo.length > 0 && (
            <>
              <Separator className="my-4" />
              {roleInfo.map((item, index) => (
                <InfoItem key={index} {...item} />
              ))}
            </>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {addressInfo.map((item, index) => (
            <InfoItem key={index} {...item} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileDetails;
