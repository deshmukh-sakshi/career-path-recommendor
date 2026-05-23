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
  const [selectedRole, setSelectedRole] = useState<number>(0); // Index of selected career for skill gaps

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
          className="card p-8 mb-8 shadow-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary">Overall Analysis</h3>
            <button
              onClick={() => {
                localStorage.removeItem('careerAnalysis');
                localStorage.removeItem('resumeUploaded');
                setHasResume(false);
                setCareerData(null);
              }}
              className="px-4 py-2 text-sm font-medium text-brand bg-brand-subtle hover:bg-brand/10 rounded-lg transition-all flex items-center gap-2"
            >
              <span>📄</span>
              Upload New Resume
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-brand/5 to-brand/10 rounded-xl border border-brand/20">
              <div className="text-text-secondary text-sm mb-2 font-medium">Career Readiness</div>
              <div className="flex items-baseline gap-3">
                <div className="text-5xl font-bold text-brand">
                  {careerData.overallAnalysis.careerReadiness}%
                </div>
                <div className="text-sm text-success font-semibold px-2 py-1 bg-success/10 rounded">
                  ↑ Strong
                </div>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-success/5 to-success/10 rounded-xl border border-success/20">
              <div className="text-text-secondary text-sm mb-2 font-medium">Market Demand</div>
              <div className="text-3xl font-bold text-success">
                {careerData.overallAnalysis.marketDemand}
              </div>
              <div className="text-xs text-text-muted mt-1">Based on current trends</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-info/5 to-info/10 rounded-xl border border-info/20">
              <div className="text-text-secondary text-sm mb-2 font-medium">Your Strengths</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {careerData.overallAnalysis.strengths.slice(0, 2).map((strength: string, i: number) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-white border border-border text-text-primary rounded-full font-medium">
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'recommendations'
              ? 'bg-brand text-white shadow-lg shadow-brand/25'
              : 'bg-white text-text-secondary hover:bg-bg-muted border border-border'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          Career Recommendations
        </button>
        <button
          onClick={() => setActiveTab('skillGaps')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'skillGaps'
              ? 'bg-brand text-white shadow-lg shadow-brand/25'
              : 'bg-white text-text-secondary hover:bg-bg-muted border border-border'
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
              className="card p-8 hover:shadow-elevated transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-text-primary">{career.title}</h3>
                    {index === 0 && (
                      <span className="px-3 py-1 bg-gradient-to-r from-brand to-brand-dim text-white text-xs font-bold rounded-full shadow-sm">
                        ⭐ Best Fit
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <span className="text-success">💰</span>
                      <span className="font-semibold text-text-primary">{career.salaryRange}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-info">📈</span>
                      <span className="font-semibold text-text-primary">{career.demandLevel}</span> demand
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-warning">⏱</span>
                      <span className="font-semibold text-text-primary">{career.timeline}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(career.matchScore / 100) * 251.2} 251.2`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-brand">{career.matchScore}%</span>
                      <span className="text-xs text-text-muted font-medium">Match</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-text-secondary leading-relaxed mb-6">{career.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-bg-muted rounded-lg">
                  <div className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-brand/10 rounded flex items-center justify-center text-brand">✓</span>
                    Key Responsibilities
                  </div>
                  <ul className="space-y-2">
                    {career.keyResponsibilities.map((resp: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-brand mt-0.5 font-bold">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-bg-muted rounded-lg">
                  <div className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 bg-info/10 rounded flex items-center justify-center text-info">⚡</span>
                    Required Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {career.requiredSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white border border-border text-text-primary text-xs rounded-lg font-medium hover:border-brand hover:text-brand transition-all"
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
      {activeTab === 'skillGaps' && careerData?.careerRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Role Selector */}
          <div className="card p-6">
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
                    {career.matchScore}% Match
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Skill Proficiency for Selected Role */}
          {careerData.careerRecommendations[selectedRole]?.skillGaps && (
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-brand" />
                </span>
                Skill Proficiency for {careerData.careerRecommendations[selectedRole].title}
              </h3>

              {/* Technical Skills */}
              {careerData.careerRecommendations[selectedRole].skillGaps.technical?.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-text-primary mb-4">Technical Skills</h4>
                  <div className="space-y-4">
                    {careerData.careerRecommendations[selectedRole].skillGaps.technical.map((skill: any, i: number) => (
                      <div key={i} className="p-4 bg-bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-text-primary">{skill.name}</h5>
                            <p className="text-sm text-text-secondary mt-1">{skill.description}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              skill.importance === 'High'
                                ? 'bg-danger/10 text-danger'
                                : 'bg-warning/10 text-warning'
                            }`}
                          >
                            {skill.importance} Priority
                          </span>
                        </div>
                        
                        {/* Progress Bars */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-text-secondary">Current Level</span>
                              <span className="font-semibold text-text-primary">{skill.currentLevel}%</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-info rounded-full transition-all"
                                style={{ width: `${skill.currentLevel}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-text-secondary">Required Level</span>
                              <span className="font-semibold text-brand">{skill.requiredLevel}%</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full transition-all"
                                style={{ width: `${skill.requiredLevel}%` }}
                              />
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-text-secondary">Gap:</span>
                              <span className="font-bold text-danger">
                                {skill.requiredLevel - skill.currentLevel}% to improve
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Soft Skills */}
              {careerData.careerRecommendations[selectedRole].skillGaps.soft?.length > 0 && (
                <div>
                  <h4 className="text-lg font-bold text-text-primary mb-4">Soft Skills</h4>
                  <div className="space-y-4">
                    {careerData.careerRecommendations[selectedRole].skillGaps.soft.map((skill: any, i: number) => (
                      <div key={i} className="p-4 bg-bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h5 className="font-semibold text-text-primary">{skill.name}</h5>
                            <p className="text-sm text-text-secondary mt-1">{skill.description}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              skill.importance === 'High'
                                ? 'bg-danger/10 text-danger'
                                : 'bg-warning/10 text-warning'
                            }`}
                          >
                            {skill.importance} Priority
                          </span>
                        </div>
                        
                        {/* Progress Bars */}
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-text-secondary">Current Level</span>
                              <span className="font-semibold text-text-primary">{skill.currentLevel}%</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-info rounded-full transition-all"
                                style={{ width: `${skill.currentLevel}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-text-secondary">Required Level</span>
                              <span className="font-semibold text-brand">{skill.requiredLevel}%</span>
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full transition-all"
                                style={{ width: `${skill.requiredLevel}%` }}
                              />
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-text-secondary">Gap:</span>
                              <span className="font-bold text-danger">
                                {skill.requiredLevel - skill.currentLevel}% to improve
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Learning Path for Selected Role */}
          {careerData.careerRecommendations[selectedRole]?.learningPath && (
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
                  {careerData.careerRecommendations[selectedRole].learningPath.map((step: any, index: number) => (
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
        </motion.div>
      )}
    </AppShell>
  );
}
