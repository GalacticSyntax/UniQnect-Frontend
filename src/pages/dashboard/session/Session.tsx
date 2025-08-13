import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { axiosClient } from "@/lib/apiClient";

interface SessionData {
  _id?: string;
  running: string;
  previous?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success: boolean;
  data?: SessionData;
  error?: string;
  message?: string;
}

const SessionManagement: React.FC = () => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [newSession, setNewSession] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch current session data
  const fetchSessionData = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get<ApiResponse>("/session");
      if (response.data.success && response.data.data) {
        setSessionData(response.data.data);
      } else {
        setSessionData(null);
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          setSessionData(null);
        } else {
          toast.error("Failed to fetch session data");
        }
      } else {
        toast.error("Failed to fetch session data");
      }
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create or update session
  const handleCreateSession = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newSession.trim()) {
      toast.error("Please enter a session name");
      return;
    }

    setCreating(true);
    try {
      const response = await axiosClient.post<ApiResponse>("/session", {
        running: newSession.trim(),
      });

      if (response.data.success && response.data.data) {
        setSessionData(response.data.data);
        setNewSession("");
        toast.success("Session created successfully");
      } else {
        toast.error(
          response.data.error ||
            response.data.message ||
            "Failed to create session"
        );
      }
    } catch (error: unknown) {
      let errorMessage = "Failed to create session";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: { message?: string; error?: string };
          };
        };
        errorMessage =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          errorMessage;
      }

      toast.error(errorMessage);
      console.error("Error creating session:", error);
    } finally {
      setCreating(false);
    }
  };

  // Load session data on component mount
  useEffect(() => {
    fetchSessionData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Session Management
          </h1>
          <p className="text-gray-600">
            Manage academic sessions and track current/previous periods
          </p>
        </div>

        {/* Current Session Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Session Status
              </CardTitle>
              <CardDescription>
                Current and previous academic sessions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSessionData}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Loading session data...</span>
              </div>
            ) : sessionData ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Current Session */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-green-600">
                      Current Session
                    </h3>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <Badge
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 mb-2"
                    >
                      Active
                    </Badge>
                    <p className="text-lg font-medium text-green-800">
                      {sessionData.running}
                    </p>
                    {sessionData.updatedAt && (
                      <p className="text-sm text-green-600 mt-1">
                        Updated:{" "}
                        {new Date(sessionData.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Previous Session */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-600">
                      Previous Session
                    </h3>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    {sessionData.previous ? (
                      <>
                        <Badge variant="secondary" className="mb-2">
                          Completed
                        </Badge>
                        <p className="text-lg font-medium text-gray-800">
                          {sessionData.previous}
                        </p>
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="mb-2">
                          None
                        </Badge>
                        <p className="text-gray-500">
                          No previous session available
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No session data found</p>
                <p className="text-sm text-gray-400">
                  Create your first session below
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create New Session */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Session
            </CardTitle>
            <CardDescription>
              Create a new academic session. The current session will
              automatically become the previous session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="session">Session Name</Label>
                <Input
                  id="session"
                  type="text"
                  placeholder="e.g., Spring 2024, Fall 2024"
                  value={newSession}
                  onChange={(e) => setNewSession(e.target.value)}
                  disabled={creating}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={creating || !newSession.trim()}
                  className="flex-1"
                >
                  {creating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Session
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewSession("")}
                  disabled={creating}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionManagement;
