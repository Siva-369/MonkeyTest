/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Analytics Dashboard JavaScript
 * Provides advanced analytics and visualization for the AI Hiring Assessment Platform
 * Integrates with the visualization service to display candidate performance metrics
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize analytics dashboard
    initAnalyticsDashboard();
    
    // Setup event listeners for filters
    setupFilterListeners();
    
    // Load initial data
    loadAnalyticsData();
});

/**
 * Initialize the analytics dashboard components
 */
function initAnalyticsDashboard() {
    // Create navigation if not already present
    if (!document.querySelector('.navbar')) {
        initNavigation();
    }
    
    // Initialize date range picker
    initDateRangePicker();
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Initialize the analytics dashboard components
 */
function initAnalyticsDashboard() {
    // Create navigation if not already present
    if (!document.querySelector('.navbar')) {
        initNavigation();
    }
    
    // Initialize date range picker
    initDateRangePicker();
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Initialize date range picker for filtering analytics data
 */
function initDateRangePicker() {
    const dateRangeFilter = document.getElementById('date-range-filter');
    
    if (dateRangeFilter) {
        dateRangeFilter.addEventListener('change', function() {
            if (this.value === 'custom') {
                // Show custom date picker
                const filterGroup = this.closest('.filter-group');
                
                // Create date picker container if it doesn't exist
                if (!document.getElementById('custom-date-container')) {
                    const datePickerHTML = `
                        <div id="custom-date-container" class="custom-date-container">
                            <div class="date-input-group">
                                <label for="start-date">Start Date:</label>
                                <input type="date" id="start-date" class="date-input">
                            </div>
                            <div class="date-input-group">
                                <label for="end-date">End Date:</label>
                                <input type="date" id="end-date" class="date-input">
                            </div>
                        </div>
                    `;
                    
                    filterGroup.insertAdjacentHTML('afterend', datePickerHTML);
                    
                    // Set default dates (last 30 days)
                    const endDate = new Date();
                    const startDate = new Date();
                    startDate.setDate(startDate.getDate() - 30);
                    
                    document.getElementById('start-date').valueAsDate = startDate;
                    document.getElementById('end-date').valueAsDate = endDate;
                    
                    // Add event listeners to date inputs
                    document.getElementById('start-date').addEventListener('change', updateCharts);
                    document.getElementById('end-date').addEventListener('change', updateCharts);
                } else {
                    document.getElementById('custom-date-container').style.display = 'flex';
                }
            } else {
                // Hide custom date picker if it exists
                const customDateContainer = document.getElementById('custom-date-container');
                if (customDateContainer) {
                    customDateContainer.style.display = 'none';
                }
                
                // Update charts based on selected preset date range
                updateCharts();
            }
        });
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Setup event listeners for dashboard filters
 */
function setupFilterListeners() {
    // Assessment type filter
    const assessmentTypeFilter = document.getElementById('assessment-type-filter');
    if (assessmentTypeFilter) {
        assessmentTypeFilter.addEventListener('change', updateCharts);
    }
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', updateCharts);
    }
    
    // Role filter if it exists
    const roleFilter = document.getElementById('role-filter');
    if (roleFilter) {
        roleFilter.addEventListener('change', updateCharts);
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Load analytics data from the API
 */
async function loadAnalyticsData() {
    try {
        showLoadingIndicator();
        
        // Fetch assessment data
        const assessmentsResponse = await fetch('/api/v1/assessments');
        const assessmentsData = await assessmentsResponse.json();
        
        // Fetch candidates data
        const candidatesResponse = await fetch('/api/v1/candidates');
        const candidatesData = await candidatesResponse.json();
        
        // Process and display data
        processAnalyticsData(assessmentsData.data, candidatesData.data);
        
        hideLoadingIndicator();
    } catch (error) {
        console.error('Error loading analytics data:', error);
        displayErrorMessage('Failed to load analytics data. Please try again later.');
        hideLoadingIndicator();
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Process analytics data and update dashboard
 * @param {Array} assessments - Assessment data from API
 * @param {Array} candidates - Candidate data from API
 */
function processAnalyticsData(assessments, candidates) {
    // Calculate summary metrics
    updateSummaryMetrics(assessments, candidates);
    
    // Generate and update charts
    updateAssessmentTypeChart(assessments);
    updateSkillDistributionChart(candidates);
    updatePerformanceTrendChart(candidates);
    updateCommunicationAnalysisChart(candidates);
    
    // Generate AI insights
    generateInsights(assessments, candidates);
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Update summary metrics cards with latest data
 */
function updateSummaryMetrics(assessments, candidates) {
    // Calculate total candidates
    const totalCandidates = candidates.length;
    document.querySelector('.summary-card:nth-child(1) .summary-value').textContent = totalCandidates;
    
    // Calculate active assessments
    const activeAssessments = assessments.filter(a => a.status === 'active').length;
    document.querySelector('.summary-card:nth-child(2) .summary-value').textContent = activeAssessments;
    
    // Calculate completed assessments
    const completedAssessments = candidates.reduce((total, candidate) => {
        return total + (candidate.overallPerformance?.completedAssessments || 0);
    }, 0);
    document.querySelector('.summary-card:nth-child(3) .summary-value').textContent = completedAssessments;
    
    // Calculate average score
    const averageScore = candidates.reduce((total, candidate) => {
        return total + (candidate.overallPerformance?.averageScore || 0);
    }, 0) / (candidates.length || 1);
    
    document.querySelector('.summary-card:nth-child(4) .summary-value').textContent = 
        `${averageScore.toFixed(1)}%`;
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Update assessment type chart with filtered data
 */
function updateAssessmentTypeChart(assessments) {
    const filteredAssessments = filterAssessmentsByDateRange(assessments);
    
    // Group assessments by type and calculate average scores
    const assessmentTypes = {};
    filteredAssessments.forEach(assessment => {
        if (!assessmentTypes[assessment.type]) {
            assessmentTypes[assessment.type] = {
                count: 0,
                totalScore: 0
            };
        }
        assessmentTypes[assessment.type].count++;
        
        // Add total score if available
        if (assessment.passingScore) {
            assessmentTypes[assessment.type].totalScore += assessment.passingScore;
        }
    });
    
    // Calculate average scores
    const labels = [];
    const data = [];
    
    for (const type in assessmentTypes) {
        labels.push(type.charAt(0).toUpperCase() + type.slice(1)); // Capitalize first letter
        const avgScore = assessmentTypes[type].count > 0 ? 
            assessmentTypes[type].totalScore / assessmentTypes[type].count : 0;
        data.push(avgScore);
    }
    
    // Update chart
    const assessmentTypeChart = Chart.getChart('assessment-type-chart');
    if (assessmentTypeChart) {
        assessmentTypeChart.data.labels = labels;
        assessmentTypeChart.data.datasets[0].data = data;
        assessmentTypeChart.update();
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Update skill distribution chart with filtered data
 */
function updateSkillDistributionChart(candidates) {
    const filteredCandidates = filterCandidatesByDateRange(candidates);
    
    // Extract skills from candidates
    const skillsMap = {};
    filteredCandidates.forEach(candidate => {
        if (candidate.skills && candidate.skills.length > 0) {
            candidate.skills.forEach(skill => {
                if (!skillsMap[skill]) {
                    skillsMap[skill] = 0;
                }
                skillsMap[skill]++;
            });
        }
    });
    
    // Sort skills by frequency and get top skills
    const sortedSkills = Object.entries(skillsMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Get top 6 skills
    
    const labels = sortedSkills.map(skill => skill[0]);
    const data = sortedSkills.map(skill => skill[1]);
    
    // Update chart
    const skillDistributionChart = Chart.getChart('skill-distribution-chart');
    if (skillDistributionChart) {
        skillDistributionChart.data.labels = labels;
        skillDistributionChart.data.datasets[0].data = data;
        skillDistributionChart.update();
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Update performance trend chart with filtered data
 */
function updatePerformanceTrendChart(candidates) {
    const filteredCandidates = filterCandidatesByDateRange(candidates);
    
    // Group submissions by month
    const monthlyData = {};
    
    filteredCandidates.forEach(candidate => {
        if (candidate.assessmentSubmissions && candidate.assessmentSubmissions.length > 0) {
            candidate.assessmentSubmissions.forEach(submission => {
                if (submission.status === 'completed' && submission.endTime) {
                    const date = new Date(submission.endTime);
                    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
                    
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = {
                            technical: { total: 0, count: 0 },
                            behavioral: { total: 0, count: 0 },
                            communication: { total: 0, count: 0 }
                        };
                    }
                    
                    // Add scores based on evaluation results
                    if (submission.evaluationResults && submission.evaluationResults.length > 0) {
                        submission.evaluationResults.forEach(result => {
                            if (result.category === 'technical_expertise') {
                                monthlyData[monthYear].technical.total += result.score;
                                monthlyData[monthYear].technical.count++;
                            } else if (result.category === 'problem_solving' || result.category === 'critical_thinking') {
                                monthlyData[monthYear].behavioral.total += result.score;
                                monthlyData[monthYear].behavioral.count++;
                            } else if (result.category === 'communication') {
                                monthlyData[monthYear].communication.total += result.score;
                                monthlyData[monthYear].communication.count++;
                            }
                        });
                    }
                }
            });
        }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
        const [aMonth, aYear] = a.split('/').map(Number);
        const [bMonth, bYear] = b.split('/').map(Number);
        return aYear !== bYear ? aYear - bYear : aMonth - bMonth;
    });
    
    // Calculate average scores for each category by month
    const technicalData = [];
    const behavioralData = [];
    const communicationData = [];
    
    sortedMonths.forEach(month => {
        const monthData = monthlyData[month];
        
        const technicalAvg = monthData.technical.count > 0 ? 
            monthData.technical.total / monthData.technical.count : 0;
        technicalData.push(technicalAvg);
        
        const behavioralAvg = monthData.behavioral.count > 0 ? 
            monthData.behavioral.total / monthData.behavioral.count : 0;
        behavioralData.push(behavioralAvg);
        
        const communicationAvg = monthData.communication.count > 0 ? 
            monthData.communication.total / monthData.communication.count : 0;
        communicationData.push(communicationAvg);
    });
    
    // Update chart
    const performanceTrendChart = Chart.getChart('performance-trend-chart');
    if (performanceTrendChart) {
        performanceTrendChart.data.labels = sortedMonths;
        performanceTrendChart.data.datasets[0].data = technicalData;
        performanceTrendChart.data.datasets[1].data = behavioralData;
        performanceTrendChart.data.datasets[2].data = communicationData;
        performanceTrendChart.update();
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Update communication analysis chart with filtered data
 */
function updateCommunicationAnalysisChart(candidates) {
    const filteredCandidates = filterCandidatesByDateRange(candidates);
    
    // Aggregate communication metrics
    const communicationMetrics = {
        clarity: 0,
        coherence: 0,
        complexity: 0,
        professionalism: 0,
        sentiment: 0
    };
    
    let totalSubmissions = 0;
    
    filteredCandidates.forEach(candidate => {
        if (candidate.assessmentSubmissions && candidate.assessmentSubmissions.length > 0) {
            candidate.assessmentSubmissions.forEach(submission => {
                if (submission.status === 'completed' && submission.evaluationResults) {
                    submission.evaluationResults.forEach(result => {
                        if (result.category === 'communication') {
                            communicationMetrics.clarity += result.score;
                            totalSubmissions++;
                        }
                    });
                }
            });
        }
    });
    
    // Calculate averages
    const data = [
        totalSubmissions > 0 ? communicationMetrics.clarity / totalSubmissions : 0,
        totalSubmissions > 0 ? communicationMetrics.coherence / totalSubmissions : 0,
        totalSubmissions > 0 ? communicationMetrics.complexity / totalSubmissions : 0,
        totalSubmissions > 0 ? communicationMetrics.professionalism / totalSubmissions : 0,
        totalSubmissions > 0 ? communicationMetrics.sentiment / totalSubmissions : 0
    ];
    
    // Update chart
    const communicationAnalysisChart = Chart.getChart('communication-analysis-chart');
    if (communicationAnalysisChart) {
        communicationAnalysisChart.data.datasets[0].data = data;
        communicationAnalysisChart.update();
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Generate AI insights based on assessment and candidate data
 * @param {Array} assessments - Assessment data
 * @param {Array} candidates - Candidate data
 */
function generateInsights(assessments, candidates) {
    // Technical skills analysis
    generateTechnicalSkillsInsight(candidates);
    
    // Communication pattern analysis
    generateCommunicationInsight(candidates);
    
    // Behavioral insights
    generateBehavioralInsight(candidates);
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Generate technical skills insight
 */
function generateTechnicalSkillsInsight(candidates) {
    // Calculate technical skills performance
    const technicalSkills = {};
    let totalCandidates = 0;
    
    candidates.forEach(candidate => {
        if (candidate.assessmentSubmissions && candidate.assessmentSubmissions.length > 0) {
            candidate.assessmentSubmissions.forEach(submission => {
                if (submission.status === 'completed' && submission.evaluationResults) {
                    submission.evaluationResults.forEach(result => {
                        if (result.category === 'technical_expertise' || 
                            result.category === 'system_design' || 
                            result.category === 'code_quality') {
                            
                            const skillName = result.category.replace('_', ' ');
                            if (!technicalSkills[skillName]) {
                                technicalSkills[skillName] = {
                                    total: 0,
                                    count: 0
                                };
                            }
                            
                            technicalSkills[skillName].total += result.score;
                            technicalSkills[skillName].count++;
                            totalCandidates++;
                        }
                    });
                }
            });
        }
    });
    
    // Calculate averages and sort by score
    const skillScores = [];
    for (const skill in technicalSkills) {
        if (technicalSkills[skill].count > 0) {
            skillScores.push({
                name: skill,
                score: Math.round(technicalSkills[skill].total / technicalSkills[skill].count)
            });
        }
    }
    
    // Sort by score (descending)
    skillScores.sort((a, b) => b.score - a.score);
    
    // Get top 3 strengths and bottom 2 weaknesses
    const strengths = skillScores.slice(0, 3);
    const weaknesses = skillScores.slice(-2).reverse();
    
    // Update the insight card
    const strengthsList = document.querySelector('.strength-list');
    if (strengthsList) {
        strengthsList.innerHTML = strengths.map(skill => 
            `<li><span class="strength-score">${skill.score}%</span> ${skill.name}</li>`
        ).join('');
    }
    
    const weaknessList = document.querySelector('.weakness-list');
    if (weaknessList) {
        weaknessList.innerHTML = weaknesses.map(skill => 
            `<li><span class="weakness-score">${skill.score}%</span> ${skill.name}</li>`
        ).join('');
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Generate communication pattern insight
 */
function generateCommunicationInsight(candidates) {
    // Calculate communication metrics
    const communicationMetrics = {
        clarity: { total: 0, count: 0 },
        coherence: { total: 0, count: 0 },
        complexity: { total: 0, count: 0 }
    };
    
    candidates.forEach(candidate => {
        if (candidate.assessmentSubmissions && candidate.assessmentSubmissions.length > 0) {
            candidate.assessmentSubmissions.forEach(submission => {
                if (submission.status === 'completed' && submission.evaluationResults) {
                    submission.evaluationResults.forEach(result => {
                        if (result.category === 'communication') {
                            communicationMetrics.clarity.total += result.score;
                            communicationMetrics.clarity.count++;
                            
                            // Simulate other metrics based on the communication score
                            communicationMetrics.coherence.total += result.score * 0.85;
                            communicationMetrics.coherence.count++;
                            
                            communicationMetrics.complexity.total += result.score * 0.8;
                            communicationMetrics.complexity.count++;
                        }
                    });
                }
            });
        }
    });
    
    // Calculate averages
    const clarityScore = communicationMetrics.clarity.count > 0 ? 
        Math.round(communicationMetrics.clarity.total / communicationMetrics.clarity.count) : 0;
        
    const coherenceScore = communicationMetrics.coherence.count > 0 ? 
        Math.round(communicationMetrics.coherence.total / communicationMetrics.coherence.count) : 0;
        
    const complexityScore = communicationMetrics.complexity.count > 0 ? 
        Math.round(communicationMetrics.complexity.total / communicationMetrics.complexity.count) : 0;
    
    // Update the insight card
    const communicationMetricsList = document.querySelector('.communication-metrics');
    if (communicationMetricsList) {
        communicationMetricsList.innerHTML = `
            <li><span class="metric-label">Clarity:</span> <span class="metric-value ${getRatingClass(clarityScore)}">High (${clarityScore}%)</span></li>
            <li><span class="metric-label">Coherence:</span> <span class="metric-value ${getRatingClass(coherenceScore)}">Medium (${coherenceScore}%)</span></li>
            <li><span class="metric-label">Complexity:</span> <span class="metric-value ${getRatingClass(complexityScore)}">Medium (${complexityScore}%)</span></li>
        `;
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Generate behavioral insight
 */
function generateBehavioralInsight(candidates) {
    // Calculate behavioral metrics
    const behavioralMetrics = {
        decisionMaking: { total: 0, count: 0 },
        teamCollaboration: { total: 0, count: 0 },
        stressResponse: { total: 0, count: 0 }
    };
    
    candidates.forEach(candidate => {
        if (candidate.assessmentSubmissions && candidate.assessmentSubmissions.length > 0) {
            candidate.assessmentSubmissions.forEach(submission => {
                if (submission.status === 'completed' && submission.evaluationResults) {
                    submission.evaluationResults.forEach(result => {
                        if (result.category === 'problem_solving') {
                            behavioralMetrics.decisionMaking.total += result.score;
                            behavioralMetrics.decisionMaking.count++;
                        } else if (result.category === 'leadership_skills') {
                            behavioralMetrics.teamCollaboration.total += result.score;
                            behavioralMetrics.teamCollaboration.count++;
                        } else if (result.category === 'critical_thinking') {
                            behavioralMetrics.stressResponse.total += result.score;
                            behavioralMetrics.stressResponse.count++;
                        }
                    });
                }
            });
        }
    });
    
    // Calculate averages
    const decisionMakingScore = behavioralMetrics.decisionMaking.count > 0 ? 
        Math.round(behavioralMetrics.decisionMaking.total / behavioralMetrics.decisionMaking.count) : 0;
        
    const teamCollaborationScore = behavioralMetrics.teamCollaboration.count > 0 ? 
        Math.round(behavioralMetrics.teamCollaboration.total / behavioralMetrics.teamCollaboration.count) : 0;
        
    const stressResponseScore = behavioralMetrics.stressResponse.count > 0 ? 
        Math.round(behavioralMetrics.stressResponse.total / behavioralMetrics.stressResponse.count) : 0;
    
    // Update the insight card
    const behavioralMetricsContainer = document.querySelector('.behavioral-metrics');
    if (behavioralMetricsContainer) {
        const decisionMakingProgress = document.querySelector('.metric-item:nth-child(1) .progress');
        const teamCollaborationProgress = document.querySelector('.metric-item:nth-child(2) .progress');
        const stressResponseProgress = document.querySelector('.metric-item:nth-child(3) .progress');
        
        const decisionMakingValue = document.querySelector('.metric-item:nth-child(1) .metric-value');
        const teamCollaborationValue = document.querySelector('.metric-item:nth-child(2) .metric-value');
        const stressResponseValue = document.querySelector('.metric-item:nth-child(3) .metric-value');
        
        if (decisionMakingProgress && decisionMakingValue) {
            decisionMakingProgress.style.width = `${decisionMakingScore}%`;
            decisionMakingValue.textContent = `${decisionMakingScore}%`;
        }
        
        if (teamCollaborationProgress && teamCollaborationValue) {
            teamCollaborationProgress.style.width = `${teamCollaborationScore}%`;
            teamCollaborationValue.textContent = `${teamCollaborationScore}%`;
        }
        
        if (stressResponseProgress && stressResponseValue) {
            stressResponseProgress.style.width = `${stressResponseScore}%`;
            stressResponseValue.textContent = `${stressResponseScore}%`;
        }
        
        // Update recommendation based on behavioral metrics
        const recommendationContainer = behavioralMetricsContainer.closest('.insight-content').querySelector('.recommendation p');
        if (recommendationContainer) {
            let recommendation = '';
            
            // Generate recommendation based on scores
            const avgScore = (decisionMakingScore + teamCollaborationScore + stressResponseScore) / 3;
            
            if (avgScore >= 80) {
                recommendation = 'Candidate shows exceptional leadership potential. Consider fast-tracking for management roles that require strong decision-making and team collaboration skills.';
            } else if (avgScore >= 60) {
                recommendation = 'Candidate demonstrates good leadership qualities. Provide opportunities for growth in ';
                
                // Add specific areas for improvement
                if (decisionMakingScore < 70) {
                    recommendation += 'decision-making scenarios';
                } else if (teamCollaborationScore < 70) {
                    recommendation += 'collaborative team environments';
                } else if (stressResponseScore < 70) {
                    recommendation += 'high-pressure situations to improve stress response';
                } else {
                    recommendation += 'all leadership dimensions to reach excellence';
                }
                recommendation += '.';
            } else {
                recommendation = 'Candidate may benefit from leadership development training. Focus on ';
                
                // Identify the weakest area
                const lowestScore = Math.min(decisionMakingScore, teamCollaborationScore, stressResponseScore);
                
                if (lowestScore === decisionMakingScore) {
                    recommendation += 'improving decision-making skills through structured problem-solving exercises';
                } else if (lowestScore === teamCollaborationScore) {
                    recommendation += 'enhancing team collaboration through group projects and communication workshops';
                } else {
                    recommendation += 'developing stress management techniques and resilience training';
                }
                recommendation += '.';
            }
            
            recommendationContainer.textContent = recommendation;
        }
    }
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Filter assessments by date range
 */
function filterAssessmentsByDateRange(assessments) {
    const dateRangeFilter = document.getElementById('date-range-filter');
    if (!dateRangeFilter) return assessments;
    
    const dateRange = dateRangeFilter.value;
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
        case '7days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
        case '30days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);
            break;
        case '90days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 90);
            break;
        case 'custom':
            const customStartDate = document.getElementById('start-date');
            const customEndDate = document.getElementById('end-date');
            
            if (customStartDate && customEndDate && 
                customStartDate.value && customEndDate.value) {
                startDate = new Date(customStartDate.value);
                now.setHours(23, 59, 59, 999); // End of day
                now.setTime(new Date(customEndDate.value).getTime());
            } else {
                return assessments;
            }
            break;
        default:
            return assessments;
    }
    
    return assessments.filter(assessment => {
        const createdAt = new Date(assessment.createdAt);
        return createdAt >= startDate && createdAt <= now;
    });
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/**
 * Filter candidates by date range
 */
function filterCandidatesByDateRange(candidates) {
    const dateRangeFilter = document.getElementById('date-range-filter');
    if (!dateRangeFilter) return candidates;
    
    const dateRange = dateRangeFilter.value;
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
        case '7days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
        case '30days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);
            break;
        case '90days':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 90);
            break;
        case 'custom':
            const customStartDate = document.getElementById('start-date');
            const customEndDate = document.getElementById('end-date');
            
            if (customStartDate && customEndDate && 
                customStartDate.value && customEndDate.value) {
                startDate = new Date(customStartDate.value);
                now.setHours(23, 59, 59, 999); // End of day
                now.setTime(new Date(customEndDate.value).getTime());
            } else {
                return candidates;
            }
            break;
        default:
            return candidates;
    }
    
    return candidates.filter(candidate => {
        if (candidate.overallPerformance && candidate.overallPerformance.lastAssessmentDate) {
            const lastAssessmentDate = new Date(candidate.overallPerformance.lastAssessmentDate);
            return lastAssessmentDate >= startDate && lastAssessmentDate <= now;
        }
        return false;
    });
}

/**
 * Get rating class based on score
 */
function getRatingClass(score) {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

/**
 * Update all charts based on current filters
 */
function updateCharts() {
    // Get assessment and candidate data
    fetch('/api/v1/assessments')
        .then(response => response.json())
        .then(assessmentsData => {
            fetch('/api/v1/candidates')
                .then(response => response.json())
                .then(candidatesData => {
                    // Update charts with filtered data
                    updateAssessmentTypeChart(assessmentsData.data);
                    updateSkillDistributionChart(candidatesData.data);
                    updatePerformanceTrendChart(candidatesData.data);
                    updateCommunicationAnalysisChart(candidatesData.data);
                    
                    // Update insights
                    generateInsights(assessmentsData.data, candidatesData.data);
                })
                .catch(error => {
                    console.error('Error fetching candidates data:', error);
                    displayErrorMessage('Failed to update charts. Please try again later.');
                });
        })
        .catch(error => {
            console.error('Error fetching assessments data:', error);
            displayErrorMessage('Failed to update charts. Please try again later.');
        });
}

/**
 * Show loading indicator
 */
function showLoadingIndicator() {
    // Create loading overlay if it doesn't exist
    if (!document.getElementById('loading-overlay')) {
        const loadingHTML = `
            <div id="loading-overlay" class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>Loading analytics data...</p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    } else {
        document.getElementById('loading-overlay').style.display = 'flex';
    }
}

/**
 * Hide loading indicator
 */
function hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

/**
 * Display error message
 */
function displayErrorMessage(message) {
    // Create error message container if it doesn't exist
    if (!document.getElementById('error-message')) {
        const errorHTML = `
            <div id="error-message" class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button class="close-error"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
        
        // Add event listener to close button
        document.querySelector('.close-error').addEventListener('click', function() {
            document.getElementById('error-message').style.display = 'none';
        });
        
        // Auto-hide after 5 seconds
        setTimeout(function() {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        }, 5000);
    } else {
        const errorMessage = document.getElementById('error-message');
        errorMessage.querySelector('span').textContent = message;
        errorMessage.style.display = 'flex';
    }
}

/** */
