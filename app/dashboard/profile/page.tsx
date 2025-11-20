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
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--border-color)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--text-primary)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Profile
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Your account information and statistics
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--card-accent)' }}>
              <User className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Full Name</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {profile?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--card-accent)' }}>
              <Mail className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email Address</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--card-accent)' }}>
              <Calendar className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Member Since</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--card-accent)' }}>
              <Database className="w-8 h-8" style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Entities</p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
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
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Account ID</p>
            <code className="block p-3 rounded-lg text-sm font-mono break-all" style={{ backgroundColor: '#c8cacc', color: '#313131' }}>
              {profile?.id}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
