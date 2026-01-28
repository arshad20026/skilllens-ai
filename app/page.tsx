"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to onboarding page
    router.push("/onboarding");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
      <h1 className="text-4xl font-bold text-white">Loading SkillLens AI...</h1>
    </main>
  );
}
