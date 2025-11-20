/**
 * User Profile Page
 * Displays user information fetched from backend
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { User, Mail, Calendar, Database } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const response = await fetch("/api/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const result = await response.json();
        setProfile(result.data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Your account information and statistics
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {profile?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <Calendar className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Database className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Entities</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {profile?._count?.entities || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account ID */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Account ID</p>
            <code className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
              {profile?.id}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
