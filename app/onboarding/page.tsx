"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    role: "",
    skills: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userRes = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.details || errorData.error || "Failed to create user");
      }

      const userData = await userRes.json();
      const userId = userData.id;

      const analysisRes = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: formData.role,
          currentSkills: formData.skills,
          userId,
        }),
      });

      if (!analysisRes.ok) {
        const errorData = await analysisRes.json();
        throw new Error(errorData.details || errorData.error || "Failed to analyze skills");
      }

      router.push(`/dashboard?userId=${userId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .glass-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(148, 163, 184, 0.15);
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.05;
          filter: blur(80px);
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          top: -150px;
          left: -150px;
        }

        .orb-2 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          bottom: -100px;
          right: -100px;
        }
      `}</style>

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md animate-fadeInUp relative z-10">
        <div className="glass-card p-8 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg mb-4">
              <span className="text-sm font-semibold">Step {step}/3</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              SkillLens AI
            </h1>
            <p className="text-slate-400 text-sm">
              Discover your skill gaps and create a personalized learning roadmap
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="animate-fadeInUp space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => formData.email && setStep(2)}
                  disabled={!formData.email}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                >
                  Next →
                </Button>
              </div>
            )}

            {/* Step 2: Role */}
            {step === 2 && (
              <div className="animate-fadeInUp space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    💼 Target Job Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer, Data Scientist"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors duration-200"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => formData.role && setStep(3)}
                    disabled={!formData.role}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {step === 3 && (
              <div className="animate-fadeInUp space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    🎯 Current Skills
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="List your current skills (e.g., React, Python, SQL, etc.)"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors duration-200 resize-none"
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm bg-red-900/20 border border-red-700/50 p-4 rounded-lg animate-fadeInUp">
                    <span className="font-semibold">Error:</span> {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg transition-colors duration-200"
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.skills}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      "Get My Analysis ✨"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Progress indicator */}
          <div className="mt-8 flex gap-2 justify-center">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-indigo-600 w-8"
                    : "bg-slate-700 w-2"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
