export interface User {
  _id: string
  fullName: string
  email: string
  password: string
  isVerified: boolean
  role: string
  phone: string
  gender: "male" | "female" | "other"
  image?: string
  presentAddress?: string
  permanentAddress?: string
  createdAt: string
  updatedAt: string
}

export interface Student {
  _id: string
  studentId: string
  userId: User | null
  departmentId: {
    _id: string
    name: string
  }
  admittedAt: string
  createdAt: string
  updatedAt: string
}

export interface Teacher {
  _id: string
  teacherId: string
  userId: User | null
  departmentId: {
    _id: string
    name: string
  }
  designation: string
  joinedAt: string
  createdAt: string
  updatedAt: string
}

export type ProfileUser = User | Student | Teacher

export interface ProfileContextType {
  user: ProfileUser | null
  isLoading: boolean
  error: string | null
  fetchUserData: () => Promise<void>
  updateUser: (data: Partial<UserFormData>) => Promise<void>
  refreshUser: () => void
}

export interface UserFormData {
  fullName: string
  email: string
  phone: string
  image?: string
  presentAddress: string
  permanentAddress: string
}
