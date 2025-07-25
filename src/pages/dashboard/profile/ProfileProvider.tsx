/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/ProfileContext.tsx
import { axiosClient } from "@/lib/apiClient";
import { useAuth } from "@/provider/AuthProvider";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type SetStateAction,
  type Dispatch,
} from "react";

interface ProfileContextType {
  user: any;
  error: string;
  setError: Dispatch<SetStateAction<string>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  fetchUserData: () => Promise<void>;
  setUser: Dispatch<SetStateAction<any>>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: localUserData } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchUserData = async () => {
    try {
      const response = await axiosClient(
        `/user/${localUserData?._id as string}`
      ); // Use the actual API endpoint here
      const data = await response.data;
      if (data.success) {
        setUser(data.data);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        error,
        isLoading,
        setError,
        setIsLoading,
        fetchUserData,
        setUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within an ProfileProvider");
  }
  return context;
};
