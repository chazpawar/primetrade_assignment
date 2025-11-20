/**
 * Register Page
 * User registration with password strength validation
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    const labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-green-600",
    ];

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || "",
      color: colors[strength - 1] || "",
    };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Registration failed");
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
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign up to get started with our platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 text-sm"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Input
                {...register("name")}
                type="text"
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                disabled={isLoading}
                required
                autoComplete="name"
              />

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

              <div>
                <Input
                  {...register("password")}
                  type="password"
                  label="Password"
                  placeholder="Create a strong password"
                  error={errors.password?.message}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                  helperText="Must be at least 8 characters with uppercase, lowercase, and number"
                />

                {password && password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Password Strength:
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.strength >= 80
                            ? "text-green-600"
                            : passwordStrength.strength >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`${passwordStrength.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
              >
                <UserPlus className="w-5 h-5" />
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
