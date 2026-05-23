'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import SkillLevelBadge from '@/components/dashboard/SkillLevelBadge';
import { Target, BookOpen, ExternalLink, TrendingUp } from 'lucide-react';

export default function SkillsPage() {
  const router = useRouter();
  const [careerData, setCareerData] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    // Load career analysis data
    const savedAnalysis = localStorage.getItem('careerAnalysis');
    if (savedAnalysis) {
      setCareerData(JSON.parse(savedAnalysis));
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <AppShell title="Skill Gap Analysis" subtitle="Loading your skill analysis...">
        <div className="flex items-center justify-center py-20">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </AppShell>
    );
  }

  if (!careerData || !careerData.careerRecommendations) {
    return (
      <AppShell title="Skill Gap Analysis" subtitle="Upload your resume to see skill gaps">
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            No Skill Analysis Available
          </h2>
          <p className="text-text-secondary mb-6">
            Upload your resume to get personalized skill gap analysis and learning recommendations
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Upload Resume →
          </button>
        </div>
      </AppShell>
    );
  }

  const selectedCareer = careerData.careerRecommendations[selectedRole];

  return (
    <AppShell 
      title="Skill Gap Analysis" 
      subtitle="Identify and close skill gaps for your target career"
    >
      <div className="space-y-6">
        {/* Role Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4">Select a Career Role</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {careerData.careerRecommendations.map((career: any, index: number) => (
              <button
                key={index}
                onClick={() => setSelectedRole(index)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedRole === index
                    ? 'bg-brand text-white shadow-lg'
                    : 'bg-bg-muted text-text-primary hover:bg-border'
                }`}
              >
                <div className="font-bold mb-1">{career.title}</div>
                <div className={`text-sm ${selectedRole === index ? 'text-white/80' : 'text-text-secondary'}`}>
                  {career.matchScore}% Match • {career.salaryRange}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column: Skill Proficiency */}
          <div className="space-y-6">
            {/* Skill Proficiency Card */}
            {selectedCareer?.skillGaps && (
              <motion.div
                key={`skills-${selectedRole}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-brand" />
                  </span>
                  Skill Proficiency for {selectedCareer.title}
                </h3>

                {/* Technical Skills */}
                {selectedCareer.skillGaps.technical?.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-text-primary mb-4">Technical Skills</h4>
                    <div className="space-y-4">
                      {selectedCareer.skillGaps.technical.map((skill: any, i: number) => (
                        <SkillLevelBadge key={i} skill={skill} index={i} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Soft Skills */}
                {selectedCareer.skillGaps.soft?.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-text-primary mb-4">Soft Skills</h4>
                    <div className="space-y-4">
                      {selectedCareer.skillGaps.soft.map((skill: any, i: number) => (
                        <SkillLevelBadge key={i} skill={skill} index={i} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Overall Readiness */}
            {careerData?.overallAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-8"
              >
                <h3 className="text-xl font-bold text-text-primary mb-6 text-center flex items-center justify-center gap-2">
                  <TrendingUp className="w-6 h-6 text-brand" />
                  Overall Career Readiness
                </h3>
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="12"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="80"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
                        animate={{
                          strokeDashoffset: 2 * Math.PI * 80 * (1 - careerData.overallAnalysis.careerReadiness / 100),
                        }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-brand">
                        {careerData.overallAnalysis.careerReadiness}%
                      </div>
                      <div className="text-sm text-text-secondary mt-2">Ready</div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-text-secondary mb-2">Market Demand</div>
                  <div className="text-2xl font-bold text-success">
                    {careerData.overallAnalysis.marketDemand}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Learning Path */}
          <div className="space-y-6">
            {/* Learning Path */}
            {selectedCareer?.learningPath && (
              <motion.div
                key={`learning-${selectedRole}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-success" />
                  </span>
                  Recommended Learning Path
                </h3>

                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-8">
                    {selectedCareer.learningPath.map((step: any, index: number) => (
                      <div key={index} className="relative pl-16">
                        {/* Step Number */}
                        <div className="absolute left-0 w-12 h-12 bg-brand text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                          {step.step}
                        </div>

                        <div className="bg-bg-muted rounded-xl p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold text-text-primary">{step.title}</h4>
                              <p className="text-sm text-text-secondary mt-1">
                                ⏱ Estimated Duration: {step.duration}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {step.resources.map((resource: any, resIndex: number) => (
                              <div
                                key={resIndex}
                                className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-all"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-text-primary">{resource.title}</span>
                                    <span className="text-xs px-2 py-0.5 bg-brand/10 text-brand rounded font-medium">
                                      {resource.type}
                                    </span>
                                  </div>
                                  <div className="text-xs text-text-secondary">
                                    ⏱ {resource.duration}
                                  </div>
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dim transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                  Start Learning
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            {careerData?.overallAnalysis?.nextSteps && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-8 bg-gradient-to-br from-brand/5 to-brand/10 border-brand/20"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-6">🎯 Your Next Steps</h3>
                <div className="space-y-4">
                  {careerData.overallAnalysis.nextSteps.map((step: string, i: number) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-white rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-text-primary font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
