/**
 * Code Evaluation Service
 * Provides real-time evaluation of candidate code submissions with detailed metrics
 * on code quality, efficiency, and best practices adherence.
 */

const OpenAI = require('openai');

class CodeEvaluationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Evaluate a code submission with detailed metrics
   * @param {string} code - The submitted code
   * @param {Object} challenge - The coding challenge details
   * @param {string} language - Programming language of the submission
   * @returns {Object} Detailed evaluation results
   */
  async evaluateCode(code, challenge, language) {
    try {
      // Basic static analysis
      const staticAnalysis = this.performStaticAnalysis(code, language);
      
      // Functional correctness evaluation
      const functionalEvaluation = await this.evaluateFunctionalCorrectness(code, challenge, language);
      
      // Code quality assessment
      const qualityAssessment = await this.assessCodeQuality(code, language);
      
      // Efficiency analysis
      const efficiencyAnalysis = await this.analyzeEfficiency(code, challenge, language);
      
      // Best practices adherence
      const bestPracticesEvaluation = await this.evaluateBestPractices(code, language);
      
      return {
        staticAnalysis,
        functionalEvaluation,
        qualityAssessment,
        efficiencyAnalysis,
        bestPracticesEvaluation,
        overallScore: this.calculateOverallScore({
          staticAnalysis,
          functionalEvaluation,
          qualityAssessment,
          efficiencyAnalysis,
          bestPracticesEvaluation
        }),
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error evaluating code:', error);
      throw new Error('Failed to evaluate code submission');
    }
  }

  /**
   * Perform static analysis on code
   * @param {string} code - The submitted code
   * @param {string} language - Programming language
   * @returns {Object} Static analysis results
   */
  performStaticAnalysis(code, language) {
    // Calculate basic metrics
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    const commentLines = this.countCommentLines(code, language);
    const codeLines = nonEmptyLines.length - commentLines;
    
    // Calculate code-to-comment ratio
    const commentRatio = commentLines > 0 ? codeLines / commentLines : 0;
    
    // Detect potential code smells
    const codeSmells = this.detectCodeSmells(code, language);
    
    return {
      totalLines: lines.length,
      codeLines,
      commentLines,
      commentRatio,
      codeSmells
    };
  }

  /**
   * Count comment lines in code
   * @param {string} code - The submitted code
   * @param {string} language - Programming language
   * @returns {number} Number of comment lines
   */
  countCommentLines(code, language) {
    let commentCount = 0;
    const lines = code.split('\n');
    
    // Define comment patterns based on language
    let lineCommentPattern;
    let blockCommentStart;
    let blockCommentEnd;
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
      case 'java':
      case 'c':
      case 'cpp':
      case 'csharp':
        lineCommentPattern = '//';
        blockCommentStart = '/*';
        blockCommentEnd = '*/';
        break;
      case 'python':
        lineCommentPattern = '#';
        blockCommentStart = '"""';
        blockCommentEnd = '"""';
        break;
      case 'ruby':
        lineCommentPattern = '#';
        blockCommentStart = '=begin';
        blockCommentEnd = '=end';
        break;
      default:
        lineCommentPattern = '//';
        blockCommentStart = '/*';
        blockCommentEnd = '*/';
    }
    
    // Count line comments
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith(lineCommentPattern)) {
        commentCount++;
      }
    });
    
    // Count block comments
    let inBlockComment = false;
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (!inBlockComment && trimmedLine.includes(blockCommentStart)) {
        inBlockComment = true;
        commentCount++;
      } else if (inBlockComment && trimmedLine.includes(blockCommentEnd)) {
        inBlockComment = false;
        commentCount++;
      } else if (inBlockComment) {
        commentCount++;
      }
    });
    
    return commentCount;
  }

  /**
   * Detect code smells in the submission
   * @param {string} code - The submitted code
   * @param {string} language - Programming language
   * @returns {Array} Detected code smells
   */
  detectCodeSmells(code, language) {
    const codeSmells = [];
    
    // Check for long functions/methods
    const longFunctionThreshold = 30; // lines
    const functions = this.extractFunctions(code, language);
    
    functions.forEach(func => {
      if (func.lines > longFunctionThreshold) {
        codeSmells.push({
          type: 'long_function',
          description: `Function '${func.name}' is too long (${func.lines} lines)`,
          severity: 'medium'
        });
      }
    });
    
    // Check for deeply nested code
    const maxNestingLevel = this.calculateMaxNestingLevel(code, language);
    if (maxNestingLevel > 4) {
      codeSmells.push({
        type: 'deep_nesting',
        description: `Code contains deep nesting (level ${maxNestingLevel})`,
        severity: 'medium'
      });
    }
    
    // Check for duplicated code
    const duplicatedCode = this.detectDuplicatedCode(code);
    if (duplicatedCode.length > 0) {
      codeSmells.push({
        type: 'duplicated_code',
        description: `Code contains ${duplicatedCode.length} instances of duplicated code`,
        severity: 'high'
      });
    }
    
    return codeSmells;
  }

  /**
   * Extract functions/methods from code
   * @param {string} code - The submitted code
   * @param {string} language - Programming language
   * @returns {Array} Extracted functions with metadata
   */
  extractFunctions(code, language) {
    const functions = [];
    const lines = code.split('\n');
    
    // Define function patterns based on language
    let functionPattern;
    
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        functionPattern = /function\s+(\w+)\s*\(|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|(?:async\s*)?\s*(\w+)\s*\([^)]*\)\s*{/g;
        break;
      case 'python':
        functionPattern = /def\s+(\w+)\s*\(/g;
        break;
      case 'java':
      case 'csharp':
        functionPattern = /(?:public|private|protected|static|\s)\s+(?:[\w<>\[\]]+\s+)?(\w+)\s*\([^)]*\)\s*(?:throws\s+[\w\s,]+)?\s*\{/g;
        break;
      default:
        functionPattern = /function\s+(\w+)\s*\(|def\s+(\w+)\s*\(/g;
    }
    
    // Simple function extraction (not perfect but gives an estimate)
    let match;
    let inFunction = false;
    let currentFunction = null;
    let bracketCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!inFunction) {
        functionPattern.lastIndex = 0;
        match = functionPattern.exec(line);
        
        if (match) {
          inFunction = true;
          currentFunction = {
            name: match[1] || match[2] || match[3] || 'anonymous',
            startLine: i,
            lines: 1
          };
          
          bracketCount = (line.match(/{/g) || []).length - (line.match(/}/g) || []).length;
        }
      } else {
        currentFunction.lines++;
        
        // Count brackets to determine function end
        bracketCount += (line.match(/{/g) || []).length;
        bracketCount -= (line.match(/}/g) || []).length;
        
        if (bracketCount <= 0) {
          inFunction = false;
          functions.push(currentFunction);
          currentFunction = null;
        }
      }
    }
    
    return functions;
  }

  /**
   * Calculate maximum nesting level in code
   * @param {string} code - The submitted code
   * @param {string} language - Programming language
   * @returns {number} Maximum nesting level
   */
  calculateMaxNestingLevel(code, language) {
    const lines = code.split('\n');
    let maxLevel = 0;
    let currentLevel = 0;
    
    // Simple bracket counting (works for C-like languages)
    if (['javascript', 'typescript', 'java', 'c', 'cpp', 'csharp'].includes(language.toLowerCase())) {
      for (const line of lines) {
        currentLevel += (line.match(/{/g) || []).length;
        currentLevel -= (line.match(/}/g) || []).length;
        maxLevel = Math.max(maxLevel, currentLevel);
      }
    } else if (language.toLowerCase() === 'python') {
      // For Python, count indentation
      let previousIndent = 0;
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        const indent = line.search(/\S/);
        if (indent > previousIndent) {
          currentLevel += Math.floor((indent - previousIndent) / 4); // Assuming 4 spaces per indent level
        } else if (indent < previousIndent) {
          currentLevel -= Math.floor((previousIndent - indent) / 4);
        }
        
        previousIndent = indent;
        maxLevel = Math.max(maxLevel, currentLevel);
      }
    }
    
    return maxLevel;
  }

  /**
   * Detect duplicated code segments
   * @param {string} code - The submitted code
   * @returns {Array} Duplicated code segments
   */
  detectDuplicatedCode(code) {
    const lines = code.split('\n');
    const duplicates = [];
    const lineWindowSize = 5; // Minimum number of lines to consider as duplication
    
    // Simple line-based duplication detection
    for (let i = 0; i <= lines.length - lineWindowSize; i++) {
      const segment = lines.slice(i, i + lineWindowSize).join('\n');
      
      // Skip empty segments
      if (segment.trim().length === 0) continue;
      
      // Look for duplicates
      for (let j = i + lineWindowSize; j <= lines.length - lineWindowSize; j++) {
        const compareSegment = lines.slice(j, j + lineWindowSize).join('\n');
        
        if (segment === compareSegment) {
          duplicates.push({
            segment,
            locations: [i, j]
          });
          break;
        }
      }
    }
    
    return duplicates;
  }

  /**
   * Evaluate functional correctness of code
   * @param {string} code - The submitted code
   * @param {Object} challenge - The coding challenge details
   * @param {string} language - Programming language
   * @returns {Object} Functional evaluation results
   */
  async evaluateFunctionalCorrectness(code, challenge, language) {
    try {
      // Create a prompt for the AI model to evaluate functional correctness
      const prompt = `Evaluate the functional correctness of the following ${language} code for this challenge:

Challenge: ${challenge.title}
Description: ${challenge.description}
Expected Output: ${challenge.expectedOutput}

Code:
${code}

Provide a detailed analysis of whether the code correctly solves the challenge. Include:
1. Does it handle the core requirements?
2. Does it handle edge cases?
3. Are there any logical errors?
4. What percentage of test cases would this likely pass (0-100)?

Format your response as JSON with these fields: correctness (0-100), handlesEdgeCases (boolean), logicalErrors (array of strings), testCasesPassed (number)`;
      
      // Get evaluation from OpenAI
      const aiResponse = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.2
      });

      // Parse the AI response
      const content = aiResponse.choices[0].message.content.trim();
      let evaluationData;
      
      try {
        // Try to parse as JSON
        evaluationData = JSON.parse(content);
      } catch (e) {
        // Fallback to regex extraction if JSON parsing fails
        evaluationData = {
          correctness: this.extractNumberFromText(content, 'correctness', 50),
          handlesEdgeCases: content.toLowerCase().includes('handles edge cases: true'),
          logicalErrors: this.extractLogicalErrors(content),
          testCasesPassed: this.extractNumberFromText(content, 'test cases', 50)
        };
      }
      
      return evaluationData;
    } catch (error) {
      console.error('Error evaluating functional correctness:', error);
      // Provide fallback values if AI analysis fails
      return {