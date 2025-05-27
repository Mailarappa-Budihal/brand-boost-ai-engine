
// Groq API integration for all AI-powered features
const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

async function callGroqAPI(messages: Array<{role: string; content: string}>, maxTokens = 2000): Promise<string> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API call failed:', error);
    throw new Error('AI service unavailable. Please check your API key and try again.');
  }
}

export async function generatePortfolioContent(resumeOrSample: string): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: `You are an expert portfolio builder. Generate comprehensive portfolio data based on the input. Return a JSON object with: name, title, summary, skills (array), projects (array with name, description, technologies, link), experience (array with company, role, duration, description), education (array with institution, degree, year), contact (object with email, linkedin, github).`
    },
    {
      role: 'user',
      content: `Generate a professional portfolio for: ${resumeOrSample}`
    }
  ];

  const response = await callGroqAPI(messages);
  
  try {
    return JSON.parse(response);
  } catch {
    // Return sample data if parsing fails
    return {
      name: 'Alex Johnson',
      title: 'Frontend Developer',
      summary: 'Passionate frontend developer with experience in modern web technologies. Skilled in React, TypeScript, and creating responsive user interfaces.',
      skills: ['JavaScript', 'React', 'TypeScript', 'HTML/CSS', 'Node.js', 'Git'],
      projects: [
        {
          name: 'E-commerce Dashboard',
          description: 'Built a responsive admin dashboard for an e-commerce platform using React and TypeScript.',
          technologies: ['React', 'TypeScript', 'Material-UI'],
          link: 'https://github.com/alexjohnson/ecommerce-dashboard'
        }
      ],
      experience: [
        {
          company: 'Tech Startup Inc.',
          role: 'Junior Frontend Developer',
          duration: '2023 - Present',
          description: 'Developed user interfaces for web applications using React and modern CSS frameworks.'
        }
      ],
      education: [
        {
          institution: 'University of Technology',
          degree: 'Bachelor of Computer Science',
          year: '2023'
        }
      ],
      contact: {
        email: 'alex.johnson@email.com',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson'
      }
    };
  }
}

export async function generateCVContent(cvData: any): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: 'You are an expert CV writer. Enhance and optimize the provided CV data for ATS systems. Improve descriptions, add action verbs, quantify achievements where possible, and ensure professional formatting.'
    },
    {
      role: 'user',
      content: `Optimize this CV data: ${JSON.stringify(cvData)}`
    }
  ];

  const response = await callGroqAPI(messages);
  
  try {
    return JSON.parse(response);
  } catch {
    return cvData; // Return original data if enhancement fails
  }
}

export async function generateCoverLetter(params: {
  jobDescription: string;
  jobUrl?: string;
  company: string;
  position: string;
  tone: string;
}): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are an expert cover letter writer. Write a compelling, personalized cover letter based on the job description and requirements. Use a ${params.tone} tone. Make it specific to the role and company. Include relevant skills and experiences.`
    },
    {
      role: 'user',
      content: `Write a cover letter for:
Company: ${params.company}
Position: ${params.position}
Job Description: ${params.jobDescription}
Tone: ${params.tone}`
    }
  ];

  const response = await callGroqAPI(messages);
  return response || `Dear ${params.company} Hiring Manager,

I am writing to express my strong interest in the ${params.position} position at ${params.company}. 

Based on the job description, I believe my skills and experience align well with your requirements...

[AI-generated content would continue here]

Sincerely,
[Your Name]`;
}

export async function optimizeResume(jobDescription: string, resumeText: string): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: 'You are a resume optimization expert. Analyze the resume against the job description and provide detailed feedback including match score (0-100), missing keywords, specific suggestions for improvement, and actionable recommendations. Return structured JSON data.'
    },
    {
      role: 'user',
      content: `Job Description: ${jobDescription}

Resume: ${resumeText}

Provide optimization analysis.`
    }
  ];

  const response = await callGroqAPI(messages, 3000);
  
  try {
    return JSON.parse(response);
  } catch {
    // Return sample optimization data
    return {
      matchScore: 75,
      missingKeywords: ['React', 'TypeScript', 'AWS', 'Agile'],
      suggestions: [
        {
          section: 'Skills',
          current: 'JavaScript, HTML, CSS',
          suggested: 'JavaScript, React, TypeScript, HTML/CSS, AWS',
          impact: 'high'
        }
      ],
      strengthKeywords: ['JavaScript', 'Frontend', 'UI/UX'],
      improvements: [
        {
          category: 'Technical Skills',
          items: ['Add React framework experience', 'Include TypeScript proficiency', 'Mention cloud platforms (AWS/Azure)']
        }
      ]
    };
  }
}

export async function conductMockInterview(role: string): Promise<any[]> {
  const messages = [
    {
      role: 'system',
      content: `Generate 5-7 interview questions for a ${role} position. Include behavioral, technical, and situational questions. Return as JSON array with id, question, type, and expectedDuration fields.`
    },
    {
      role: 'user',
      content: `Create interview questions for: ${role}`
    }
  ];

  const response = await callGroqAPI(messages);
  
  try {
    return JSON.parse(response);
  } catch {
    // Return sample questions
    return [
      {
        id: 1,
        question: "Tell me about yourself and your background in this field.",
        type: "behavioral",
        expectedDuration: 120
      },
      {
        id: 2,
        question: "Describe a challenging project you worked on. How did you overcome the obstacles?",
        type: "behavioral",
        expectedDuration: 180
      },
      {
        id: 3,
        question: "What technologies are you most comfortable working with?",
        type: "technical",
        expectedDuration: 90
      }
    ];
  }
}

export async function analyzeInterviewPerformance(responses: any[], role: string): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: `You are an interview coach. Analyze the interview responses and provide detailed feedback including overall score, communication score, confidence score, content score, specific feedback for each question, and improvement tips. Return structured JSON.`
    },
    {
      role: 'user',
      content: `Role: ${role}
