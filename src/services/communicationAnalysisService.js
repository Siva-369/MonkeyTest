/**
 * Communication Analysis Service
 * Evaluates email etiquette, verbal and non-verbal communication, and professionalism in responses.
 * Uses NLP & sentiment analysis to assess tone, clarity, confidence, and emotional intelligence.
 */

const natural = require('natural');
const sentiment = require('sentiment');
const OpenAI = require('openai');

class CommunicationAnalysisService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.sentimentAnalyzer = new sentiment();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Analyze communication patterns in candidate responses
   * @param {string} response - Candidate's response text
   * @param {string} communicationType - Type of communication (email, verbal, written)
   * @param {Object} context - Additional context about the response
   * @returns {Object} Comprehensive communication analysis
   */
  async analyzeCommunication(response, communicationType = 'written', context = {}) {
    try {
      // Basic NLP analysis
      const basicAnalysis = this.performBasicAnalysis(response);
      
      // Advanced AI-powered analysis
      const advancedAnalysis = await this.performAdvancedAnalysis(response, communicationType, context);
      
      return {
        ...basicAnalysis,
        ...advancedAnalysis,
        communicationType,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error analyzing communication:', error);
      throw new Error('Failed to analyze communication');
    }
  }

  /**
   * Perform basic NLP analysis on the response
   */
  performBasicAnalysis(response) {
    // Tokenize the response
    const tokens = this.tokenizer.tokenize(response);
    const wordCount = tokens.length;
    const avgWordLength = tokens.reduce((sum, word) => sum + word.length, 0) / wordCount;
    
    // Sentiment analysis
    const sentimentResult = this.sentimentAnalyzer.analyze(response);
    
    // Calculate readability metrics
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    const sentenceCount = sentences.length;
    const avgSentenceLength = wordCount / sentenceCount;
    
    // Calculate lexical diversity (unique words / total words)
    const uniqueWords = new Set(tokens.map(token => token.toLowerCase()));
    const lexicalDiversity = uniqueWords.size / wordCount;
    
    return {
      basic: {
        wordCount,
        sentenceCount,
        avgWordLength,
        avgSentenceLength,
        lexicalDiversity,
        sentiment: {
          score: sentimentResult.score,
          comparative: sentimentResult.comparative,
          positive: sentimentResult.positive,
          negative: sentimentResult.negative
        }
      }
    };
  }

  /**
   * Perform advanced AI-powered analysis on the response
   */
  async performAdvancedAnalysis(response, communicationType, context) {
    // Create a prompt for the AI model
    const prompt = this.buildAnalysisPrompt(response, communicationType, context);
    
    // Get analysis from OpenAI
    const aiResponse = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.2
    });

    // Parse the AI response
    try {
      const analysisText = aiResponse.choices[0].message.content.trim();
      return JSON.parse(analysisText);
    } catch (error) {
      console.error('Error parsing AI analysis:', error);
      // Fallback to a simpler analysis if JSON parsing fails
      return this.generateFallbackAnalysis(response, communicationType);
    }
  }

  /**
   * Build a prompt for AI analysis
   */
  buildAnalysisPrompt(response, communicationType, context) {
    const contextInfo = context.jobRole 
      ? `This is a response for a ${context.jobRole} position.` 
      : '';

    return `Analyze the following ${communicationType} communication from a job candidate. ${contextInfo}

"""${response}"""

Provide a detailed analysis in JSON format with the following structure:
{
  "advanced": {
    "clarity": {"score": number between 0-100, "feedback": "brief explanation"},
    "professionalism": {"score": number between 0-100, "feedback": "brief explanation"},
    "confidence": {"score": number between 0-100, "feedback": "brief explanation"},
    "emotionalIntelligence": {"score": number between 0-100, "feedback": "brief explanation"},
    "persuasiveness": {"score": number between 0-100, "feedback": "brief explanation"},
    "keyStrengths": [array of strengths],
    "improvementAreas": [array of improvement areas],
    "communicationStyle": "brief description of style"
  }
}`;
  }

  /**
   * Generate a fallback analysis if AI analysis fails
   */
  generateFallbackAnalysis(response, communicationType) {
    // Simple heuristics for fallback analysis
    const wordCount = this.tokenizer.tokenize(response).length;
    const sentimentResult = this.sentimentAnalyzer.analyze(response);
    
    // Basic clarity score based on sentence length
    const sentences = response.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = wordCount / sentences.length;
    const clarityScore = Math.max(0, 100 - (avgSentenceLength - 15) * 2);
    
    // Basic confidence score based on positive language
    const confidenceScore = Math.min(100, Math.max(0, 50 + sentimentResult.score * 10));
    
    return {
      advanced: {
        clarity: {
          score: clarityScore,
          feedback: "Automatically generated based on sentence structure."
        },
        professionalism: {
          score: 70, // Default score
          feedback: "Unable to perform detailed analysis."
        },
        confidence: {
          score: confidenceScore,
          feedback: "Based on sentiment analysis."
        },
        emotionalIntelligence: {
          score: 60, // Default score
          feedback: "Unable to perform detailed analysis."
        },
        persuasiveness: {
          score: 65, // Default score
          feedback: "Unable to perform detailed analysis."
        },
        keyStrengths: [],
        improvementAreas: [],
        communicationStyle: "Analysis unavailable"
      }
    };
  }

  /**
   * Detect behavioral tendencies from communication patterns
   * @param {string} response - Candidate's response
   * @returns {Object} Behavioral analysis results
   */
  detectBehavioralTendencies(response) {
    // Leadership indicators
    const leadershipIndicators = [
      'lead', 'initiative', 'responsibility', 'team', 'vision', 'decision', 'strategy'
    ];
    
    // Collaboration indicators
    const collaborationIndicators = [
      'collaborate', 'team', 'together', 'partnership', 'cooperate', 'joint', 'shared'
    ];
    
    // Problem-solving indicators
    const problemSolvingIndicators = [
      'solve', 'solution', 'analyze', 'approach', 'resolve', 'address', 'tackle'
    ];
    
    const tokens = this.tokenizer.tokenize(response.toLowerCase());
    
    // Count occurrences of each indicator type
    const leadershipCount = this.countIndicators(tokens, leadershipIndicators);
    const collaborationCount = this.countIndicators(tokens, collaborationIndicators);
    const problemSolvingCount = this.countIndicators(tokens, problemSolvingIndicators);
    
    // Calculate scores (0-100)
    const totalWords = tokens.length;
    const leadershipScore = Math.min(100, (leadershipCount / totalWords) * 500);
    const collaborationScore = Math.min(100, (collaborationCount / totalWords) * 500);
    const problemSolvingScore = Math.min(100, (problemSolvingCount / totalWords) * 500);
    
    return {
      behavioral: {
        leadership: {
          score: leadershipScore,
          indicators: this.findMatchingIndicators(tokens, leadershipIndicators)
        },
        collaboration: {
          score: collaborationScore,
          indicators: this.findMatchingIndicators(tokens, collaborationIndicators)
        },
        problemSolving: {
          score: problemSolvingScore,
          indicators: this.findMatchingIndicators(tokens, problemSolvingIndicators)
        },
        dominantTrait: this.determineDominantTrait(leadershipScore, collaborationScore, problemSolvingScore)
      }
    };
  }

  /**
   * Count occurrences of indicators in tokens
   */
  countIndicators(tokens, indicators) {
    return tokens.reduce((count, token) => {
      if (indicators.some(indicator => token.includes(indicator))) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  /**
   * Find matching indicators in tokens
   */
  findMatchingIndicators(tokens, indicators) {
    return indicators.filter(indicator => 
      tokens.some(token => token.includes(indicator))
    );
  }

  /**
   * Determine the dominant behavioral trait
   */
  determineDominantTrait(leadershipScore, collaborationScore, problemSolvingScore) {
    const scores = {
      'leadership': leadershipScore,
      'collaboration': collaborationScore,
      'problem-solving': problemSolvingScore
    };
    
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0][0];
  }
}

module.exports = new CommunicationAnalysisService();