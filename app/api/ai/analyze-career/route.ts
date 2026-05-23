import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { skills } = body;

  if (!skills || !Array.isArray(skills) || skills.length === 0) {
    return NextResponse.json(
      { error: 'Skills array is required' },
      { status: 400 }
    );
  }

  if (!apiKey) {
    console.warn('⚠️ Gemini API key not configured, using fallback content');
  }

  // Try to use Gemini API if key is available
  if (apiKey) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are an expert AI Career Strategist and Skills Analyst for the Indian job market. Based on the following user skills, provide a comprehensive career analysis.

USER SKILLS: ${skills.join(', ')}

IMPORTANT: All salary ranges must be in INR (Indian Rupees). Use realistic Indian market salaries.

Return ONLY a valid JSON object (no markdown, no explanations) with this EXACT structure:

{
  "careerRecommendations": [
    {
      "title": "Job Title",
      "matchScore": 85,
      "salaryRange": "₹12L - ₹18L per annum",
      "demandLevel": "High",
      "description": "Brief 2-sentence description of the role and why it's a good fit",
      "keyResponsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3"],
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "timeline": "1-2 years",
      "skillGaps": {
        "technical": [
          {
            "name": "Skill Name",
            "currentLevel": 0,
            "requiredLevel": 80,
            "importance": "High",
            "description": "Why this skill is important for this role"
          }
        ],
        "soft": [
          {
            "name": "Soft Skill",
            "currentLevel": 0,
            "requiredLevel": 70,
            "importance": "Medium",
            "description": "Why this is important"
          }
        ]
      },
      "learningPath": [
        {
          "step": 1,
          "title": "Learning Step Title",
          "duration": "4 weeks",
          "resources": [
            {
              "title": "Resource Name",
              "type": "Course/Book/Tutorial",
              "url": "https://example.com",
              "duration": "4 weeks"
            }
          ]
        }
      ]
    }
  ],
  "overallAnalysis": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "marketDemand": "High/Medium/Low",
    "careerReadiness": 75,
    "nextSteps": ["Action 1", "Action 2", "Action 3"]
  }
}

