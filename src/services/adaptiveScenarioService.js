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

    // Add personalization based on candidate profile
    const personalization = candidateProfile.experience 
      ? `The candidate has ${candidateProfile.experience} years of experience.` 
      : '';

    // Add themes to avoid for non-repetitive scenarios
    const avoidThemesText = avoidThemes.length > 0 
      ? `Avoid these themes that were already covered: ${avoidThemes.join(', ')}.` 
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
    
    Format the response as JSON with these fields:
    - title: Brief descriptive title
    - description: Short overview of the scenario
    - context: Detailed background information
    - challenges: Array of specific challenges to address
    - stakeholders: Key people involved in the scenario`;
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

    // Generate behavioral questions
    questions.push({
      content: `How would you approach solving the ${scenario.title} challenge? Describe your step-by-step process.`,
      type: 'behavioral',
      difficulty: difficultyLevel,
      points: pointsMap[difficultyLevel],
      category: 'problem_solving'
    });

    // Generate scenario-based questions
    if (scenario.challenges && Array.isArray(scenario.challenges)) {
      scenario.challenges.forEach((challenge, index) => {
        questions.push({
          content: `Regarding the challenge: "${challenge}", what specific actions would you take and why?`,
          type: 'scenario',
          difficulty: difficultyLevel,
          points: pointsMap[difficultyLevel],
          category: 'critical_thinking'
        });
      });
    }

    // Add role-specific technical questions
    if (role.includes('developer') || role.includes('engineer')) {
      questions.push({
        content: `What technical approaches or technologies would you use to address this scenario? Explain your choices.`,
        type: 'technical',
        difficulty: difficultyLevel,
        points: pointsMap[difficultyLevel] * 1.2, // Higher points for technical questions
        category: 'technical_expertise'
      });
    } else if (role.includes('manager') || role.includes('lead')) {
      questions.push({
        content: `How would you manage the team and stakeholders in this scenario? What leadership approaches would you employ?`,
        type: 'leadership',
        difficulty: difficultyLevel,
        points: pointsMap[difficultyLevel] * 1.2,
        category: 'leadership_skills'
      });
    }

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