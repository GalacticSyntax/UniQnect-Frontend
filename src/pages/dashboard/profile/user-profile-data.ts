

import { useMemo } from "react"
import type { ProfileUser, Student, Teacher, User } from "./types"

export interface ProcessedProfileData {
  id: string
  fullName: string
  email: string
  phone: string
  gender: string
  image?: string
  isVerified: boolean
  role: string
  presentAddress: string
  permanentAddress: string
  studentId?: string | null
  teacherId?: string | null
  department?: string | null
  designation?: string | null
  semester?: number | null
  isStudent: boolean
  isTeacher: boolean
  isDirectUser: boolean
}

export const useProfileData = (user: ProfileUser | null): ProcessedProfileData | null => {
  return useMemo(() => {
    if (!user) return null

    const isStudent = "studentId" in user
    const isTeacher = "teacherId" in user
    const isDirectUser = "role" in user && !isStudent && !isTeacher

    const userData: User = isDirectUser ? (user as User) : (user as Student | Teacher).userId || ({} as User)

    const userRole = isStudent ? "student" : isTeacher ? "teacher" : userData.role || "user"

    const calculateSemester = (admittedAt: string): number => {
      const admissionDate = new Date(admittedAt)
      const currentDate = new Date()
      const diffTime = Math.abs(currentDate.getTime() - admissionDate.getTime())
      const diffMonths = Math.floor(diffTime / (1000 * 3600 * 24 * 30))
      return Math.floor(diffMonths / 6) + 1
    }

    return {
      // Basic info
      id: userData._id,
      fullName: userData.fullName || "N/A",
      email: userData.email || "N/A",
      phone: userData.phone || "N/A",
      gender: userData.gender || "N/A",
      image: userData.image,
      isVerified: userData.isVerified || false,
      role: userRole,
      presentAddress: userData.presentAddress || "Not provided",
      permanentAddress: userData.permanentAddress || "Not provided",

      // Role-specific info
      studentId: isStudent ? (user as Student).studentId : null,
      teacherId: isTeacher ? (user as Teacher).teacherId : null,
      department: isStudent || isTeacher ? (user as Student | Teacher).departmentId?.name : null,
      designation: isTeacher ? (user as Teacher).designation : null,
      semester: isStudent ? calculateSemester((user as Student).admittedAt) : null,

      // Flags
      isStudent,
      isTeacher,
      isDirectUser,
    }
  }, [user])
}
