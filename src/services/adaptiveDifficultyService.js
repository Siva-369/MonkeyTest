/**
 * Adaptive Difficulty Service
 * Provides advanced algorithms for dynamically adjusting question difficulty
 * based on candidate performance and response patterns.
 */

class AdaptiveDifficultyService {
  /**
   * Calculate the next question difficulty based on candidate performance
   * @param {Array} previousResponses - Array of previous candidate responses
   * @param {Object} candidateProfile - Candidate profile information
   * @param {String} currentDifficulty - Current difficulty level
   * @param {Number} performanceScore - Current performance score (0-1)
   * @returns {String} Next difficulty level
   */
  calculateNextDifficulty(previousResponses, candidateProfile, currentDifficulty, performanceScore) {
    // Define difficulty levels and their numerical values
    const difficultyLevels = {
      'entry': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    };
    
    // Convert current difficulty to numerical value
    const currentDifficultyValue = difficultyLevels[currentDifficulty] || 2;
    
    // Calculate base adjustment based on performance score
    let adjustment = 0;
    
    // More granular difficulty adjustment based on performance thresholds
    if (performanceScore >= 0.9) {
      adjustment = 1; // Significant increase for excellent performance
    } else if (performanceScore >= 0.75) {
      adjustment = 0.5; // Moderate increase for good performance
    } else if (performanceScore >= 0.6) {
      adjustment = 0.25; // Slight increase for above average performance
    } else if (performanceScore <= 0.3) {
      adjustment = -1; // Significant decrease for poor performance
    } else if (performanceScore <= 0.45) {
      adjustment = -0.5; // Moderate decrease for below average performance
    }
    
    // Apply additional adjustments based on response patterns
    if (previousResponses && previousResponses.length > 0) {
      adjustment += this.analyzeResponsePatterns(previousResponses);
    }
    
    // Apply adjustments based on candidate profile if available
    if (candidateProfile) {
      adjustment += this.adjustForCandidateProfile(candidateProfile, currentDifficulty);
    }
    
    // Calculate new difficulty value
    let newDifficultyValue = currentDifficultyValue + adjustment;
    
    // Ensure the new difficulty stays within bounds
    newDifficultyValue = Math.max(1, Math.min(4, newDifficultyValue));
    
    // Convert numerical value back to difficulty level
    const difficultyKeys = Object.keys(difficultyLevels);
    return difficultyKeys.find(key => difficultyLevels[key] === Math.round(newDifficultyValue)) || currentDifficulty;
  }
  
  /**
   * Analyze response patterns to make additional difficulty adjustments
   * @param {Array} previousResponses - Array of previous responses
   * @returns {Number} Additional adjustment value
   */
  analyzeResponsePatterns(previousResponses) {
    let adjustment = 0;
    
    // Check response time trends
    const responseTimes = previousResponses
      .filter(response => response.timeSpent)
      .map(response => response.timeSpent);
    
    if (responseTimes.length >= 3) {
      // Calculate if response times are decreasing (faster responses)
      const isGettingFaster = responseTimes.slice(-3).every((time, index, array) => 
        index === 0 || time < array[index - 1]
      );
      
      // If consistently getting faster, slightly increase difficulty
      if (isGettingFaster) {
        adjustment += 0.2;
      }
    }
    
    // Check for consistent correct answers
    const recentCorrectness = previousResponses
      .slice(-5)
      .filter(response => response.isCorrect !== undefined)
      .map(response => response.isCorrect);
    
    if (recentCorrectness.length >= 3) {
      // Calculate percentage of correct answers
      const correctPercentage = recentCorrectness.filter(Boolean).length / recentCorrectness.length;
      
      // Adjust based on correctness percentage
      if (correctPercentage >= 0.8) {
        adjustment += 0.3;
      } else if (correctPercentage <= 0.3) {
        adjustment -= 0.3;
      }
    }
    
    return adjustment;
  }
  
  /**
   * Make adjustments based on candidate profile
   * @param {Object} candidateProfile - Candidate profile information
   * @param {String} currentDifficulty - Current difficulty level
   * @returns {Number} Additional adjustment value
   */
  adjustForCandidateProfile(candidateProfile, currentDifficulty) {
    let adjustment = 0;
    
    // Adjust based on experience level
    if (candidateProfile.experience) {
      if (candidateProfile.experience >= 5 && currentDifficulty === 'entry') {
        adjustment += 0.5; // Experienced candidates should get harder questions
      } else if (candidateProfile.experience <= 1 && currentDifficulty === 'advanced') {
        adjustment -= 0.5; // Junior candidates should get easier questions if struggling
      }
    }
    
    // Adjust based on education level
    if (candidateProfile.education && candidateProfile.education.length > 0) {
      const highestEducation = candidateProfile.education.sort((a, b) => 
        (b.graduationYear || 0) - (a.graduationYear || 0)
      )[0];
      
      if (highestEducation.degree && highestEducation.degree.toLowerCase().includes('phd')) {
        adjustment += 0.2; // PhD candidates might handle more difficult questions
      }
    }
    
    // Adjust based on previous assessment performance if available
    if (candidateProfile.overallPerformance && candidateProfile.overallPerformance.averageScore) {
      const averageScore = candidateProfile.overallPerformance.averageScore;
      
      if (averageScore >= 85) {
        adjustment += 0.3;
      } else if (averageScore <= 50) {
        adjustment -= 0.3;
      }
    }
    
    return adjustment;
  }
}

module.exports = new AdaptiveDifficultyService();