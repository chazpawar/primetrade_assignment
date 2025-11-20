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
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--border-color)', borderTopColor: 'transparent' }}></div>
          <p style={{ color: 'var(--text-primary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Welcome back to Primetrade.ai, {user?.name || "User"}!
        </h1>
        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
          Primetrade.ai is a niche AI and blockchain venture studio helping multiple product startups
          grow across cutting-edge fields—track their momentum below.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Total Entities
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                  {stats.totalEntities}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
                <Database className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Active Entities
                </p>
                <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                  {stats.activeEntities}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Member Since
                </p>
                <p className="text-lg font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                  {stats.memberSince}
                </p>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card-inner)' }}>
                <Calendar className="w-6 h-6" style={{ color: 'var(--text-primary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: 'var(--text-primary)' }}>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/dashboard/entities"
              className="flex items-center justify-between p-4 rounded-lg hover:opacity-80 transition-colors group"
              style={{ backgroundColor: 'var(--card-inner)' }}
            >
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Manage Entities
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    View and edit your entities
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 transition-colors" style={{ color: '#313131', opacity: 0.5 }} />
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center justify-between p-4 rounded-lg hover:opacity-80 transition-colors group"
              style={{ backgroundColor: 'var(--card-inner)' }}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    View Profile
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Manage your account
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 transition-colors" style={{ color: '#313131', opacity: 0.5 }} />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      {stats.totalEntities === 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Get Started
            </h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              You haven't created any entities yet. Start by creating your first entity!
            </p>
            <Link href="/dashboard/entities">
              <Button variant="primary" style={{ backgroundColor: '#313131', color: 'white' }}>
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
