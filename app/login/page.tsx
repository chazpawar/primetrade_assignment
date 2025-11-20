/**
 * Login Page
 * User authentication with form validation and error handling
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { LogIn, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Login failed");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Store token in cookie for middleware
      document.cookie = `token=${result.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12" style={{ backgroundColor: 'var(--background)' }}>
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-12">
           
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Step Beyond Routine.<br />
              Work Intelligently.
            </h1>
            
            <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              Ethron helps teams automate complex workflows, predict outcomes, and make faster decisions. All through an adaptive AI that learns how you work.
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Input
                {...register("email")}
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                error={errors.email?.message}
                disabled={isLoading}
                required
                autoComplete="email"
              />

              <Input
                {...register("password")}
                type="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                disabled={isLoading}
                required
                autoComplete="current-password"
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="flex-1"
                  style={{ backgroundColor: 'var(--text-primary)', color: 'white' }}
                >
                  <LogIn className="w-5 h-5" />
                  Get Started
                </Button>
              </div>
            </form>

            <div className="text-center pt-4">
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium underline hover:opacity-70"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="relative w-full h-full">
          <Image
            src="/images/image.png"
            alt="Abstract holographic design"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
      </div>
    </div>
  );
}
