
import type React from "react"
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { axiosClient } from "@/lib/apiClient"
import { useAuth } from "@/provider/AuthProvider"
import { toast } from "sonner"
import type { ProfileContextType, ProfileUser, UserFormData } from "./types"

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: localUserData } = useAuth()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = useCallback(async () => {
    if (!localUserData?._id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axiosClient(`/user/${localUserData._id}`)
      const data = response.data

      if (data.success) {
        setUser(data.data)
      } else {
        setError(data.message || "Failed to fetch user data")
      }
    } catch (err) {
      setError("Failed to fetch user data")
      console.error("Profile fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [localUserData?._id])

  const updateUser = useCallback(
    async (formData: Partial<UserFormData>) => {
      if (!localUserData?._id) return

      setIsLoading(true)

      try {
        const response = await axiosClient.patch(`/user/${localUserData._id}`, formData)

        if (response.data.success) {
          toast.success("Profile updated successfully")
          await fetchUserData() // Refresh user data
        } else {
          throw new Error(response.data.message || "Update failed")
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to update profile"
        toast.error(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [localUserData?._id, fetchUserData],
  )

  const refreshUser = useCallback(() => {
    fetchUserData()
  }, [fetchUserData])

  return (
    <ProfileContext.Provider
      value={{
        user,
        isLoading,
        error,
        fetchUserData,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  return context
}
