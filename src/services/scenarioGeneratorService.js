const natural = require('natural');
const OpenAI = require('openai');

class ScenarioGeneratorService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateScenario(role, difficulty, skills) {
    try {
      const prompt = this.buildPrompt(role, difficulty, skills);
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      });

      const scenarioText = response.data.choices[0].text.trim();
      return this.parseScenario(scenarioText, difficulty);
    } catch (error) {
      console.error('Error generating scenario:', error);
      throw new Error('Failed to generate scenario');
    }
  }

  buildPrompt(role, difficulty, skills) {
    const difficultyLevels = {
      entry: 'basic',
      intermediate: 'moderate',
      advanced: 'complex',
      expert: 'highly complex'
    };

    return `Generate a ${difficultyLevels[difficulty]} workplace scenario for a ${role} position.
    Required skills: ${skills.join(', ')}.
    Include:
    - A realistic workplace situation
    - Context and background information
    - Specific challenges or problems to solve
    - Multiple aspects to consider
    Format the response as: Title | Description | Context`;
  }

  parseScenario(scenarioText, difficulty) {
    const [title, description, context] = scenarioText.split('|').map(s => s.trim());

    return {
      title,
      description,
      context,
      difficulty,
      questions: this.generateQuestions(scenarioText, difficulty)
    };
  }

  generateQuestions(scenarioText, difficulty) {
    const questions = [];
    const tokens = this.tokenizer.tokenize(scenarioText);
    const keyTopics = this.extractKeyTopics(tokens);

    // Generate behavioral questions
    questions.push({
      content: `How would you approach solving the ${keyTopics[0]} challenge in this scenario?`,
      type: 'behavioral',
      difficulty: difficulty,
      points: this.calculatePoints(difficulty),
      category: 'problem_solving'
    });

    // Generate scenario-based questions
    questions.push({
      content: `What potential risks or challenges do you foresee in implementing your solution to the ${keyTopics[1]} situation?`,
      type: 'scenario',
      difficulty: difficulty,
      points: this.calculatePoints(difficulty),
      category: 'risk_assessment'
    });

    return questions;
  }

  extractKeyTopics(tokens) {
    const stopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to']);
    const topics = tokens
      .filter(token => !stopwords.has(token.toLowerCase()))
      .filter(token => token.length > 3);
    
    return [...new Set(topics)];
  }

  calculatePoints(difficulty) {
    const pointsMap = {
      'entry': 10,
      'intermediate': 15,
      'advanced': 20,
      'expert': 25
    };
    return pointsMap[difficulty] || 10;
  }
}

module.exports = new ScenarioGeneratorService();