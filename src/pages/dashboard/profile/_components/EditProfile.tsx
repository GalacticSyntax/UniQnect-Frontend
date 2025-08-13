"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Pencil, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { UserFormData } from "../types"
import { useProfile } from "../ProfileProvider"
import { useProfileData } from "../user-profile-data"

export interface EditProfileProps {
  className?: string
}

const EditProfile: React.FC<EditProfileProps> = ({ className }) => {
  const { user, updateUser, isLoading } = useProfile()
  const profileData = useProfileData(user)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    email: "",
    phone: "",
    presentAddress: "",
    permanentAddress: "",
  })

  useEffect(() => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        presentAddress: profileData.presentAddress || "",
        permanentAddress: profileData.permanentAddress || "",
      })
    }
  }, [profileData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    try {
      await updateUser(formData)
      setIsOpen(false)
    } catch (error) {
      // Error is handled in the context
      console.error("Update failed:", error)
    }
  }

  const handleCancel = (): void => {
    if (profileData) {
      setFormData({
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        presentAddress: profileData.presentAddress || "",
        permanentAddress: profileData.permanentAddress || "",
      })
    }
    setIsOpen(false)
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="fixed bottom-6 right-6 z-50">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="lg"
                    className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile information below. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="presentAddress">Present Address</Label>
                <Textarea
                  id="presentAddress"
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  placeholder="Enter your current address"
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="permanentAddress">Permanent Address</Label>
                <Textarea
                  id="permanentAddress"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  placeholder="Enter your permanent address"
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={isLoading} className="flex-1 gap-2">
                <Save className="h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditProfile
