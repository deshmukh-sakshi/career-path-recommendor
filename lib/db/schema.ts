import { pgTable, uuid, text, integer, real, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', ['student', 'job_seeker', 'employed', 'career_changer', 'entrepreneur']);
export const workModeEnum = pgEnum('work_mode', ['remote', 'hybrid', 'in_office']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar_url'),
  status: userStatusEnum('status'),
  workMode: workModeEnum('work_mode'),
  experience: integer('experience_years').default(0),
  location: text('location'),
  linkedinUrl: text('linkedin_url'),
  profileScore: integer('profile_score').default(0),
  onboarded: boolean('onboarded').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  category: text('category'),
  level: integer('level'),
  verified: boolean('verified').default(false),
  source: text('source'),
  addedAt: timestamp('added_at').defaultNow(),
});

export const interests = pgTable('interests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  domain: text('domain').notNull(),
});

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  timeline: text('timeline'),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name'),
  fileUrl: text('file_url'),
  rawText: text('raw_text'),
  parsedData: jsonb('parsed_data'),
  confidence: real('confidence'),
  parsedAt: timestamp('parsed_at').defaultNow(),
  isActive: boolean('is_active').default(true),
});

export const careerPaths = pgTable('career_paths', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  avgSalary: integer('avg_salary'),
  salaryRange: jsonb('salary_range'),
  demandLevel: text('demand_level'),
  growthPct: real('growth_pct'),
  timelineYears: jsonb('timeline_years'),
  requiredSkills: jsonb('required_skills'),
  industry: text('industry'),
  roles: jsonb('roles'),
  resources: jsonb('resources'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const recommendations = pgTable('recommendations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  careerPathId: uuid('career_path_id').references(() => careerPaths.id),
  matchScore: real('match_score'),
  skillGapScore: real('skill_gap_score'),
  marketScore: real('market_score'),
  peerScore: real('peer_score'),
  reasoning: text('reasoning'),
  rank: integer('rank'),
  savedAt: timestamp('saved_at'),
  generatedAt: timestamp('generated_at').defaultNow(),
});

export const marketData = pgTable('market_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  skill: text('skill').notNull(),
  role: text('role'),
  demandScore: real('demand_score'),
  growthRate: real('growth_rate'),
  avgSalary: integer('avg_salary'),
  jobCount: integer('job_count'),
  region: text('region').default('global'),
  dataDate: timestamp('data_date').defaultNow(),
  source: text('source'),
});
