/**
 * Enhanced Behavioral Analysis Service
 * Provides advanced algorithms for analyzing candidate behavior, communication patterns,
 * and emotional intelligence with more detailed metrics and insights.
 */

const natural = require('natural');
const sentiment = require('sentiment');
const OpenAI = require('openai');

class EnhancedBehavioralAnalysisService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.sentimentAnalyzer = new sentiment();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Perform comprehensive behavioral analysis on candidate responses
   * @param {string} response - Candidate's response text
   * @param {Object} context - Additional context about the response and question
   * @returns {Object} Detailed behavioral analysis
   */
  async analyzeBehavior(response, context = {}) {
    try {
      // Basic NLP analysis
      const basicAnalysis = this.performBasicAnalysis(response);
      
      // Advanced sentiment and emotion analysis
      const emotionAnalysis = await this.analyzeEmotions(response);
      
      // Communication pattern analysis
      const communicationPatterns = this.analyzeCommunicationPatterns(response);
      
      // Leadership and decision-making analysis
      const leadershipAnalysis = this.analyzeLeadershipTraits(response);
      
      // Problem-solving approach analysis
      const problemSolvingAnalysis = this.analyzeProblemSolvingApproach(response, context);
      
      // Combine all analyses
      return {
        basic: basicAnalysis,
        emotions: emotionAnalysis,
        communication: communicationPatterns,
        leadership: leadershipAnalysis,
        problemSolving: problemSolvingAnalysis,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      throw new Error('Failed to analyze behavior');
    }
  }

  /**
   * Perform basic NLP analysis on the response
   */
  performBasicAnalysis(response) {
    // Tokenize the response
    const tokens = this.tokenizer.tokenize(response);
    const wordCount = tokens.length;
    
    // Calculate basic metrics
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    const sentenceCount = sentences.length;
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Calculate lexical diversity (unique words / total words)
    const uniqueWords = new Set(tokens.map(token => token.toLowerCase()));
    const lexicalDiversity = uniqueWords.size / wordCount;
    
    // Basic sentiment analysis
    const sentimentResult = this.sentimentAnalyzer.analyze(response);
    
    return {
      wordCount,
      sentenceCount,
      avgSentenceLength,
      lexicalDiversity,
      sentiment: {
        score: sentimentResult.score,
        comparative: sentimentResult.comparative,
        positive: sentimentResult.positive,
        negative: sentimentResult.negative
      }
    };
  }

  /**
   * Analyze emotions in the response using advanced NLP
   */
  async analyzeEmotions(response) {
    try {
      // Create a prompt for emotion analysis
      const prompt = `Analyze the following text for emotional content and provide scores (0-100) for each of these emotions: confidence, enthusiasm, empathy, anxiety, frustration, and professionalism. Also identify the dominant emotion.

Text: "${response}"

Provide the analysis in JSON format with these fields: confidence, enthusiasm, empathy, anxiety, frustration, professionalism, dominantEmotion`;
      
      // Get analysis from OpenAI
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.2
      });

      // Parse the AI response
      const content = aiResponse.choices[0].message.content.trim();
      let emotionData;
      
      try {
        // Try to parse as JSON
        emotionData = JSON.parse(content);
      } catch (e) {
        // Fallback to regex extraction if JSON parsing fails
        emotionData = {
          confidence: this.extractScoreFromText(content, 'confidence'),
          enthusiasm: this.extractScoreFromText(content, 'enthusiasm'),
          empathy: this.extractScoreFromText(content, 'empathy'),
          anxiety: this.extractScoreFromText(content, 'anxiety'),
          frustration: this.extractScoreFromText(content, 'frustration'),
          professionalism: this.extractScoreFromText(content, 'professionalism'),
          dominantEmotion: this.extractDominantEmotion(content)
        };
      }
      
      return emotionData;
    } catch (error) {
      console.error('Error analyzing emotions:', error);
      // Provide fallback values if AI analysis fails
      return {
        confidence: 50,
        enthusiasm: 50,
        empathy: 50,
        anxiety: 50,
        frustration: 50,
        professionalism: 50,
        dominantEmotion: 'neutral'
      };
    }
  }

  /**
   * Extract score from text using regex
   */
  extractScoreFromText(text, emotion) {
    const regex = new RegExp(`${emotion}[^0-9]*(\d+)`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : 50;
  }

  /**
   * Extract dominant emotion from text
   */
  extractDominantEmotion(text) {
    const emotions = ['confidence', 'enthusiasm', 'empathy', 'anxiety', 'frustration', 'professionalism'];
    const regex = /dominant\s*emotion[^a-z]*(\w+)/i;
    const match = text.match(regex);
    return match ? match[1].toLowerCase() : 'neutral';
  }

  /**
   * Analyze communication patterns in the response
   */
  analyzeCommunicationPatterns(response) {
    const tokens = this.tokenizer.tokenize(response);
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    
    // Calculate clarity score based on sentence length and structure
    const avgSentenceLength = tokens.length / sentences.length;
    const clarityScore = Math.max(0, 100 - Math.abs(avgSentenceLength - 15) * 2);
    
    // Calculate complexity based on word length and unique words
    const avgWordLength = tokens.reduce((sum, word) => sum + word.length, 0) / tokens.length;
    const uniqueWords = new Set(tokens.map(token => token.toLowerCase()));
    const complexityScore = (avgWordLength * 10) + (uniqueWords.size / tokens.length) * 50;
    
    // Calculate coherence based on sentence transitions and structure
    const coherenceScore = this.calculateCoherence(sentences);
    
    // Analyze formality level
    const formalityScore = this.calculateFormality(response, tokens);
    
    // Analyze assertiveness
    const assertivenessScore = this.calculateAssertiveness(response);
    
    return {
      clarity: Math.min(100, clarityScore),
      complexity: Math.min(100, complexityScore),
      coherence: Math.min(100, coherenceScore),
      formality: Math.min(100, formalityScore),
      assertiveness: Math.min(100, assertivenessScore),
      wordCount: tokens.length,
      sentenceCount: sentences.length,
      avgWordLength,
      avgSentenceLength
    };
  }

  /**
   * Calculate coherence score based on sentence transitions
   */
  calculateCoherence(sentences) {
    if (sentences.length <= 1) {
      return 50; // Default for single sentence
    }
    
    let transitionWords = 0;
    const transitionPhrases = [
      'therefore', 'thus', 'consequently', 'as a result', 'hence',
      'furthermore', 'moreover', 'in addition', 'besides', 'also',
      'however', 'nevertheless', 'on the other hand', 'conversely',
      'first', 'second', 'third', 'finally', 'lastly',
      'for example', 'for instance', 'specifically', 'to illustrate'
    ];
    
    // Count transition words/phrases
    for (let i = 1; i < sentences.length; i++) {
      const sentence = sentences[i].toLowerCase();
      if (transitionPhrases.some(phrase => sentence.includes(phrase))) {
        transitionWords++;
      }
    }
    
    // Calculate coherence score based on transition words and sentence structure
    const transitionRatio = transitionWords / (sentences.length - 1);
    return 50 + (transitionRatio * 50);
  }

  /**
   * Calculate formality score based on language patterns
   */
  calculateFormality(text, tokens) {
    // Indicators of formal language
    const formalIndicators = [
      'would', 'could', 'should', 'shall', 'may', 'might',
      'therefore', 'however', 'nevertheless', 'furthermore',
      'additionally', 'consequently', 'regarding', 'concerning'
    ];
    
    // Indicators of informal language
    const informalIndicators = [
      'yeah', 'nah', 'gonna', 'wanna', 'gotta', 'kinda', 'sorta',
      'like', 'just', 'stuff', 'things', 'okay', 'ok', 'cool', 'awesome'
    ];
    
    // Count contractions (indicator of informality)
    const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
    
    // Count formal and informal indicators
    let formalCount = 0;
    let informalCount = 0;
    
    tokens.forEach(token => {
      const word = token.toLowerCase();
      if (formalIndicators.includes(word)) formalCount++;
      if (informalIndicators.includes(word)) informalCount++;
    });
    
    // Calculate formality score
    const totalIndicators = formalCount + informalCount + contractionCount;
    if (totalIndicators === 0) return 50; // Default neutral score
    
    return 50 + ((formalCount - (informalCount + contractionCount)) / totalIndicators) * 50;
  }

  /**
   * Calculate assertiveness score based on language patterns
   */
  calculateAssertiveness(text) {
    // Indicators of assertive language
    const assertivePatterns = [
      /\bI (will|am going to)\b/gi,
      /\bI (believe|think|know)\b/gi,
      /\b(must|need to|should|will)\b/gi,
      /\b(definitely|certainly|absolutely)\b/gi
    ];
    
    // Indicators of hesitant language
    const hesitantPatterns = [
      /\b(maybe|perhaps|possibly)\b/gi,
      /\b(might|could|may)\b/gi,
      /\b(sort of|kind of)\b/gi,
      /\b(I guess|I suppose)\b/gi,
      /\b(not sure|uncertain)\b/gi
    ];
    
    // Count assertive and hesitant patterns
    let assertiveCount = assertivePatterns.reduce((count, pattern) => 
      count + (text.match(pattern) || []).length, 0);
    
    let hesitantCount = hesitantPatterns.reduce((count, pattern) => 
      count + (text.match(pattern) || []).length, 0);
    
    // Calculate assertiveness score
    const totalPatterns = assertiveCount + hesitantCount;
    if (totalPatterns === 0) return 50; // Default neutral score
    
    return 50 + ((assertiveCount - hesitantCount) / totalPatterns) * 50;
  }

  /**
   * Analyze leadership traits in the response
   */
  analyzeLeadershipTraits(response) {
    const text = response.toLowerCase();
    
    // Define leadership trait indicators
    const leadershipTraits = {
      decisionMaking: [
        'decide', 'decision', 'chose', 'select', 'determine', 'resolve',
        'judgment', 'conclusion', 'option', 'alternative'
      ],
      teamOrientation: [
        'team', 'collaborate', 'together', 'group', 'collective',
        'cooperation', 'partnership', 'joint', 'shared', 'we'
      ],
      vision: [
        'vision', 'future', 'goal', 'objective', 'strategy', 'plan',
        'direction', 'mission', 'purpose', 'aim'
      ],
      accountability: [
        'responsible', 'accountability', 'ownership', 'duty', 'obligation',
        'commitment', 'reliable', 'dependable', 'trustworthy'
      ],
      problemSolving: [
        'solve', 'solution', 'resolve', 'address', 'tackle', 'approach',
        'handle', 'manage', 'deal with', 'overcome'
      ]
    };
    
    // Calculate scores for each leadership trait
    const traitScores = {};
    let totalIndicators = 0;
    
    Object.entries(leadershipTraits).forEach(([trait, indicators]) => {
      let count = 0;
      indicators.forEach(indicator => {
        const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
        const matches = text.match(regex) || [];
        count += matches.length;
      });
      
      traitScores[trait] = count;
      totalIndicators += count;
    });
    
    // Normalize scores to 0-100 scale
    const normalizedScores = {};
    Object.entries(traitScores).forEach(([trait, count]) => {
      normalizedScores[trait] = totalIndicators > 0 ? 
        Math.min(100, (count / totalIndicators) * 100 * 5) : 0;
    });
    
    // Calculate overall leadership score
    const overallScore = Object.values(normalizedScores).reduce((sum, score) => sum + score, 0) / 
      Object.keys(normalizedScores).length;
    
    return {
      traits: normalizedScores,
      overallScore,
      dominantTrait: Object.entries(normalizedScores)
        .sort((a, b) => b[1] - a[1])[0][0]
    };
  }

  /**
   * Analyze problem-solving approach in the response
   * @param {string} response - Candidate's response text
   * @param {Object} context - Additional context about the response and question
   * @returns {Object} Problem-solving analysis
   */
  analyzeProblemSolvingApproach(response, context = {}) {
    const text = response.toLowerCase();
    
    // Define problem-solving approach indicators
    const approachIndicators = {
      analytical: [
        'analyze', 'examine', 'evaluate', 'assess', 'consider',
        'data', 'information', 'evidence', 'research', 'investigate'
      ],
      creative: [
        'create', 'innovative', 'unique', 'novel', 'original',
        'imagine', 'possibility', 'alternative', 'different', 'new'
      ],
      practical: [
        'implement', 'practical', 'realistic', 'feasible', 'doable',
        'efficient', 'effective', 'straightforward', 'direct', 'simple'
      ],
      methodical: [
        'process', 'step', 'method', 'procedure', 'systematic',
        'organize', 'structure', 'plan', 'approach', 'framework'
      ],
      collaborative: [
        'team', 'collaborate', 'together', 'group', 'collective',
        'input', 'feedback', 'discuss', 'share', 'consult'
      ]
    };
    
    // Calculate scores for each approach
    const approachScores = {};
    let totalIndicators = 0;
    
    Object.entries(approachIndicators).forEach(([approach, indicators]) => {
      let count = 0;
      indicators.forEach(indicator => {
        const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
        const matches = text.match(regex) || [];
        count += matches.length;
      });
      
      approachScores[approach] = count;
      totalIndicators += count;
    });
    
    // Normalize scores to 0-100 scale
    const normalizedScores = {};
    Object.entries(approachScores).forEach(([approach, count]) => {
      normalizedScores[approach] = totalIndicators > 0 ? 
        Math.min(100, (count / totalIndicators) * 100 * 5) : 0;
    });
    
    // Calculate overall problem-solving score
    const overallScore = Object.values(normalizedScores).reduce((sum, score) => sum + score, 0) / 
      Object.keys(normalizedScores).length;
    
    // Determine dominant approach
    const dominantApproach = Object.entries(normalizedScores)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Analyze complexity of problem-solving
    const complexityScore = this.calculateProblemSolvingComplexity(response);
    
    return {
      approaches: normalizedScores,
      dominantApproach,
      complexity: complexityScore,
      overallScore
    };
  }
  
  /**
   * Calculate the complexity of problem-solving approach
   */
  calculateProblemSolvingComplexity(response) {
    const tokens = this.tokenizer.tokenize(response);
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    
    // Indicators of complex problem-solving
    const complexityIndicators = [
      'however', 'although', 'nevertheless', 'despite', 'while',
      'conversely', 'alternatively', 'in contrast', 'on the other hand',
      'multiple', 'various', 'different', 'several', 'many',
      'complex', 'complicated', 'intricate', 'sophisticated', 'nuanced'
    ];
    
    // Count complexity indicators
    let complexityCount = 0;
    complexityIndicators.forEach(indicator => {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = response.match(regex) || [];
      complexityCount += matches.length;
    });
    
    // Calculate complexity based on sentence structure, word diversity, and indicators
    const avgSentenceLength = tokens.length / sentences.length;
    const uniqueWords = new Set(tokens.map(token => token.toLowerCase()));
    const lexicalDiversity = uniqueWords.size / tokens.length;
    
    // Combine factors for complexity score
    const complexityScore = Math.min(100, (
      (avgSentenceLength / 20) * 30 +
      (lexicalDiversity) * 40 +
      (complexityCount / 5) * 30
    ));
    
    return complexityScore;
  }
}

module.exports = EnhancedBehavioralAnalysisService;