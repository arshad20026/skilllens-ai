"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const router = useRouter();

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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .glass-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(148, 163, 184, 0.15);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          background: rgba(30, 41, 59, 0.95);
          border-color: rgba(148, 163, 184, 0.3);
        }

        .bg-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.05;
          filter: blur(80px);
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          top: -200px;
          left: -200px;
        }

        .orb-2 {
          width: 450px;
          height: 450px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          bottom: -150px;
          right: -150px;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>

      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb orb-1 animate-float"></div>
        <div className="bg-orb orb-2 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="bg-orb orb-3 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl animate-fadeInUp relative z-10 text-center">
        <div className="glass-card p-12 rounded-2xl shadow-2xl">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="inline-block text-6xl mb-4 animate-float">🚀</div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              SkillLens AI
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Discover your skill gaps and create a personalized learning roadmap powered by AI
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Skill Gap Analysis</h3>
              <p className="text-sm text-slate-400">
                Identify what skills you need to reach your career goals
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Learning Roadmap</h3>
              <p className="text-sm text-slate-400">
                Get a structured path to bridge your skill gaps
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-sm text-slate-400">
                Monitor your learning journey and achievements
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-6 px-8 rounded-lg transition-colors duration-200 text-lg">
                Get Started Free ✨
              </Button>
            </Link>
            <Button 
              onClick={() => router.push('/onboarding')}
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-white font-semibold py-6 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Start Analysis →
            </Button>
          </div>

          {/* Footer Note */}
          <p className="text-slate-500 text-sm mt-8">
            Powered by Google Gemini AI • Free to use
          </p>
        </div>
      </div>
    </div>
  );
}