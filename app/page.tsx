"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: 'var(--text-primary)' }} />
        <p className="text-lg" style={{ color: 'var(--text-primary)' }}>Loading...</p>
      </div>
    </div>
  );
}
