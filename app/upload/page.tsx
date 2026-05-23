'use client';

import { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, Edit2, Plus, X } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [editableSkills, setEditableSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Step 1: Upload and parse PDF
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/parse-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to parse PDF');
      }

      const { text } = await uploadResponse.json();
      console.log('📄 Extracted text:', text.substring(0, 200) + '...');

      setUploading(false);
      setExtracting(true);

      // Step 2: Extract skills using Gemini AI
      const skillsResponse = await fetch('/api/ai/extract-skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!skillsResponse.ok) {
        throw new Error('Failed to extract skills');
      }

      const { skills: extractedSkills } = await skillsResponse.json();
      setEditableSkills(extractedSkills);
      console.log('✨ Skills extracted:', extractedSkills);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setUploading(false);
      setExtracting(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setEditableSkills(editableSkills.filter((_, i) => i !== index));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !editableSkills.includes(newSkill.trim())) {
      setEditableSkills([...editableSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const handleProceedToRecommendations = () => {
    console.log('🚀 Proceeding with skills:', editableSkills);
    // TODO: Navigate to recommendations page or trigger Phase 3
    alert(`Phase 3: Career Recommendations coming next!\n\nYour ${editableSkills.length} skills: ${editableSkills.join(', ')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900">CareerAI</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600" />
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {editableSkills.length === 0 ? (
          /* Upload Zone */
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Discover Your Career Path
            </h1>
            <p className="text-lg text-slate-600 mb-12">
              Upload your resume and let AI analyze your skills
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="relative bg-white border-2 border-dashed border-slate-300 rounded-2xl p-16 hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />

              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
                  <Upload className="w-10 h-10 text-indigo-600" />
                </div>

                {file ? (
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <span className="text-slate-900 font-medium">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-semibold text-slate-900 mb-2">
                      Drop your resume here or browse files
                    </p>
                    <p className="text-slate-500 text-sm">
                      PDF or DOCX • Max 10 MB
                    </p>
                  </>
                )}
              </div>
            </div>

            {file && (
              <button
                onClick={handleUpload}
                disabled={uploading || extracting}
                className="mt-8 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {uploading
                  ? 'Uploading...'
                  : extracting
                  ? 'Analyzing with AI...'
                  : 'Analyze Resume →'}
              </button>
            )}

            {(uploading || extracting) && (
              <div className="mt-8 flex items-center justify-center gap-3 text-slate-600">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">
                  {uploading ? 'Parsing your resume...' : 'Extracting skills with Gemini AI...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Editable Skills Section */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Skills Extracted Successfully</h2>
                <p className="text-slate-600">Review and edit your skills before proceeding</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">Your Skills</h3>
                </div>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {editableSkills.length} skills
                </span>
              </div>

              {/* Editable Skills Grid */}
              <div className="flex flex-wrap gap-3 mb-6">
                {editableSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm border border-blue-200 hover:bg-blue-100 transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-200 rounded-full p-0.5"
                      title="Remove skill"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Skill */}
              <div className="border-t border-slate-200 pt-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Add More Skills
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Python, Leadership, AWS..."
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400"
                  />
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Press Enter or click Add to include additional skills
                </p>
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToRecommendations}
              disabled={editableSkills.length === 0}
              className="w-full px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
            >
              Get Career Recommendations →
            </button>

            <p className="text-center text-sm text-slate-500 mt-4">
              We'll analyze your skills and recommend the best career paths
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
