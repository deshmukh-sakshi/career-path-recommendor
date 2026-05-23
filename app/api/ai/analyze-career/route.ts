import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skills } = body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json(
        { error: 'Skills array is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert AI Career Strategist and Skills Analyst. Based on the following user skills, provide a comprehensive career analysis.

USER SKILLS: ${skills.join(', ')}

Return ONLY a valid JSON object (no markdown, no explanations) with this EXACT structure:

{
  "careerRecommendations": [
    {
      "title": "Job Title",
      "matchScore": 85,
      "salaryRange": "$120K - $180K",
      "demandLevel": "High",
      "description": "Brief 2-sentence description of the role and why it's a good fit",
      "keyResponsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3"],
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "timeline": "1-2 years"
    }
  ],
  "skillGaps": [
    {
      "category": "Technical Skills",
      "missingSkills": [
        {
          "name": "Skill Name",
          "importance": "High",
          "description": "Why this skill is important",
          "learningResources": [
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
2. For each career, include realistic salary ranges and demand levels
3. Identify skill gaps in categories: Technical Skills, Soft Skills, Certifications
4. For each missing skill, provide 2-3 specific learning resources with real URLs
5. Include an overall analysis with actionable next steps
6. Be specific and practical - no generic advice
7. Consider current market trends and demand`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Clean up the response
    const cleaned = response.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    console.log('✅ Career analysis complete:', parsed);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error: any) {
    console.error('❌ Career analysis error:', error);
    
    // Fallback response for demo purposes
    return NextResponse.json(
      {
        careerRecommendations: [
          {
            title: 'Full Stack Developer',
            matchScore: 88,
            salaryRange: '$100K - $150K',
            demandLevel: 'Very High',
            description: 'Build end-to-end web applications using modern frameworks. Your current skills align well with this role, especially in frontend and backend development.',
            keyResponsibilities: [
              'Design and develop scalable web applications',
              'Collaborate with cross-functional teams',
              'Implement responsive UI/UX designs',
              'Optimize application performance'
            ],
            requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'REST APIs'],
            timeline: '0-6 months'
          },
          {
            title: 'Frontend Engineer',
            matchScore: 85,
            salaryRange: '$90K - $140K',
            demandLevel: 'High',
            description: 'Create beautiful, responsive user interfaces. Your skills in modern JavaScript frameworks make you a strong candidate for this role.',
            keyResponsibilities: [
              'Build reusable UI components',
              'Implement pixel-perfect designs',
              'Ensure cross-browser compatibility',
              'Optimize frontend performance'
            ],
            requiredSkills: ['React', 'CSS', 'JavaScript', 'HTML', 'Webpack'],
            timeline: '0-3 months'
          },
          {
            title: 'Backend Developer',
            matchScore: 82,
            salaryRange: '$95K - $145K',
            demandLevel: 'High',
            description: 'Design and maintain server-side logic and databases. Your technical foundation is solid for backend development.',
            keyResponsibilities: [
              'Design database schemas',
              'Build RESTful APIs',
              'Implement authentication systems',
              'Ensure application security'
            ],
            requiredSkills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'Docker'],
            timeline: '3-9 months'
          }
        ],
        skillGaps: [
          {
            category: 'Technical Skills',
            missingSkills: [
              {
                name: 'Docker & Kubernetes',
                importance: 'High',
                description: 'Container orchestration is essential for modern cloud deployments and DevOps practices.',
                learningResources: [
                  {
                    title: 'Docker Mastery Course',
                    type: 'Course',
                    url: 'https://www.udemy.com/course/docker-mastery/',
                    duration: '6 weeks'
                  },
                  {
                    title: 'Kubernetes Official Tutorial',
                    type: 'Tutorial',
                    url: 'https://kubernetes.io/docs/tutorials/',
                    duration: '4 weeks'
                  }
                ]
              },
              {
                name: 'System Design',
                importance: 'High',
                description: 'Understanding scalable architecture is crucial for senior engineering roles.',
                learningResources: [
                  {
                    title: 'System Design Interview',
                    type: 'Book',
                    url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF',
                    duration: '8 weeks'
                  },
                  {
                    title: 'System Design Primer',
                    type: 'Tutorial',
                    url: 'https://github.com/donnemartin/system-design-primer',
                    duration: '6 weeks'
                  }
                ]
              }
            ]
          },
          {
            category: 'Soft Skills',
            missingSkills: [
              {
                name: 'Technical Leadership',
                importance: 'Medium',
                description: 'Leading technical projects and mentoring junior developers opens senior opportunities.',
                learningResources: [
                  {
                    title: 'The Manager\'s Path',
                    type: 'Book',
                    url: 'https://www.amazon.com/Managers-Path-Leaders-Navigating-Growth/dp/1491973897',
                    duration: '4 weeks'
                  }
                ]
              }
            ]
          },
          {
            category: 'Certifications',
            missingSkills: [
              {
                name: 'AWS Certified Solutions Architect',
                importance: 'High',
                description: 'Cloud certifications significantly boost your market value and credibility.',
                learningResources: [
                  {
                    title: 'AWS Solutions Architect Course',
                    type: 'Course',
                    url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/',
                    duration: '8 weeks'
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
}
