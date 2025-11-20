/**
 * Dashboard Home Page
 * Overview with user stats and quick actions
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { User, Database, Calendar, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalEntities: 0,
    activeEntities: 0,
    memberSince: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }

        // Fetch profile with stats
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const result = await response.json();
            
            // Fetch entities for stats
            const entitiesResponse = await fetch("/api/entities", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (entitiesResponse.ok) {
              const entitiesResult = await entitiesResponse.json();
              const entities = entitiesResult.data;
              
              setStats({
                totalEntities: entities.length,
                activeEntities: entities.filter((e: any) => e.status === "active").length,
                memberSince: new Date(result.data.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Entities
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.totalEntities}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Entities
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.activeEntities}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Member Since
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stats.memberSince}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/dashboard/entities"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Manage Entities
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View and edit your entities
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    View Profile
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your account
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {stats.totalEntities === 0 && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Get Started
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't created any entities yet. Start by creating your first entity!
            </p>
            <Link href="/dashboard/entities">
              <Button variant="primary">
                <Database className="w-4 h-4" />
                Create Your First Entity
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
