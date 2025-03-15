const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const sentiment = require('sentiment');

class AIAnalysisService {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
  }

  analyzeBehavioralResponse(response) {
    const analysis = {
      sentiment: this.analyzeSentiment(response),
      communication: this.analyzeCommunicationPatterns(response),
      leadership: this.evaluateLeadershipPotential(response),
      stress: this.analyzeStressResponse(response)
    };

    return analysis;
  }

  analyzeSentiment(text) {
    const result = this.sentimentAnalyzer.analyze(text);
    return {
      score: result.score,
      comparative: result.comparative,
      tokens: result.tokens,
      positive: result.positive,
      negative: result.negative
    };
  }

  analyzeCommunicationPatterns(text) {
    const tokens = tokenizer.tokenize(text);
    const wordCount = tokens.length;
    const avgWordLength = tokens.reduce((sum, word) => sum + word.length, 0) / wordCount;
    
    return {
      clarity: this.calculateClarity(text),
      complexity: this.calculateComplexity(text, avgWordLength),
      coherence: this.calculateCoherence(text),
      wordCount,
      avgWordLength
    };
  }

  evaluateLeadershipPotential(text) {
    const leadershipIndicators = [
      'initiative',
      'responsibility',
      'team',
      'vision',
      'decision',
      'strategy'
    ];

    const tokens = tokenizer.tokenize(text.toLowerCase());
    const indicatorCount = leadershipIndicators.reduce((count, indicator) => {
      return count + tokens.filter(token => token.includes(indicator)).length;
    }, 0);

    return {
      score: (indicatorCount / tokens.length) * 100,
      indicators: leadershipIndicators.filter(indicator => 
        tokens.some(token => token.includes(indicator))
      )
    };
  }

  analyzeStressResponse(text) {
    const stressIndicators = {
      positive: ['calm', 'managed', 'resolved', 'learned', 'adapted'],
      negative: ['stressed', 'overwhelmed', 'anxious', 'worried', 'frustrated']
    };

    const tokens = tokenizer.tokenize(text.toLowerCase());
    const analysis = {
      positiveCount: 0,
      negativeCount: 0,
      overallScore: 0
    };

    tokens.forEach(token => {
      if (stressIndicators.positive.some(indicator => token.includes(indicator))) {
        analysis.positiveCount++;
      }
      if (stressIndicators.negative.some(indicator => token.includes(indicator))) {
        analysis.negativeCount++;
      }
    });

    analysis.overallScore = 
      ((analysis.positiveCount - analysis.negativeCount) / tokens.length) * 100;

    return analysis;
  }

  calculateClarity(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const avgSentenceLength = text.length / sentences.length;
    return Math.max(0, 100 - (avgSentenceLength - 15) * 2);
  }

  calculateComplexity(text, avgWordLength) {
    const complexityScore = avgWordLength * 10;
    return Math.min(100, complexityScore);
  }

  calculateCoherence(text) {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const coherenceScore = sentences.length > 1 ? 
      (100 - (sentences.length / text.length) * 1000) : 50;
    return Math.max(0, Math.min(100, coherenceScore));
  }
}

module.exports = new AIAnalysisService();