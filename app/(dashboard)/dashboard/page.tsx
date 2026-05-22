'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import ProfileScore from '@/components/dashboard/ProfileScore';
import CareerCard from '@/components/dashboard/CareerCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Mock data - will be replaced with real API calls
const mockCareerMatches = [
  {
    id: '1',
    title: 'AI/ML Engineer',
    salary: '$145K avg',
    demand: 'High demand',
    timeline: '2–3 yr path',
    matchScore: 92,
    skills: {
      have: ['Python', 'TensorFlow'],
      need: ['MLOps', 'LLM fine-tuning'],
    },
    isBestFit: true,
  },
  {
    id: '2',
    title: 'Data Scientist',
    salary: '$125K avg',
    demand: 'Very high demand',
    timeline: '1–2 yr',
    matchScore: 85,
    skills: {
      have: ['SQL', 'Statistics'],
      need: ['Spark'],
    },
  },
  {
    id: '3',
    title: 'Cloud Architect',
    salary: '$155K avg',
    demand: 'Growing fast',
    timeline: '3–4 yr path',
    matchScore: 71,
    skills: {
      have: ['AWS', 'Docker'],
      need: ['Kubernetes', 'Terraform'],
    },
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Check if user has uploaded a resume (you can add API call here)
    // For now, we'll check localStorage or assume false for new users
    const resumeUploaded = localStorage.getItem('resumeUploaded');
    setHasResume(resumeUploaded === 'true');
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
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

        const uploadResponse = await fetch('/api/resume/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          throw new Error(uploadData.error || 'Failed to upload file');
        }

        const uploadData = await uploadResponse.json();
        extractedText = uploadData.text;
      }

      // Parse the resume
      setParsing(true);
      const parseResponse = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: extractedText,
          userId: user.id,
        }),
      });

      if (!parseResponse.ok) {
        const parseData = await parseResponse.json();
        throw new Error(parseData.error || 'Failed to parse resume');
      }

      const parseData = await parseResponse.json();
      
      // Mark resume as uploaded
      localStorage.setItem('resumeUploaded', 'true');
      setHasResume(true);
      
      // Refresh the page to show career matches
      window.location.reload();
    } catch (err: any) {
      console.error('Upload/parse error:', err);
      setUploadError(err.message || 'Failed to process resume. Please try again.');
    } finally {
      setUploading(false);
      setParsing(false);
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
                Our AI will analyze your skills and experience to find the best career matches for you
              </p>
            </div>

            {uploadError && (
              <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {uploadError}
              </div>
            )}

            {(uploading || parsing) && (
              <div className="mb-6 p-8 text-center bg-brand/5 rounded-lg border border-brand/20">
                <div className="text-4xl mb-4 animate-pulse">🤖</div>
                <div className="text-lg font-semibold mb-2">
                  {uploading && !parsing ? 'Uploading your resume...' : 'Analyzing with Gemini AI...'}
                </div>
                <div className="text-sm text-text-secondary">
                  {parsing ? 'Extracting skills, experience, and achievements' : 'Please wait...'}
                </div>
              </div>
            )}

            {!uploading && !parsing && (
              <>
                <div className="mb-6">
                  <div className="card p-8 border-2 border-dashed border-border hover:border-brand/50 transition-all text-center cursor-pointer">
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
                  🤖 Analyze Resume & Get Career Matches →
                </button>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      localStorage.setItem('resumeUploaded', 'true');
                      setHasResume(true);
                    }}
                    className="text-sm text-text-muted hover:text-brand"
                  >
                    Skip for now — I'll add this later
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '⚡', title: 'Fast Analysis', desc: 'Resume parsed in under 10 seconds' },
              { icon: '🎯', title: 'AI-Powered', desc: 'Gemini AI extracts skills & experience' },
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

  return (
    <AppShell
      title={`Good morning, ${user?.name?.split(' ')[0] || 'there'} 👋`}
      subtitle="3 new career matches since yesterday"
    >
      {/* Profile Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <ProfileScore score={user?.profileScore || 74} change={8} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Skills Mapped</div>
          <div className="text-4xl font-display text-text-primary mb-1">23</div>
          <div className="text-xs text-text-muted mb-3">5 gaps identified</div>
          <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: '82%' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Market Demand</div>
          <div className="text-2xl font-semibold text-success mb-1">HIGH</div>
          <div className="text-xs text-text-muted">AI/ML roles ↑ 29% YoY</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="text-text-secondary text-sm mb-2">Next Best Action</div>
          <div className="text-sm font-medium mb-1">Complete LLM certification</div>
          <div className="text-xs text-brand mb-3">+18% match score</div>
          <button className="btn-primary text-xs px-3 py-1.5">Do it →</button>
        </motion.div>
      </div>

      {/* Career Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display">Your career matches</h2>
          <div className="flex gap-2">
            {['All', 'Best fit', 'Fastest path', 'Highest salary', 'Saved'].map((filter) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === 'All'
                    ? 'bg-brand text-bg-base'
                    : 'bg-bg-surface text-text-secondary hover:bg-bg-elevated'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 mb-6">
          {mockCareerMatches.map((career, index) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <CareerCard {...career} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button className="text-brand hover:text-brand-dim transition-colors">
            See all 12 matches →
          </button>
        </div>
      </motion.div>

      {/* Secondary Content */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Peer Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">How professionals like you moved</h3>
          <p className="text-sm text-text-secondary mb-4">
            Based on collaborative filtering
          </p>

          <div className="space-y-3">
            {[
              { role: 'ML Engineer', percentage: 68 },
              { role: 'Data Scientist', percentage: 44 },
              { role: 'Product Manager', percentage: 31 },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">→ {item.role}</span>
                    <span className="text-sm text-brand font-semibold">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-text-muted mt-4">
            Based on 847 profiles matching yours
          </p>
        </motion.div>

        {/* AI Assistant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">AI Career Assistant</h3>

          <div className="space-y-4 mb-4">
            <div className="bg-bg-elevated p-4 rounded-lg">
              <p className="text-sm text-text-secondary">
                Based on your resume, your fastest path to ML Engineer is TensorFlow
                certification. 87 similar profiles finished this in 4–6 months.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything about your career..."
              className="input-dark flex-1 text-sm"
            />
            <button className="btn-primary px-4 py-2 text-sm">Send</button>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
