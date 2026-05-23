'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import ProfileScore from '@/components/dashboard/ProfileScore';
import CareerCard from '@/components/dashboard/CareerCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, TrendingUp, Target, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Analysis results
  const [careerData, setCareerData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'skillGaps'>('recommendations');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Check if analysis data exists
    const savedAnalysis = localStorage.getItem('careerAnalysis');
    if (savedAnalysis) {
      setCareerData(JSON.parse(savedAnalysis));
      setHasResume(true);
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleUploadAndParse = async () => {
    if (!resumeFile && !resumeText) {
      setUploadError('Please select a file or paste your resume text');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      let extractedText = resumeText;

      // If file is selected, upload it first
      if (resumeFile) {
        const formData = new FormData();
        formData.append('file', resumeFile);

        const uploadResponse = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          throw new Error(uploadData.error || 'Failed to upload file');
        }

        const uploadData = await uploadResponse.json();
        extractedText = uploadData.text;
        console.log('📄 PDF parsed, text length:', extractedText.length);
      }

      setUploading(false);
      setParsing(true);

      // Extract skills using Gemini AI
      const skillsResponse = await fetch('/api/ai/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!skillsResponse.ok) {
        throw new Error('Failed to extract skills');
      }

      const { skills } = await skillsResponse.json();
      console.log('✨ Skills extracted:', skills);

      setParsing(false);
      setAnalyzing(true);

      // Analyze career paths and skill gaps
      const analysisResponse = await fetch('/api/ai/analyze-career', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skills }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze career');
      }

      const analysisData = await analysisResponse.json();
      console.log('🎯 Career analysis complete:', analysisData);

      // Save to localStorage
      localStorage.setItem('careerAnalysis', JSON.stringify(analysisData));
      localStorage.setItem('resumeUploaded', 'true');
      
      setCareerData(analysisData);
      setHasResume(true);
    } catch (err: any) {
      console.error('Error:', err);
      setUploadError(err.message || 'Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
      setParsing(false);
      setAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Show resume upload screen if no resume
  if (!hasResume) {
    return (
      <AppShell
        title={`Welcome, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Let's get started by uploading your resume"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card p-8 mb-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl font-display mb-3">
                Upload your resume to get started
              </h2>
              <p className="text-text-secondary">
                Our AI will analyze your skills and provide personalized career recommendations
              </p>
            </div>

            {uploadError && (
              <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {uploadError}
              </div>
            )}

            {(uploading || parsing || analyzing) && (
              <div className="mb-6 p-8 text-center bg-brand/5 rounded-lg border border-brand/20">
                <div className="text-4xl mb-4 animate-pulse">🤖</div>
                <div className="text-lg font-semibold mb-2">
                  {uploading && 'Uploading your resume...'}
                  {parsing && 'Extracting skills with Gemini AI...'}
                  {analyzing && 'Analyzing career paths and skill gaps...'}
                </div>
                <div className="text-sm text-text-secondary">
                  {analyzing ? 'This may take 10-15 seconds' : 'Please wait...'}
                </div>
              </div>
            )}

            {!uploading && !parsing && !analyzing && (
              <>
                <div className="mb-6">
                  <div className="card p-8 border-2 border-dashed border-border hover:border-brand/50 transition-all text-center cursor-pointer bg-bg-elevated">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                      <div className="text-5xl mb-4">📄</div>
                      <div className="text-lg mb-2">
                        {resumeFile ? resumeFile.name : 'Drag & drop your resume here'}
                      </div>
                      <div className="text-sm text-text-secondary mb-4">
                        PDF, DOCX, or TXT · Max 10 MB
                      </div>
                      <button type="button" className="btn-ghost">
                        Browse files
                      </button>
                    </label>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-bg-surface text-text-secondary">or paste text</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Paste your resume text
                  </label>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your full resume here..."
                    className="input-dark w-full h-32 resize-none"
                  />
                </div>

                <button
                  onClick={handleUploadAndParse}
                  disabled={!resumeFile && !resumeText}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🤖 Analyze Resume & Get Career Insights →
                </button>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Fast Analysis', desc: 'Complete analysis in under 20 seconds' },
              { icon: '🎯', title: 'AI-Powered', desc: 'Gemini AI provides personalized insights' },
              { icon: '🔒', title: 'Secure', desc: 'Your data is encrypted and private' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-4 text-center"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold text-sm mb-1">{feature.title}</div>
                <div className="text-xs text-text-secondary">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AppShell>
    );
  }

  // Show career analysis results
  return (
    <AppShell
      title={`Good morning, ${user?.name?.split(' ')[0] || 'there'} 👋`}
      subtitle="Your personalized career insights"
    >
      {/* Overall Analysis Card */}
      {careerData?.overallAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Overall Analysis</h3>
            <button
              onClick={() => {
                localStorage.removeItem('careerAnalysis');
                localStorage.removeItem('resumeUploaded');
                setHasResume(false);
                setCareerData(null);
              }}
              className="btn-ghost text-sm"
            >
              📄 Upload New Resume
            </button>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-text-secondary text-sm mb-2">Career Readiness</div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-display text-brand">
                  {careerData.overallAnalysis.careerReadiness}%
                </div>
                <div className="text-xs text-success">↑ Strong</div>
              </div>
            </div>
            <div>
              <div className="text-text-secondary text-sm mb-2">Market Demand</div>
              <div className="text-2xl font-semibold text-success">
                {careerData.overallAnalysis.marketDemand}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-text-secondary text-sm mb-2">Your Strengths</div>
              <div className="flex flex-wrap gap-2">
                {careerData.overallAnalysis.strengths.slice(0, 2).map((strength: string, i: number) => (
                  <span key={i} className="text-xs px-3 py-1 bg-brand/10 text-brand rounded-full">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'recommendations'
              ? 'bg-brand text-bg-base'
              : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Career Recommendations
        </button>
        <button
          onClick={() => setActiveTab('skillGaps')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            activeTab === 'skillGaps'
              ? 'bg-brand text-bg-base'
              : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
          }`}
        >
          <Target className="w-5 h-5" />
          Skill Gaps & Learning
        </button>
      </div>

      {/* Career Recommendations Tab */}
      {activeTab === 'recommendations' && careerData?.careerRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {careerData.careerRecommendations.map((career: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:border-brand/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-display">{career.title}</h3>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-brand text-bg-base text-xs font-semibold rounded-full">
                        Best Fit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                    <span>💰 {career.salaryRange}</span>
                    <span>📈 {career.demandLevel} demand</span>
                    <span>⏱ {career.timeline}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display text-brand mb-1">
                    {career.matchScore}%
                  </div>
                  <div className="text-xs text-text-secondary">Match Score</div>
                </div>
              </div>

              <p className="text-text-secondary mb-4">{career.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold mb-2">Key Responsibilities</div>
                  <ul className="space-y-1">
                    {career.keyResponsibilities.map((resp: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-brand mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-semibold mb-2">Required Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-bg-elevated text-text-secondary text-xs rounded-full border border-border"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Skill Gaps Tab */}
      {activeTab === 'skillGaps' && careerData?.skillGaps && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {careerData.skillGaps.map((category: any, catIndex: number) => (
            <motion.div
              key={catIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="card p-6"
            >
              <h3 className="text-xl font-display mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand" />
                {category.category}
              </h3>

              <div className="space-y-6">
                {category.missingSkills.map((skill: any, skillIndex: number) => (
                  <div key={skillIndex} className="border-l-2 border-brand/30 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            skill.importance === 'High'
                              ? 'bg-danger/10 text-danger'
                              : 'bg-warning/10 text-warning'
                          }`}
                        >
                          {skill.importance} Priority
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mb-4">{skill.description}</p>

                    <div className="bg-bg-elevated rounded-lg p-4">
                      <div className="text-sm font-semibold mb-3">Learning Resources</div>
                      <div className="space-y-3">
                        {skill.learningResources.map((resource: any, resIndex: number) => (
                          <div
                            key={resIndex}
                            className="flex items-start justify-between p-3 bg-bg-surface rounded-lg hover:bg-bg-muted transition-all"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{resource.title}</span>
                                <span className="text-xs px-2 py-0.5 bg-brand/10 text-brand rounded">
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
                              className="btn-ghost px-3 py-1 text-xs flex items-center gap-1"
                            >
                              View
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Next Steps */}
          {careerData?.overallAnalysis?.nextSteps && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6 bg-brand/5 border-brand/20"
            >
              <h3 className="text-xl font-display mb-4">🎯 Your Next Steps</h3>
              <div className="space-y-3">
                {careerData.overallAnalysis.nextSteps.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand text-bg-base flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-text-secondary">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AppShell>
  );
}
