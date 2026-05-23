'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/layout/AppShell';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Trash2, RefreshCw } from 'lucide-react';

export default function ResumePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [hasExistingResume, setHasExistingResume] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Check if resume exists
    const resumeUploaded = localStorage.getItem('resumeUploaded');
    setHasExistingResume(resumeUploaded === 'true');
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setUploadError('');
    }
  };

  const handleDeleteResume = () => {
    if (confirm('Are you sure you want to delete your resume and analysis? This cannot be undone.')) {
      localStorage.removeItem('careerAnalysis');
      localStorage.removeItem('resumeUploaded');
      setHasExistingResume(false);
      setResumeFile(null);
      setResumeText('');
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
      
      setHasExistingResume(true);
      
      // Redirect to dashboard
      router.push('/dashboard');
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

  return (
    <AppShell
      title="My Resume"
      subtitle="Upload or update your resume for personalized career insights"
    >
      <div className="max-w-3xl mx-auto">
        {/* Existing Resume Status */}
        {hasExistingResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 mb-6 bg-success/5 border-success/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">Resume Uploaded</h3>
                  <p className="text-sm text-text-secondary">
                    Your career analysis is ready on the dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeleteResume}
                className="btn-ghost text-danger hover:bg-danger/10 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {hasExistingResume ? (
                <RefreshCw className="w-8 h-8 text-brand" />
              ) : (
                <Upload className="w-8 h-8 text-brand" />
              )}
            </div>
            <h2 className="text-2xl font-display mb-2">
              {hasExistingResume ? 'Upload New Resume' : 'Upload Your Resume'}
            </h2>
            <p className="text-text-secondary">
              {hasExistingResume
                ? 'Replace your current resume with a new one'
                : 'Get AI-powered career recommendations and skill gap analysis'}
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
              {/* File Upload */}
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

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-bg-surface text-text-secondary">or paste text</span>
                </div>
              </div>

              {/* Text Input */}
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

              {/* Submit Button */}
              <button
                onClick={handleUploadAndParse}
                disabled={!resumeFile && !resumeText}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🤖 {hasExistingResume ? 'Update Resume & Re-analyze' : 'Analyze Resume & Get Career Insights'} →
              </button>
            </>
          )}
        </motion.div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
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
      </div>
    </AppShell>
  );
}
