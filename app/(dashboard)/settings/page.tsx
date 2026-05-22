'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';

const settingsTabs = ['Profile', 'Preferences', 'Resume History', 'Notifications', 'Account'];

const workModes = ['Remote', 'Hybrid', 'In-office'];

const interestDomains = [
  'Artificial Intelligence',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Web Development',
  'Mobile Development',
  'DevOps',
  'Product Management',
  'UX/UI Design',
  'Blockchain',
  'IoT',
  'Game Development',
];

const careerGoals = [
  'Switch to tech',
  'Get promoted',
  'Learn new skills',
  'Increase salary',
  'Work remotely',
  'Start freelancing',
];

const mockResumeHistory = [
  {
    id: '1',
    filename: 'resume_2024_v3.pdf',
    parsedDate: '2024-05-15',
    confidence: 94,
    skillsCount: 23,
    isActive: true,
  },
  {
    id: '2',
    filename: 'john_doe_resume.pdf',
    parsedDate: '2024-04-20',
    confidence: 89,
    skillsCount: 19,
    isActive: false,
  },
  {
    id: '3',
    filename: 'resume_old.docx',
    parsedDate: '2024-03-10',
    confidence: 76,
    skillsCount: 15,
    isActive: false,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [user, setUser] = useState<any>(null);
  const [avatarHover, setAvatarHover] = useState(false);

  // Profile form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [workStatus, setWorkStatus] = useState('');
  const [experience, setExperience] = useState(5);

  // Preferences state
  const [selectedWorkMode, setSelectedWorkMode] = useState('Remote');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [notificationFreq, setNotificationFreq] = useState('weekly');

  // Notifications state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [marketTrends, setMarketTrends] = useState(false);

  // Account state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setLocation(parsed.location || '');
      setLinkedin(parsed.linkedin || '');
      setWorkStatus(parsed.workStatus || 'student');
      setExperience(parsed.experience || 5);
      setSelectedInterests(parsed.interests || []);
      setSelectedGoals(parsed.goals || []);
    }
  }, []);

  const handleSaveProfile = () => {
    const updatedUser = {
      ...user,
      name,
      email,
      location,
      linkedin,
      workStatus,
      experience,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Profile updated successfully!');
  };

  const handleSavePreferences = () => {
    const updatedUser = {
      ...user,
      workMode: selectedWorkMode,
      interests: selectedInterests,
      goals: selectedGoals,
      notificationFreq,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Preferences saved successfully!');
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <AppShell title="Settings" subtitle="Manage your account and preferences">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sub-Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="card p-4 sticky top-6">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    activeTab === tab
                      ? 'bg-brand text-bg-base font-semibold'
                      : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Right Content Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'Profile' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-2xl font-display">Profile Settings</h2>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div
                    className="relative"
                    onMouseEnter={() => setAvatarHover(true)}
                    onMouseLeave={() => setAvatarHover(false)}
                  >
                    <div className="w-24 h-24 rounded-full bg-brand/20 flex items-center justify-center text-3xl font-bold text-brand">
                      {name.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {avatarHover && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer">
                        <span className="text-white text-sm">Edit</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{name || 'User'}</div>
                    <div className="text-sm text-text-secondary">{email}</div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Country"
                      className="input-dark w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="input-dark w-full"
                    />
                  </div>
                </div>

                {/* Work Status */}
                <div>
                  <label className="block text-sm text-text-secondary mb-2">Work Status</label>
                  <select
                    value={workStatus}
                    onChange={(e) => setWorkStatus(e.target.value)}
                    className="input-dark w-full"
                  >
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="job-seeker">Job Seeker</option>
                    <option value="career-changer">Career Changer</option>
                  </select>
                </div>

                {/* Experience Slider */}
                <div>
                  <label className="block text-sm text-text-secondary mb-2">
                    Years of Experience: {experience}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={experience}
                    onChange={(e) => setExperience(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button onClick={handleSaveProfile} className="btn-primary">
                  Save changes
                </button>
              </div>
            )}

            {activeTab === 'Preferences' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-2xl font-display">Preferences</h2>

                {/* Work Mode */}
                <div>
                  <label className="block text-sm text-text-secondary mb-3">Work Mode</label>
                  <div className="flex gap-3">
                    {workModes.map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setSelectedWorkMode(mode)}
                        className={`px-6 py-3 rounded-lg transition-all ${
                          selectedWorkMode === mode
                            ? 'bg-brand text-bg-base'
                            : 'bg-bg-muted text-text-secondary hover:bg-bg-elevated'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Domains */}
                <div>
                  <label className="block text-sm text-text-secondary mb-3">
                    Interest Domains
                  </label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {interestDomains.map((domain) => (
                      <button
                        key={domain}
                        onClick={() => toggleInterest(domain)}
                        className={`px-4 py-3 rounded-lg text-sm transition-all ${
                          selectedInterests.includes(domain)
                            ? 'bg-brand text-bg-base'
                            : 'bg-bg-muted text-text-secondary hover:bg-bg-elevated'
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <label className="block text-sm text-text-secondary mb-3">Career Goals</label>
                  <div className="grid md:grid-cols-3 gap-3">
                    {careerGoals.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-3 rounded-lg text-sm transition-all ${
                          selectedGoals.includes(goal)
                            ? 'bg-brand text-bg-base'
                            : 'bg-bg-muted text-text-secondary hover:bg-bg-elevated'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Frequency */}
                <div>
                  <label className="block text-sm text-text-secondary mb-3">
                    Notification Frequency
                  </label>
                  <div className="space-y-2">
                    {['daily', 'weekly', 'monthly', 'never'].map((freq) => (
                      <label key={freq} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="notificationFreq"
                          value={freq}
                          checked={notificationFreq === freq}
                          onChange={(e) => setNotificationFreq(e.target.value)}
                          className="w-4 h-4"
                        />
                        <span className="capitalize">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={handleSavePreferences} className="btn-primary">
                  Save preferences
                </button>
              </div>
            )}

            {activeTab === 'Resume History' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-2xl font-display">Resume History</h2>
                <div className="space-y-4">
                  {mockResumeHistory.map((resume) => (
                    <div
                      key={resume.id}
                      className="p-4 bg-bg-muted rounded-lg border border-border flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">{resume.filename}</span>
                          {resume.isActive && (
                            <span className="px-2 py-1 bg-brand text-bg-base text-xs rounded">
                              Active
                            </span>
                          )}
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              resume.confidence >= 90
                                ? 'bg-success/20 text-success'
                                : resume.confidence >= 75
                                ? 'bg-warning/20 text-warning'
                                : 'bg-danger/20 text-danger'
                            }`}
                          >
                            {resume.confidence}% confidence
                          </span>
                        </div>
                        <div className="text-sm text-text-secondary">
                          Parsed on {resume.parsedDate} • {resume.skillsCount} skills extracted
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!resume.isActive && (
                          <button className="btn-ghost text-sm">Set as active</button>
                        )}
                        <button className="btn-ghost text-sm text-danger">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="card p-6 space-y-6">
                <h2 className="text-2xl font-display">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Email Alerts</div>
                      <div className="text-sm text-text-secondary">
                        Receive alerts for new career matches
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={emailAlerts}
                        onChange={(e) => setEmailAlerts(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-bg-base rounded-full peer peer-checked:bg-brand transition-all cursor-pointer" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Weekly Digest</div>
                      <div className="text-sm text-text-secondary">
                        Get a weekly summary of your progress
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={weeklyDigest}
                        onChange={(e) => setWeeklyDigest(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-bg-base rounded-full peer peer-checked:bg-brand transition-all cursor-pointer" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">Market Trend Alerts</div>
                      <div className="text-sm text-text-secondary">
                        Notifications about industry trends
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        checked={marketTrends}
                        onChange={(e) => setMarketTrends(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-bg-base rounded-full peer peer-checked:bg-brand transition-all cursor-pointer" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Account' && (
              <div className="space-y-6">
                <div className="card p-6 space-y-6">
                  <h2 className="text-2xl font-display">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-dark w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-dark w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-dark w-full"
                      />
                    </div>
                  </div>
                  <button onClick={handleChangePassword} className="btn-primary">
                    Update password
                  </button>
                </div>

                <div className="card p-6 border-danger/30 bg-danger/5">
                  <h2 className="text-2xl font-display text-danger mb-4">Danger Zone</h2>
                  <p className="text-sm text-text-secondary mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 bg-danger text-white rounded-lg hover:bg-danger/80 transition-all"
                  >
                    Delete account
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppShell>
  );
}
