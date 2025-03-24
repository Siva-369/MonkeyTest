/**
 * Adaptive Scenario Service
 * Generates dynamic, non-repetitive, and highly contextual job-related scenarios
 * that assess candidates' problem-solving, creative thinking, and decision-making abilities.
 */

const OpenAI = require('openai');
const natural = require('natural');

class AdaptiveScenarioService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.tokenizer = new natural.WordTokenizer();
  }

  /**
   * Generate a dynamic scenario based on job role, previous responses, and skills
   * @param {string} role - Target job role
   * @param {string} difficultyLevel - Difficulty level (entry, intermediate, advanced, expert)
   * @param {Array} skills - Required skills for the role
   * @param {Array} previousResponses - Previous candidate responses (for non-repetitive scenarios)
   * @param {Object} candidateProfile - Candidate profile for personalization
   * @returns {Object} Generated scenario with questions
   */
  async generateDynamicScenario(role, difficultyLevel, skills, previousResponses = [], candidateProfile = {}) {
    try {
      // Extract key themes from previous responses to avoid repetition
      const avoidThemes = this.extractKeyThemes(previousResponses);
      
      // Build a prompt that ensures non-repetitive scenarios
      const prompt = this.buildAdaptivePrompt(role, difficultyLevel, skills, avoidThemes, candidateProfile);
      
      // Generate scenario using OpenAI
      const response = await this.openai.chat.completions.create({
        model: "gpt-4", // Using more advanced model for better scenario generation
        messages: [{ role: "user", content: prompt }],
        max_tokens: 800,
        temperature: 0.7
      });

      const scenarioText = response.choices[0].message.content.trim();
      return this.parseScenario(scenarioText, difficultyLevel, role);
    } catch (error) {
      console.error('Error generating adaptive scenario:', error);
      throw new Error('Failed to generate adaptive scenario');
    }
  }

  /**
   * Build an adaptive prompt for scenario generation
   */
  buildAdaptivePrompt(role, difficultyLevel, skills, avoidThemes = [], candidateProfile = {}) {
    const difficultyLevels = {
      entry: 'basic',
      intermediate: 'moderate',
      advanced: 'complex',
      expert: 'highly complex'
    };

    // Enhanced personalization based on candidate profile
    let personalization = '';
    if (candidateProfile) {
      const experienceText = candidateProfile.experience 
        ? `The candidate has ${candidateProfile.experience} years of experience.` 
        : '';
      
      const educationText = candidateProfile.education && candidateProfile.education.length > 0
        ? `Their highest education is ${candidateProfile.education[0].degree} from ${candidateProfile.education[0].institution}.`
        : '';
      
      const skillsText = candidateProfile.skills && candidateProfile.skills.length > 0
        ? `Their skills include: ${candidateProfile.skills.join(', ')}.`
        : '';
      
      const performanceText = candidateProfile.overallPerformance && candidateProfile.overallPerformance.averageScore
        ? `Their average performance score is ${candidateProfile.overallPerformance.averageScore}.`
        : '';
      
      personalization = `${experienceText} ${educationText} ${skillsText} ${performanceText}`;
    }

    // Enhanced themes avoidance for truly non-repetitive scenarios
    const avoidThemesText = avoidThemes.length > 0 
      ? `Avoid these themes that were already covered: ${avoidThemes.join(', ')}. Create a completely different scenario context.` 
      : '';

    return `Generate a ${difficultyLevels[difficultyLevel]} workplace scenario for a ${role} position.
    Required skills: ${skills.join(', ')}.
    ${personalization}
    ${avoidThemesText}
    
    Create a realistic, job-specific scenario that tests problem-solving, creative thinking, and decision-making.
    
    Include:
    - A realistic workplace situation aligned with actual job responsibilities
    - Detailed context and background information
    - Specific challenges that require critical thinking
    - Multiple aspects to consider (technical, interpersonal, business impact)
    - Opportunities to demonstrate the required skills
    - Industry-specific terminology and situations
    - Realistic constraints and limitations
    - Stakeholders with different perspectives and needs
    
    Format the response as JSON with these fields:
    - title: Brief descriptive title
    - description: Short overview of the scenario
    - context: Detailed background information
    - challenges: Array of specific challenges to address
    - stakeholders: Key people involved in the scenario
    - constraints: Limitations or restrictions to consider
    - successCriteria: Metrics for evaluating success`;
  }

  /**
   * Parse the generated scenario text into a structured format
   */
  parseScenario(scenarioText, difficultyLevel, role) {
    let scenario;
    try {
      // Try to parse as JSON first
      scenario = JSON.parse(scenarioText);
    } catch (e) {
      // Fallback to text parsing if JSON parsing fails
      const sections = scenarioText.split('\n\n').filter(Boolean);
      scenario = {
        title: sections[0].replace('Title:', '').trim(),
        description: sections[1].replace('Description:', '').trim(),
        context: sections[2].replace('Context:', '').trim(),
        challenges: sections.slice(3).map(s => s.trim())
      };
    }

    // Generate appropriate questions based on the scenario
    const questions = this.generateAdaptiveQuestions(scenario, difficultyLevel, role);

    return {
      ...scenario,
      difficultyLevel,
      role,
      questions,
      createdAt: new Date(),
      isAdaptive: true
    };
  }

  /**
   * Generate adaptive questions based on the scenario
   */
  generateAdaptiveQuestions(scenario, difficultyLevel, role) {
    const questions = [];
    const pointsMap = {
      'entry': 10,
      'intermediate': 15,
      'advanced': 20,
      'expert': 25
    };

    // Enhanced question generation based on difficulty level
    const difficultyModifiers = {
      'entry': {
        complexity: 'basic',
        depth: 'fundamental',
        constraints: 'minimal'
      },
      'intermediate': {
        complexity: 'moderate',
        depth: 'detailed',
        constraints: 'reasonable'
      },
      'advanced': {
        complexity: 'complex',
        depth: 'comprehensive',
        constraints: 'significant'
      },
      'expert': {
        complexity: 'highly complex',
        depth: 'exhaustive',
        constraints: 'challenging'
      }
    };
    
    const modifier = difficultyModifiers[difficultyLevel];

    // Generate enhanced behavioral questions
    questions.push({
      content: `How would you approach solving the ${scenario.title} challenge? Provide a ${modifier.depth} step-by-step process, considering ${modifier.constraints} constraints and stakeholder needs.`,
      type: 'behavioral',
      difficulty: difficultyLevel,
      points: pointsMap[difficultyLevel],
      category: 'problem_solving'
    });

    // Generate enhanced scenario-based questions
    if (scenario.challenges && Array.isArray(scenario.challenges)) {
      scenario.challenges.forEach((challenge, index) => {
        questions.push({
          content: `Regarding the challenge: "${challenge}", what specific actions would you take and why? Include ${modifier.complexity} considerations for potential outcomes and trade-offs.`,
          type: 'scenario',
          difficulty: difficultyLevel,
          points: pointsMap[difficultyLevel],
          category: 'critical_thinking'
        });
      });
    }

    // Add enhanced role-specific questions
    if (role.includes('developer') || role.includes('engineer')) {
      questions.push({
        content: `What technical approaches or technologies would you use to address this scenario? Provide ${modifier.depth} explanations for your choices, including architecture considerations and potential technical challenges.`,
        type: 'technical',
        difficulty: difficultyLevel,
        points: pointsMap[difficultyLevel] * 1.2, // Higher points for technical questions
        category: 'technical_expertise'
      });
      
      // Add system design question for higher difficulty levels
      if (difficultyLevel === 'advanced' || difficultyLevel === 'expert') {
        questions.push({
          content: `Design a system architecture to address the core challenges in this scenario. Include components, data flow, scalability considerations, and potential bottlenecks.`,
          type: 'system_design',
          difficulty: difficultyLevel,
          points: pointsMap[difficultyLevel] * 1.5,
          category: 'system_design'
        });
      }
    } else if (role.includes('manager') || role.includes('lead')) {
      questions.push({
        content: `How would you manage the team and stakeholders in this scenario? Describe ${modifier.depth} leadership approaches you would employ, including communication strategies and conflict resolution.`,
        type: 'leadership',
        difficulty: difficultyLevel,
        points: pointsMap[difficultyLevel] * 1.2,
        category: 'leadership_skills'
      });
      
      // Add resource management question for higher difficulty levels
      if (difficultyLevel === 'advanced' || difficultyLevel === 'expert') {
        questions.push({
          content: `How would you allocate resources and manage priorities in this scenario? Include budget considerations, team capacity planning, and risk mitigation strategies.`,
          type: 'resource_management',
          difficulty: difficultyLevel,
          points: pointsMap[difficultyLevel] * 1.3,
          category: 'management_skills'
        });
      }
    }
    
    // Add communication question for all roles
    questions.push({
      content: `How would you communicate the approach and results to all stakeholders in this scenario? Consider different audience needs and communication channels.`,
      type: 'communication',
      difficulty: difficultyLevel,
      points: pointsMap[difficultyLevel],
      category: 'communication'
    });

    return questions;
  }

  /**
   * Extract key themes from previous responses to avoid repetition
   */
  extractKeyThemes(previousResponses) {
    if (!previousResponses || previousResponses.length === 0) {
      return [];
    }

    const allText = previousResponses.join(' ');
    const tokens = this.tokenizer.tokenize(allText);
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with']);
    
    // Count word frequencies
    const wordFrequency = {};
    tokens.forEach(token => {
      const word = token.toLowerCase();
      if (!stopwords.has(word) && word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Sort by frequency and get top themes
    return Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }
}

module.exports = new AdaptiveScenarioService();