REQUIREMENTS:
1. Provide 3-5 career recommendations ranked by match score (0-100)
2. ALL SALARIES IN INR (₹) - Use realistic Indian market rates (e.g., ₹8L-₹15L for mid-level, ₹15L-₹30L for senior)
3. For EACH career, include specific skillGaps with current vs required levels (0-100 scale)
4. For EACH career, include a personalized learningPath with 3-4 steps
5. Include 2-3 specific learning resources per step with real URLs
6. Consider Indian job market trends and demand
7. Be specific and practical - no generic advice`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Clean up the response
      const cleaned = response.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      console.log('✅ Career analysis complete from Gemini API');

      return NextResponse.json(parsed, { status: 200 });
    } catch (geminiError: any) {
      console.error('⚠️ Gemini API failed, using fallback content:', geminiError.message);
      // Continue to fallback content below
    }
  }

  // Fallback response when Gemini API is not available or fails
  console.log('📋 Returning fallback career analysis content');
  return NextResponse.json(
    {
      careerRecommendations: [
          {
            title: 'Full Stack Developer',
            matchScore: 88,
            salaryRange: '₹8L - ₹15L per annum',
            demandLevel: 'Very High',
            description: 'Build end-to-end web applications using modern frameworks. Your current skills align well with this role, especially in frontend and backend development.',
            keyResponsibilities: [
              'Design and develop scalable web applications',
              'Collaborate with cross-functional teams',
              'Implement responsive UI/UX designs',
              'Optimize application performance'
            ],
            requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'REST APIs'],
            timeline: '0-6 months',
            skillGaps: {
              technical: [
                {
                  name: 'Docker & Kubernetes',
                  currentLevel: 20,
                  requiredLevel: 75,
                  importance: 'High',
                  description: 'Container orchestration is essential for modern deployments'
                },
                {
                  name: 'System Design',
                  currentLevel: 30,
                  requiredLevel: 80,
                  importance: 'High',
                  description: 'Understanding scalable architecture is crucial'
                }
              ],
              soft: [
                {
                  name: 'Technical Leadership',
                  currentLevel: 40,
                  requiredLevel: 70,
                  importance: 'Medium',
                  description: 'Leading projects and mentoring juniors'
                }
              ]
            },
            learningPath: [
              {
                step: 1,
                title: 'Master Docker & Kubernetes',
                duration: '6 weeks',
                resources: [
                  {
                    title: 'Docker Mastery Course',
                    type: 'Course',
                    url: 'https://www.udemy.com/course/docker-mastery/',
                    duration: '4 weeks'
                  },
                  {
                    title: 'Kubernetes Official Tutorial',
                    type: 'Tutorial',
                    url: 'https://kubernetes.io/docs/tutorials/',
                    duration: '2 weeks'
                  }
                ]
              },
              {
                step: 2,
                title: 'Learn System Design',
                duration: '8 weeks',
                resources: [
                  {
                    title: 'System Design Interview Book',
                    type: 'Book',
                    url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF',
                    duration: '6 weeks'
                  },
                  {
                    title: 'System Design Primer',
                    type: 'Tutorial',
                    url: 'https://github.com/donnemartin/system-design-primer',
                    duration: '2 weeks'
                  }
                ]
              },
              {
                step: 3,
                title: 'Build Portfolio Projects',
                duration: '4 weeks',
                resources: [
                  {
                    title: 'Full Stack Project Ideas',
                    type: 'Tutorial',
                    url: 'https://github.com/practical-tutorials/project-based-learning',
                    duration: '4 weeks'
                  }
                ]
              }
            ]
          },
          {
            title: 'Frontend Engineer',
            matchScore: 85,
            salaryRange: '₹7L - ₹14L per annum',
            demandLevel: 'High',
            description: 'Create beautiful, responsive user interfaces. Your skills in modern JavaScript frameworks make you a strong candidate for this role.',
            keyResponsibilities: [
              'Build reusable UI components',
              'Implement pixel-perfect designs',
              'Ensure cross-browser compatibility',
              'Optimize frontend performance'
            ],
            requiredSkills: ['React', 'CSS', 'JavaScript', 'HTML', 'Webpack'],
            timeline: '0-3 months',
            skillGaps: {
              technical: [
                {
                  name: 'Advanced React Patterns',
                  currentLevel: 50,
                  requiredLevel: 85,
                  importance: 'High',
                  description: 'Hooks, Context, Performance optimization'
                },
                {
                  name: 'CSS Architecture',
                  currentLevel: 40,
                  requiredLevel: 75,
                  importance: 'Medium',
                  description: 'Tailwind, CSS-in-JS, Design systems'
                }
              ],
              soft: [
                {
                  name: 'Design Collaboration',
                  currentLevel: 50,
                  requiredLevel: 75,
                  importance: 'Medium',
                  description: 'Working with designers and design tools'
                }
              ]
            },
            learningPath: [
              {
                step: 1,
                title: 'Master Advanced React',
                duration: '4 weeks',
                resources: [
                  {
                    title: 'React Advanced Patterns',
                    type: 'Course',
                    url: 'https://www.udemy.com/course/react-the-complete-guide/',
                    duration: '4 weeks'
                  }
                ]
              },
              {
                step: 2,
                title: 'Learn Modern CSS',
                duration: '3 weeks',
                resources: [
                  {
                    title: 'Tailwind CSS Mastery',
                    type: 'Course',
                    url: 'https://tailwindcss.com/docs',
                    duration: '2 weeks'
                  }
                ]
              }
            ]
          },
          {
            title: 'Backend Developer',
            matchScore: 82,
            salaryRange: '₹8L - ₹16L per annum',
            demandLevel: 'High',
            description: 'Design and maintain server-side logic and databases. Your technical foundation is solid for backend development.',
            keyResponsibilities: [
              'Design database schemas',
              'Build RESTful APIs',
              'Implement authentication systems',
              'Ensure application security'
            ],
            requiredSkills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Docker'],
            timeline: '3-9 months',
            skillGaps: {
              technical: [
                {
                  name: 'Database Optimization',
                  currentLevel: 35,
                  requiredLevel: 80,
                  importance: 'High',
                  description: 'Query optimization, indexing, scaling'
                },
                {
                  name: 'API Security',
                  currentLevel: 40,
                  requiredLevel: 85,
                  importance: 'High',
                  description: 'Authentication, authorization, encryption'
                }
              ],
              soft: []
            },
            learningPath: [
              {
                step: 1,
                title: 'Master Database Design',
                duration: '6 weeks',
                resources: [
                  {
                    title: 'Database Design Course',
                    type: 'Course',
                    url: 'https://www.udemy.com/course/database-design/',
                    duration: '6 weeks'
                  }
                ]
              },
              {
                step: 2,
                title: 'Learn API Security',
                duration: '4 weeks',
                resources: [
                  {
                    title: 'API Security Best Practices',
                    type: 'Tutorial',
                    url: 'https://owasp.org/www-project-api-security/',
                    duration: '4 weeks'
                  }
                ]
              }
            ]
          }
        ],
        overallAnalysis: {
          strengths: [
            'Strong foundation in modern web technologies',
            'Full-stack capabilities with frontend and backend experience',
            'Good understanding of software development principles'
          ],
          marketDemand: 'High',
          careerReadiness: 78,
          nextSteps: [
            'Complete a Docker/Kubernetes course to strengthen DevOps skills',
            'Build 2-3 portfolio projects showcasing full-stack capabilities',
            'Start preparing for AWS certification exam',
            'Contribute to open-source projects to build credibility'
          ]
        }
      },
      { status: 200 }
    );
}
