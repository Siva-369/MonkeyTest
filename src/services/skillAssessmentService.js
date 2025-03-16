/**
 * Comprehensive Skill Assessment Service
 * Evaluates technical and non-technical skills through various assessment methods
 * including coding challenges, system design, debugging, case studies, and more.
 */

const OpenAI = require('openai');
const natural = require('natural');

class SkillAssessmentService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Generate a technical assessment for software development roles
   * @param {string} role - Specific technical role (e.g., frontend, backend, fullstack)
   * @param {string} level - Experience level (junior, mid, senior)
   * @param {Array} technologies - Required technologies for assessment
   * @returns {Object} Technical assessment with coding challenges and system design
   */
  async generateTechnicalAssessment(role, level, technologies) {
    try {
      const prompt = this.buildTechnicalPrompt(role, level, technologies);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.5
      });

      const assessmentText = response.choices[0].message.content.trim();
      return this.parseTechnicalAssessment(assessmentText, role, level, technologies);
    } catch (error) {
      console.error('Error generating technical assessment:', error);
      throw new Error('Failed to generate technical assessment');
    }
  }

  /**
   * Generate a non-technical assessment for business and management roles
   * @param {string} role - Specific non-technical role (e.g., marketing, HR, finance)
   * @param {string} level - Experience level (junior, mid, senior)
   * @param {Array} skills - Required skills for assessment
   * @returns {Object} Non-technical assessment with case studies and scenarios
   */
  async generateNonTechnicalAssessment(role, level, skills) {
    try {
      const prompt = this.buildNonTechnicalPrompt(role, level, skills);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.5
      });

      const assessmentText = response.choices[0].message.content.trim();
      return this.parseNonTechnicalAssessment(assessmentText, role, level, skills);
    } catch (error) {
      console.error('Error generating non-technical assessment:', error);
      throw new Error('Failed to generate non-technical assessment');
    }
  }

  /**
   * Build a prompt for technical assessment generation
   */
  buildTechnicalPrompt(role, level, technologies) {
    const levelMap = {
      'junior': 'entry-level',
      'mid': 'intermediate',
      'senior': 'advanced'
    };

    return `Generate a comprehensive technical assessment for a ${levelMap[level]} ${role} developer position.
    Required technologies: ${technologies.join(', ')}.
    
    Include the following components:
    
    1. Coding Challenges (3):
    - One easy warm-up challenge
    - One medium difficulty challenge focused on problem-solving
    - One complex challenge that tests architecture and design skills
    
    2. System Design Problem (1):
    - A realistic system design challenge appropriate for the role and level
    
    3. Debugging Exercise (1):
    - A code snippet with bugs to identify and fix
    
    4. Technical Knowledge Questions (5):
    - Questions that test understanding of the required technologies
    
    Format the response as JSON with these sections:
    - codingChallenges: Array of coding challenges with title, description, difficulty, and expectedOutput
    - systemDesign: Object with title, description, requirements, and evaluationCriteria
    - debuggingExercise: Object with title, description, codeSnippet, and bugs to find
    - knowledgeQuestions: Array of technical questions with question text and expected answer areas`;
  }

  /**
   * Build a prompt for non-technical assessment generation
   */
  buildNonTechnicalPrompt(role, level, skills) {
    const levelMap = {
      'junior': 'entry-level',
      'mid': 'intermediate',
      'senior': 'advanced'
    };

    return `Generate a comprehensive non-technical assessment for a ${levelMap[level]} ${role} position.
    Required skills: ${skills.join(', ')}.
    
    Include the following components:
    
    1. Case Study (1):
    - A detailed business case relevant to the role
    - Include background information, challenges, and questions
    
    2. Strategic Problem-Solving Scenarios (2):
    - Realistic workplace scenarios that test decision-making
    - Include context, stakeholders, and specific questions
    
    3. Data Interpretation Exercise (1):
    - A data set or chart with questions that test analytical skills
    - Include interpretation questions and business implications
    
    4. Role-Specific Knowledge Questions (5):
    - Questions that test understanding of the required skills and industry knowledge
    
    Format the response as JSON with these sections:
    - caseStudy: Object with title, background, challenges, and questions
    - scenarios: Array of scenario objects with title, context, stakeholders, and questions
    - dataExercise: Object with title, description, dataDescription, and questions
    - knowledgeQuestions: Array of role-specific questions`;
  }

  /**
   * Parse the generated technical assessment text into a structured format
   */
  parseTechnicalAssessment(assessmentText, role, level, technologies) {
    let assessment;
    try {
      // Try to parse as JSON first
      assessment = JSON.parse(assessmentText);
    } catch (e) {
      // Fallback to a default structure if JSON parsing fails
      assessment = this.createDefaultTechnicalAssessment(role, level, technologies);
    }

    return {
      ...assessment,
      type: 'technical',
      role,
      level,
      technologies,
      createdAt: new Date()
    };
  }

  /**
   * Parse the generated non-technical assessment text into a structured format
   */
  parseNonTechnicalAssessment(assessmentText, role, level, skills) {
    let assessment;
    try {
      // Try to parse as JSON first
      assessment = JSON.parse(assessmentText);
    } catch (e) {
      // Fallback to a default structure if JSON parsing fails
      assessment = this.createDefaultNonTechnicalAssessment(role, level, skills);
    }

    return {
      ...assessment,
      type: 'non-technical',
      role,
      level,
      skills,
      createdAt: new Date()
    };
  }

  /**
   * Create a default technical assessment if parsing fails
   */
  createDefaultTechnicalAssessment(role, level, technologies) {
    return {
      codingChallenges: [
        {
          title: 'Basic Algorithm Implementation',
          description: `Implement a function that solves a basic algorithm problem using ${technologies[0]}.`,
          difficulty: 'easy',
          expectedOutput: 'A working implementation with correct output.'
        },
        {
          title: 'Data Structure Optimization',
          description: `Optimize a data structure implementation for better performance using ${technologies[0]}.`,
          difficulty: 'medium',
          expectedOutput: 'An optimized implementation with improved time/space complexity.'
        },
        {
          title: 'Complex System Component',
          description: `Design and implement a component of a larger system using ${technologies.join(' and ')}.`,
          difficulty: 'hard',
          expectedOutput: 'A well-designed component with proper architecture and documentation.'
        }
      ],
      systemDesign: {
        title: `${role.charAt(0).toUpperCase() + role.slice(1)} System Design Challenge`,
        description: `Design a scalable system for a typical ${role} application.`,
        requirements: ['Scalability', 'Performance', 'Security', 'Maintainability'],
        evaluationCriteria: ['Architecture quality', 'Component design', 'Technology choices', 'Consideration of trade-offs']
      },
      debuggingExercise: {
        title: 'Debug the Application',
        description: `Find and fix bugs in the following ${technologies[0]} code snippet.`,
        codeSnippet: `// Example buggy code in ${technologies[0]}\n// This is a placeholder and would be replaced with actual code`,
        bugsToFind: ['Logic error', 'Performance issue', 'Security vulnerability']
      },
      knowledgeQuestions: [
        { question: `Explain how ${technologies[0]} handles asynchronous operations.` },
        { question: `Describe the key features of ${technologies[1] || technologies[0]}.` },
        { question: `What are best practices for testing in ${technologies[0]}?` },
        { question: `How would you optimize a ${technologies[0]} application for performance?` },
        { question: `Explain the security considerations when working with ${technologies[0]}.` }
      ]
    };
  }

  /**
   * Create a default non-technical assessment if parsing fails
   */
  createDefaultNonTechnicalAssessment(role, level, skills) {
    return {
      caseStudy: {
        title: `${role.charAt(0).toUpperCase() + role.slice(1)} Strategy Case Study`,
        background: `A company in the industry is facing challenges related to ${skills[0]}.`,
        challenges: [`Improving ${skills[0]}`, `Optimizing ${skills[1] || skills[0]}`, 'Budget constraints'],
        questions: [
          `How would you approach solving the ${skills[0]} challenge?`,
          `What strategies would you implement to optimize ${skills[1] || skills[0]}?`,
          'How would you measure the success of your proposed solutions?'
        ]
      },
      scenarios: [
        {
          title: 'Team Collaboration Challenge',
          context: `You're leading a project that requires collaboration between different departments.`,
          stakeholders: ['Department heads', 'Team members', 'Executive sponsors'],
          questions: [
            'How would you ensure effective communication between all stakeholders?',
            'What process would you implement to track progress and accountability?',
            'How would you handle conflicts that arise during the project?'
          ]
        },
        {
          title: 'Strategic Decision Making',
          context: `Your organization needs to make a strategic decision about ${skills[0]}.`,
          stakeholders: ['Executive team', 'Department managers', 'External partners'],
          questions: [
            'What information would you gather to inform this decision?',
            'How would you evaluate different options?',
            'How would you present your recommendation to stakeholders?'
          ]
        }
      ],
      dataExercise: {
        title: 'Data Analysis and Interpretation',
        description: `Analyze the provided data related to ${skills[0]} and draw conclusions.`,
        dataDescription: `The data shows trends in ${skills[0]} over the past year.`,
        questions: [
          'What patterns do you observe in the data?',
          'What business implications can be derived from these patterns?',
          'What recommendations would you make based on this analysis?'
        ]
      },
      knowledgeQuestions: [
        { question: `What are the current best practices in ${skills[0]}?` },
        { question: `How do you measure success in ${skills[1] || skills[0]}?` },
        { question: `What challenges are commonly faced when implementing ${skills[0]} strategies?` },
        { question: `How does ${skills[0]} impact overall business performance?` },
        { question: `What emerging trends do you see in ${skills[0]}?` }
      ]
    };
  }

  /**
   * Evaluate a technical assessment response
   * @param {Object} assessment - The original assessment
   * @param {Object} response - Candidate's response to the assessment
   * @returns {Object} Evaluation results with scores and feedback
   */
  async evaluateTechnicalResponse(assessment, response) {
    try {
      // Evaluate coding challenges
      const codingScores = await this.evaluateCodingChallenges(assessment.codingChallenges, response.codingResponses);
      
      // Evaluate system design
      const designScore = await this.evaluateSystemDesign(assessment.systemDesign, response.systemDesignResponse);
      
      // Evaluate debugging
      const debuggingScore = await this.evaluateDebugging(assessment.debuggingExercise, response.debuggingResponse);
      
      // Evaluate knowledge questions
      const knowledgeScores = await this.evaluateKnowledgeQuestions(assessment.knowledgeQuestions, response.knowledgeResponses);
      
      // Calculate overall score
      const totalScore = this.calculateTechnicalTotalScore(codingScores, designScore, debuggingScore, knowledgeScores);
      
      return {
        totalScore,
        codingScores,
        designScore,
        debuggingScore,
        knowledgeScores,
        feedback: this.generateTechnicalFeedback(totalScore, codingScores, designScore, debuggingScore, knowledgeScores),
        evaluatedAt: new Date()
      };
    } catch (error) {
      console.error('Error evaluating technical response:', error);
      throw new Error('Failed to evaluate technical response');
    }
  }

  /**
   * Evaluate a non-technical assessment response
   * @param {Object} assessment - The original assessment
   * @param {Object} response - Candidate's response to the assessment
   * @returns {Object} Evaluation results with scores and feedback
   */
  async evaluateNonTechnicalResponse(assessment, response) {
    try {
      // Evaluate case study
      const caseStudyScore = await this.evaluateCaseStudy(assessment.caseStudy, response.caseStudyResponse);
      
      // Evaluate scenarios
      const scenarioScores = await this.evaluateScenarios(assessment.scenarios, response.scenarioResponses);
      
      // Evaluate data exercise
      const dataScore = await this.evaluateDataExercise(assessment.dataExercise, response.dataExerciseResponse);
      
      // Evaluate knowledge questions
      const knowledgeScores = await this.evaluateKnowledgeQuestions(assessment.knowledgeQuestions, response.knowledgeResponses);
      
      // Calculate overall score
      const totalScore = this.calculateNonTechnicalTotalScore(caseStudyScore, scenarioScores, dataScore, knowledgeScores);
      
      return {
        totalScore,
        caseStudyScore,
        scenarioScores,
        dataScore,
        knowledgeScores,
        feedback: this.generateNonTechnicalFeedback(totalScore, caseStudyScore, scenarioScores, dataScore, knowledgeScores),
        evaluatedAt: new Date()
      };
    } catch (error) {
      console.error('Error evaluating non-technical response:', error);
      throw new Error('Failed to evaluate non-technical response');
    }
  }
  
  /**
   * Evaluate coding challenges responses
   */
  async evaluateCodingChallenges(challenges, responses) {
    const scores = [];
    
    for (let i = 0; i < challenges.length; i++) {
      const challenge = challenges[i];
      const response = responses[i];
      
      if (!response) {
        scores.push({
          challengeId: i,
          score: 0,
          feedback: 'No response provided'
        });
        continue;
      }
      
      // Use AI to evaluate code quality and correctness
      const prompt = `Evaluate this code solution for the following challenge:\n\nChallenge: ${challenge.description}\n\nExpected Output: ${challenge.expectedOutput}\n\nCandidate Solution:\n${response.code}\n\nEvaluate the solution based on:\n1. Correctness (does it solve the problem?)\n2. Code quality (readability, structure)\n3. Efficiency (time and space complexity)\n4. Best practices\n\nProvide a score from 0-100 and brief feedback.`;
      
      try {
        const aiResponse = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.2
        });
        
        const evaluation = aiResponse.choices[0].message.content.trim();
        const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50; // Default to 50 if no score found
        
        scores.push({
          challengeId: i,
          score,
          feedback: evaluation
        });
      } catch (error) {
        console.error('Error evaluating coding challenge:', error);
        scores.push({
          challengeId: i,
          score: 50, // Default score on error
          feedback: 'Error evaluating submission'
        });
      }
    }
    
    return scores;
  }
  
  /**
   * Evaluate system design response
   */
  async evaluateSystemDesign(design, response) {
    if (!response) {
      return {
        score: 0,
        feedback: 'No response provided'
      };
    }
    
    // Use AI to evaluate system design
    const prompt = `Evaluate this system design solution:\n\nChallenge: ${design.description}\n\nRequirements: ${design.requirements.join(', ')}\n\nEvaluation Criteria: ${design.evaluationCriteria.join(', ')}\n\nCandidate Solution:\n${response.design}\n\nEvaluate the solution based on the provided criteria and requirements.\nProvide a score from 0-100 and brief feedback.`;
    
    try {
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2
      });
      
      const evaluation = aiResponse.choices[0].message.content.trim();
      const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      return {
        score,
        feedback: evaluation
      };
    } catch (error) {
      console.error('Error evaluating system design:', error);
      return {
        score: 50,
        feedback: 'Error evaluating submission'
      };
    }
  }
  
  /**
   * Evaluate debugging exercise response
   */
  async evaluateDebugging(exercise, response) {
    if (!response) {
      return {
        score: 0,
        feedback: 'No response provided'
      };
    }
    
    // Use AI to evaluate debugging solution
    const prompt = `Evaluate this debugging solution:\n\nExercise: ${exercise.description}\n\nOriginal Code with Bugs:\n${exercise.codeSnippet}\n\nBugs to Find: ${exercise.bugsToFind.join(', ')}\n\nCandidate Solution:\n${response.fixedCode}\n\nCandidate's Explanation of Bugs:\n${response.bugsIdentified}\n\nEvaluate the solution based on:\n1. Correctly identifying bugs\n2. Properly fixing the issues\n3. Quality of explanation\n\nProvide a score from 0-100 and brief feedback.`;
    
    try {
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2
      });
      
      const evaluation = aiResponse.choices[0].message.content.trim();
      const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      return {
        score,
        feedback: evaluation
      };
    } catch (error) {
      console.error('Error evaluating debugging exercise:', error);
      return {
        score: 50,
        feedback: 'Error evaluating submission'
      };
    }
  }
  
  /**
   * Evaluate knowledge questions responses
   */
  async evaluateKnowledgeQuestions(questions, responses) {
    const scores = [];
    
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const response = responses[i];
      
      if (!response) {
        scores.push({
          questionId: i,
          score: 0,
          feedback: 'No response provided'
        });
        continue;
      }
      
      // Use AI to evaluate knowledge question response
      const prompt = `Evaluate this response to the following knowledge question:\n\nQuestion: ${question.question}\n\nCandidate Response: ${response.answer}\n\nEvaluate the response based on:\n1. Accuracy of information\n2. Completeness of answer\n3. Clarity of explanation\n4. Depth of understanding\n\nProvide a score from 0-100 and brief feedback.`;
      
      try {
        const aiResponse = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.2
        });
        
        const evaluation = aiResponse.choices[0].message.content.trim();
        const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
        
        scores.push({
          questionId: i,
          score,
          feedback: evaluation
        });
      } catch (error) {
        console.error('Error evaluating knowledge question:', error);
        scores.push({
          questionId: i,
          score: 50,
          feedback: 'Error evaluating submission'
        });
      }
    }
    
    return scores;
  }
  
  /**
   * Evaluate case study response
   */
  async evaluateCaseStudy(caseStudy, response) {
    if (!response) {
      return {
        score: 0,
        feedback: 'No response provided'
      };
    }
    
    // Use AI to evaluate case study response
    const prompt = `Evaluate this case study response:\n\nCase Study: ${caseStudy.title}\n\nBackground: ${caseStudy.background}\n\nChallenges: ${caseStudy.challenges.join(', ')}\n\nQuestions: ${caseStudy.questions.join('\n')}\n\nCandidate Response:\n${response.answer}\n\nEvaluate the response based on:\n1. Understanding of the case\n2. Quality of analysis\n3. Practicality of solutions\n4. Strategic thinking\n5. Communication clarity\n\nProvide a score from 0-100 and brief feedback.`;
    
    try {
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2
      });
      
      const evaluation = aiResponse.choices[0].message.content.trim();
      const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      return {
        score,
        feedback: evaluation
      };
    } catch (error) {
      console.error('Error evaluating case study:', error);
      return {
        score: 50,
        feedback: 'Error evaluating submission'
      };
    }
  }
  
  /**
   * Evaluate scenario responses
   */
  async evaluateScenarios(scenarios, responses) {
    const scores = [];
    
    for (let i = 0; i < scenarios.length; i++) {
      const scenario = scenarios[i];
      const response = responses[i];
      
      if (!response) {
        scores.push({
          scenarioId: i,
          score: 0,
          feedback: 'No response provided'
        });
        continue;
      }
      
      // Use AI to evaluate scenario response
      const prompt = `Evaluate this scenario response:\n\nScenario: ${scenario.title}\n\nContext: ${scenario.context}\n\nStakeholders: ${scenario.stakeholders.join(', ')}\n\nQuestions: ${scenario.questions.join('\n')}\n\nCandidate Response:\n${response.answer}\n\nEvaluate the response based on:\n1. Understanding of the scenario\n2. Consideration of stakeholders\n3. Decision-making process\n4. Practical implementation\n5. Communication effectiveness\n\nProvide a score from 0-100 and brief feedback.`;
      
      try {
        const aiResponse = await this.openai.chat.completions.create({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.2
        });
        
        const evaluation = aiResponse.choices[0].message.content.trim();
        const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
        
        scores.push({
          scenarioId: i,
          score,
          feedback: evaluation
        });
      } catch (error) {
        console.error('Error evaluating scenario:', error);
        scores.push({
          scenarioId: i,
          score: 50,
          feedback: 'Error evaluating submission'
        });
      }
    }
    
    return scores;
  }
  
  /**
   * Evaluate data exercise response
   */
  async evaluateDataExercise(dataExercise, response) {
    if (!response) {
      return {
        score: 0,
        feedback: 'No response provided'
      };
    }
    
    // Use AI to evaluate data exercise response
    const prompt = `Evaluate this data interpretation exercise response:\n\nExercise: ${dataExercise.title}\n\nDescription: ${dataExercise.description}\n\nData Description: ${dataExercise.dataDescription}\n\nQuestions: ${dataExercise.questions.join('\n')}\n\nCandidate Response:\n${response.answer}\n\nEvaluate the response based on:\n1. Data interpretation accuracy\n2. Analytical thinking\n3. Business insight quality\n4. Clarity of conclusions\n\nProvide a score from 0-100 and brief feedback.`;
    
    try {
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2
      });
      
      const evaluation = aiResponse.choices[0].message.content.trim();
      const scoreMatch = evaluation.match(/score:\s*(\d+)/i) || evaluation.match(/(\d+)\s*\/\s*100/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 50;
      
      return {
        score,
        feedback: evaluation
      };
    } catch (error) {
      console.error('Error evaluating data exercise:', error);
      return {
        score: 50,
        feedback: 'Error evaluating submission'
      };
    }
  }
  
  /**
   * Calculate total score for technical assessment
   */
  calculateTechnicalTotalScore(codingScores, designScore, debuggingScore, knowledgeScores) {
    // Calculate average coding score
    const avgCodingScore = codingScores.reduce((sum, score) => sum + score.score, 0) / codingScores.length;
    
    // Calculate average knowledge score
    const avgKnowledgeScore = knowledgeScores.reduce((sum, score) => sum + score.score, 0) / knowledgeScores.length;
    
    // Weight each component
    const weightedScore = (
      avgCodingScore * 0.5 + 
      designScore.score * 0.25 + 
      debuggingScore.score * 0.15 + 
      avgKnowledgeScore * 0.1
    );
    
    return Math.round(weightedScore);
  }
  
  /**
   * Calculate total score for non-technical assessment
   */
  calculateNonTechnicalTotalScore(caseStudyScore, scenarioScores, dataScore, knowledgeScores) {
    // Calculate average scenario score
    const avgScenarioScore = scenarioScores.reduce((sum, score) => sum + score.score, 0) / scenarioScores.length;
    
    // Calculate average knowledge score
    const avgKnowledgeScore = knowledgeScores.reduce((sum, score) => sum + score.score, 0) / knowledgeScores.length;
    
    // Weight each component
    const weightedScore = (
      caseStudyScore.score * 0.3 + 
      avgScenarioScore * 0.3 + 
      dataScore.score * 0.2 + 
      avgKnowledgeScore * 0.2
    );
    
    return Math.round(weightedScore);
  }
  
  /**
   * Generate feedback for technical assessment
   */
  generateTechnicalFeedback(totalScore, codingScores, designScore, debuggingScore, knowledgeScores) {
    // Determine overall performance level
    let performanceLevel;
    if (totalScore >= 90) performanceLevel = 'exceptional';
    else if (totalScore >= 80) performanceLevel = 'strong';
    else if (totalScore >= 70) performanceLevel = 'competent';
    else if (totalScore >= 60) performanceLevel = 'adequate';
    else performanceLevel = 'needs improvement';
    
    // Identify strengths and weaknesses
    const strengths = [];
    const weaknesses = [];
    
    // Check coding scores
    const avgCodingScore = codingScores.reduce((sum, score) => sum + score.score, 0) / codingScores.length;
    if (avgCodingScore >= 80) strengths.push('coding skills');
    else if (avgCodingScore < 60) weaknesses.push('coding skills');
    
    // Check system design score
    if (designScore.score >= 80) strengths.push('system design');
    else if (designScore.score < 60) weaknesses.push('system design');
    
    // Check debugging score
    if (debuggingScore.score >= 80) strengths.push('debugging');
    else if (debuggingScore.score < 60) weaknesses.push('debugging');
    
    // Check knowledge scores
    const avgKnowledgeScore = knowledgeScores.reduce((sum, score) => sum + score.score, 0) / knowledgeScores.length;
    if (avgKnowledgeScore >= 80) strengths.push('technical knowledge');
    else if (avgKnowledgeScore < 60) weaknesses.push('technical knowledge');
    
    // Generate feedback text
    return {
      overallAssessment: `The candidate demonstrated ${performanceLevel} technical abilities overall.`,
      score: totalScore,
      strengths: strengths.length > 0 ? `Strong performance in: ${strengths.join(', ')}.` : 'No particular strengths identified.',
      weaknesses: weaknesses.length > 0 ? `Areas for improvement: ${weaknesses.join(', ')}.` : 'No significant weaknesses identified.',
      recommendation: totalScore >= 70 ? 'Recommended for further consideration.' : 'Recommended for additional technical assessment or development.'
    };
  }
  
  /**
   * Generate feedback for non-technical assessment
   */
  generateNonTechnicalFeedback(totalScore, caseStudyScore, scenarioScores, dataScore, knowledgeScores) {
    // Determine overall performance level
    let performanceLevel;
    if (totalScore >= 90) performanceLevel = 'exceptional';
    else if (totalScore >= 80) performanceLevel = 'strong';
    else if (totalScore >= 70) performanceLevel = 'competent';
    else if (totalScore >= 60) performanceLevel = 'adequate';
    else performanceLevel = 'needs improvement';
    
    // Identify strengths and weaknesses
    const strengths = [];
    const weaknesses = [];
    
    // Check case study score
    if (caseStudyScore.score >= 80) strengths.push('strategic thinking');
    else if (caseStudyScore.score < 60) weaknesses.push('strategic thinking');
    
    // Check scenario scores
    const avgScenarioScore = scenarioScores.reduce((sum, score) => sum + score.score, 0) / scenarioScores.length;
    if (avgScenarioScore >= 80) strengths.push('decision making');
    else if (avgScenarioScore < 60) weaknesses.push('decision making');
    
    // Check data exercise score
    if (dataScore.score >= 80) strengths.push('analytical thinking');
    else if (dataScore.score < 60) weaknesses.push('analytical thinking');
    
    // Check knowledge scores
    const avgKnowledgeScore = knowledgeScores.reduce((sum, score) => sum + score.score, 0) / knowledgeScores.length;
    if (avgKnowledgeScore >= 80) strengths.push('domain knowledge');
    else if (avgKnowledgeScore < 60) weaknesses.push('domain knowledge');
    
    // Generate feedback text
    return {
      overallAssessment: `The candidate demonstrated ${performanceLevel} non-technical abilities overall.`,
      score: totalScore,
      strengths: strengths.length > 0 ? `Strong performance in: ${strengths.join(', ')}.` : 'No particular strengths identified.',
      weaknesses: weaknesses.length > 0 ? `Areas for improvement: ${weaknesses.join(', ')}.` : 'No significant weaknesses identified.',
      recommendation: totalScore >= 70 ? 'Recommended for further consideration.' : 'Recommended for additional non-technical assessment or development.'
    };
  }
}