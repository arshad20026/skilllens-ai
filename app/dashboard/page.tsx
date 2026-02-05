"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface Analysis {
  id: string;
  role: string;
  skillsGap: string;
  roadmap: string;
  createdAt: string;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAnalyses = async () => {
      try {
        const res = await fetch(`/api/analyses?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setAnalyses(data);
        }
      } catch (error) {
        console.error("Failed to fetch analyses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [userId]);

  const handleDownload = async (analysisId: string, role: string) => {
    try {
      setDownloadingId(analysisId);
      const response = await fetch(`/api/download?id=${analysisId}`);
      
      if (!response.ok) throw new Error("Failed to download report");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `skillgap-${role.replace(/ /g, "-")}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download report");
    } finally {
      setDownloadingId(null);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="p-8 text-center glass-morphism border-slate-700 shadow-lg">
          <p className="text-slate-400 mb-4">No user ID provided</p>
          <Link href="/onboarding">
            <Button className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500">
              Start Onboarding
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 p-8 relative overflow-hidden">
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-slideIn {
          animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 animate-fadeInUp">
          <h1 className="text-4xl font-bold text-white mb-2">
            📊 Your Skill Analysis Dashboard
          </h1>
          <p className="text-slate-400">
            Track your progress and personalized learning roadmaps
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block">
                <svg className="animate-spin h-12 w-12 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-slate-400 mt-4">Loading your analyses...</p>
            </div>
          </div>
        ) : analyses.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center animate-fadeInUp">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-white mb-2">No analyses yet</h2>
            <p className="text-slate-400">Get started by analyzing your skills in the onboarding process</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {analyses.map((analysis, index) => {
              let skillsData;
              let roadmapData;
              try {
                skillsData = JSON.parse(analysis.skillsGap);
                roadmapData = JSON.parse(analysis.roadmap);
              } catch {
                skillsData = { missingSkills: [analysis.skillsGap] };
                roadmapData = { timeline: analysis.roadmap };
              }

              const date = new Date(analysis.createdAt);
              const formattedDate = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={analysis.id}
                  className="glass-card p-8 rounded-xl animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-700">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        💼 {analysis.role}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        Analyzed on {formattedDate}
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/50 rounded-lg">
                      <span className="text-indigo-300 text-sm font-semibold">
                        ID: {analysis.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  {/* Skills Gap Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center">
                      🎯 Skills Gap Analysis
                    </h3>
                    {skillsData.missingSkills ? (
                      <div>
                        <p className="text-slate-300 mb-4 leading-relaxed">
                          {skillsData.gapAnalysis || "Analysis of your current skill level compared to target role requirements"}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(Array.isArray(skillsData.missingSkills) ? skillsData.missingSkills : [skillsData.missingSkills]).map(
                            (skill: string, idx: number) => (
                              <div
                                key={idx}
                                className="bg-slate-800/50 px-4 py-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
                              >
                                <p className="text-slate-300">
                                  <span className="text-blue-400 font-semibold">→</span> {skill}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400">{analysis.skillsGap}</div>
                    )}
                  </div>

                  {/* Roadmap Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-emerald-400 mb-4 flex items-center">
                      🗺️ Learning Roadmap
                    </h3>
                    {roadmapData.phases ? (
                      <div>
                        <div className="mb-4">
                          <p className="text-slate-300 mb-3 leading-relaxed">
                            {roadmapData.roadmapDescription || "Structured learning path to bridge your skill gaps"}
                          </p>
                          {roadmapData.timelineEstimate && (
                            <div className="inline-block px-4 py-2 bg-emerald-600/20 border border-emerald-500/50 rounded-lg">
                              <span className="text-emerald-300 text-sm font-semibold">
                                ⏱️ {roadmapData.timelineEstimate}
                              </span>
                            </div>
                          )}
                        </div>

                        {Array.isArray(roadmapData.phases) && roadmapData.phases.length > 0 && (
                          <div className="space-y-3">
                            {roadmapData.phases.map((phase: string, idx: number) => (
                              <div key={idx} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                <p className="text-emerald-400 font-semibold mb-2">
                                  Phase {idx + 1}: {phase}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-400 bg-slate-800/50 p-4 rounded-lg">
                        {analysis.roadmap}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg transition-colors">
                      📄 View Details
                    </Button>
                    <Button 
                      onClick={() => handleDownload(analysis.id, analysis.role)}
                      disabled={downloadingId === analysis.id}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === analysis.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        "⬇️ Download Report"
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