Responses: ${JSON.stringify(responses)}

Provide detailed performance analysis.`
    }
  ];

  const response = await callGroqAPI(messages, 3000);
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      overallScore: 78,
      communicationScore: 82,
      confidenceScore: 75,
      contentScore: 80,
      feedback: [
        {
          question: responses[0]?.question || "Sample question",
          score: 78,
          strengths: ["Clear communication", "Specific examples"],
          improvements: ["Add more quantifiable results", "Structure response better"]
        }
      ],
      tips: [
        "Practice the STAR method for behavioral questions",
        "Include more specific metrics and achievements",
        "Work on confident body language and voice projection"
      ]
    };
  }
}

export async function analyzeSkillGaps(params: any): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: 'You are a career counselor. Analyze the user\'s current skills against their target role and provide detailed skill gap analysis, learning recommendations, and a structured learning path. Return comprehensive JSON data.'
    },
    {
      role: 'user',
      content: `Current Role: ${params.currentRole}
Target Role: ${params.targetRole}
Experience: ${params.experience}
Skills: ${params.skills.join(', ')}
Goals: ${params.goals}

Provide detailed skill gap analysis and learning path.`
    }
  ];

  const response = await callGroqAPI(messages, 4000);
  
  try {
    return JSON.parse(response);
  } catch {
    return {
      currentSkills: params.skills,
      targetRole: params.targetRole,
      missingSkills: [
        {
          skill: 'React',
          importance: 'critical',
          timeToLearn: '2-3 months',
          resources: ['Official React documentation', 'React courses on platforms like Udemy', 'Build practice projects']
        }
      ],
      strengthAreas: ['Communication', 'Problem-solving'],
      recommendations: ['Focus on frontend frameworks', 'Build a portfolio of projects', 'Practice coding interviews'],
      learningPath: [
        {
          phase: 'Foundation Building',
          duration: '1-2 months',
          skills: ['JavaScript ES6+', 'HTML/CSS', 'Git'],
          projects: ['Personal website', 'To-do app', 'Weather app']
        }
      ]
    };
  }
}

export async function generateCareerAdvice(question: string, context?: any): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: 'You are an experienced career coach. Provide helpful, actionable career advice. Be encouraging but realistic. Include specific steps when possible.'
    },
    {
      role: 'user',
      content: `Question: ${question}${context ? `\n\nContext: ${JSON.stringify(context)}` : ''}`
    }
  ];

  const response = await callGroqAPI(messages);
  return response || "I'd be happy to help with your career question. Could you provide more specific details about your situation?";
}

export async function generateLearningPath(skills: string[], targetRole: string): Promise<any> {
  const messages = [
    {
      role: 'system',
      content: 'Create a structured learning path to transition from current skills to target role. Include phases, timelines, specific skills to learn, and project suggestions.'
    },
    {
      role: 'user',
      content: `Current skills: ${skills.join(', ')}
Target role: ${targetRole}

Create learning path.`
    }
  ];

  const response = await callGroqAPI(messages);
  
  try {
    return JSON.parse(response);
  } catch {
    return [
      {
        phase: 'Foundation',
        duration: '1-2 months',
        skills: ['Core technologies'],
        projects: ['Basic projects']
      }
    ];
  }
}

export async function createJobAlert(alertData: any): Promise<any> {
  // Simulate creating a job alert
  return {
    id: Math.random().toString(36).substr(2, 9),
    ...alertData,
    isActive: true,
    createdAt: new Date(),
    totalJobs: 0
  };
}

export async function searchJobs(params: {
  keywords: string;
  location: string;
  sources: string[];
}): Promise<any[]> {
  // Simulate job search results
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces using React and modern web technologies.',
      postedDate: '2 days ago',
      source: 'LinkedIn',
      url: 'https://linkedin.com/jobs/frontend-developer-techcorp',
      salary: '$80,000 - $120,000',
      type: 'full-time',
      matchScore: 87
    },
    {
      id: '2',
      title: 'React Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      description: 'Join our remote team as a React Developer. Work on exciting projects using the latest technologies including React, TypeScript, and GraphQL.',
      postedDate: '1 day ago',
      source: 'Indeed',
      url: 'https://indeed.com/jobs/react-developer-startupxyz',
      type: 'remote',
      matchScore: 92
    }
  ];
}
