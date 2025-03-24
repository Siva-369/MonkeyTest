/**
 * Visualization Service
 * Provides advanced data visualization capabilities for assessment results,
 * candidate comparisons, and performance metrics.
 */

class VisualizationService {
  /**
   * Generate visualization data for candidate performance radar chart
   * @param {Object} assessmentResults - Candidate's assessment results
   * @returns {Object} Radar chart data configuration
   */
  generatePerformanceRadarData(assessmentResults) {
    // Extract key performance metrics
    const metrics = {
      technicalSkills: this.calculateTechnicalScore(assessmentResults),
      problemSolving: this.extractCategoryScore(assessmentResults, 'problem_solving'),
      communication: this.extractCategoryScore(assessmentResults, 'communication'),
      leadership: this.extractCategoryScore(assessmentResults, 'leadership_skills'),
      criticalThinking: this.extractCategoryScore(assessmentResults, 'critical_thinking')
    };
    
    // Format data for radar chart
    return {
      labels: [
        'Technical Skills',
        'Problem Solving',
        'Communication',
        'Leadership',
        'Critical Thinking'
      ],
      datasets: [{
        label: 'Candidate Performance',
        data: [
          metrics.technicalSkills,
          metrics.problemSolving,
          metrics.communication,
          metrics.leadership,
          metrics.criticalThinking
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }]
    };
  }

  /**
   * Generate visualization data for comparing multiple candidates
   * @param {Array} candidatesResults - Array of candidate assessment results
   * @returns {Object} Comparison chart data configuration
   */
  generateCandidateComparisonData(candidatesResults) {
    if (!candidatesResults || candidatesResults.length === 0) {
      return null;
    }
    
    // Extract candidate names and overall scores
    const labels = candidatesResults.map(candidate => 
      `${candidate.firstName} ${candidate.lastName}`);
    
    const datasets = [];
    
    // Technical skills dataset
    datasets.push({
      label: 'Technical Skills',
      data: candidatesResults.map(candidate => this.calculateTechnicalScore(candidate.assessmentResults)),
      backgroundColor: 'rgba(54, 162, 235, 0.7)'
    });
    
    // Problem solving dataset
    datasets.push({
      label: 'Problem Solving',
      data: candidatesResults.map(candidate => 
        this.extractCategoryScore(candidate.assessmentResults, 'problem_solving')),
      backgroundColor: 'rgba(255, 99, 132, 0.7)'
    });
    
    // Communication dataset
    datasets.push({
      label: 'Communication',
      data: candidatesResults.map(candidate => 
        this.extractCategoryScore(candidate.assessmentResults, 'communication')),
      backgroundColor: 'rgba(255, 206, 86, 0.7)'
    });
    
    // Leadership dataset
    datasets.push({
      label: 'Leadership',
      data: candidatesResults.map(candidate => 
        this.extractCategoryScore(candidate.assessmentResults, 'leadership_skills')),
      backgroundColor: 'rgba(75, 192, 192, 0.7)'
    });
    
    return {
      labels,
      datasets
    };
  }

  /**
   * Generate visualization data for behavioral analysis
   * @param {Object} behavioralAnalysis - Behavioral analysis results
   * @returns {Object} Behavioral analysis chart data
   */
  generateBehavioralAnalysisData(behavioralAnalysis) {
    if (!behavioralAnalysis || !behavioralAnalysis.emotions) {
      return null;
    }
    
    // Extract emotion scores
    const emotions = behavioralAnalysis.emotions;
    
    return {
      labels: [
        'Confidence',
        'Enthusiasm',
        'Empathy',
        'Professionalism',
        'Anxiety',
        'Frustration'
      ],
      datasets: [{
        label: 'Emotional Profile',
        data: [
          emotions.confidence,
          emotions.enthusiasm,
          emotions.empathy,
          emotions.professionalism,
          emotions.anxiety,
          emotions.frustration
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ]
      }]
    };
  }

  /**
   * Generate visualization data for communication patterns
   * @param {Object} communicationAnalysis - Communication analysis results
   * @returns {Object} Communication patterns chart data
   */
  generateCommunicationPatternsData(communicationAnalysis) {
    if (!communicationAnalysis) {
      return null;
    }
    
    return {
      labels: [
        'Clarity',
        'Complexity',
        'Coherence',
        'Formality',
        'Assertiveness'
      ],
      datasets: [{
        label: 'Communication Patterns',
        data: [
          communicationAnalysis.clarity,
          communicationAnalysis.complexity,
          communicationAnalysis.coherence,
          communicationAnalysis.formality,
          communicationAnalysis.assertiveness
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        pointBackgroundColor: 'rgb(75, 192, 192)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(75, 192, 192)'
      }]
    };
  }

  /**
   * Generate visualization data for assessment progress over time
   * @param {Array} assessmentHistory - Candidate's assessment history
   * @returns {Object} Progress chart data configuration
   */
  generateProgressChartData(assessmentHistory) {
    if (!assessmentHistory || assessmentHistory.length === 0) {
      return null;
    }
    
    // Sort history by date
    const sortedHistory = [...assessmentHistory].sort((a, b) => 
      new Date(a.endTime) - new Date(b.endTime));
    
    // Extract dates and scores
    const labels = sortedHistory.map(assessment => 
      new Date(assessment.endTime).toLocaleDateString());
    
    const scores = sortedHistory.map(assessment => assessment.totalScore);
    
    return {
      labels,
      datasets: [{
        label: 'Assessment Performance',
        data: scores,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
  }

  /**
   * Calculate technical score from assessment results
   * @private
   */
  calculateTechnicalScore(assessmentResults) {
    if (!assessmentResults || !assessmentResults.evaluationResults) {
      return 0;
    }
    
    const technicalEvaluation = assessmentResults.evaluationResults.find(
      result => result.category === 'technical_expertise'
    );
    
    return technicalEvaluation ? technicalEvaluation.score : 0;
  }

  /**
   * Extract category score from assessment results
   * @private
   */
  extractCategoryScore(assessmentResults, category) {
    if (!assessmentResults || !assessmentResults.evaluationResults) {
      return 0;
    }
    
    const evaluation = assessmentResults.evaluationResults.find(
      result => result.category === category
    );
    
    return evaluation ? evaluation.score : 0;
  }
}

module.exports = new VisualizationService();