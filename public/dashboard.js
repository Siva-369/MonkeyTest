// Dashboard JavaScript for AI Hiring Assessment Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initNavigation();
    
    // Initialize charts
    initCharts();
    
    // Setup event listeners
    setupEventListeners();
});

/**
 * Initialize the navigation bar
 */
function initNavigation() {
    // Get the header element
    const header = document.querySelector('header');
    
    // Create navigation HTML
    const navHTML = `
      <nav class="navbar">
        <a href="/" class="navbar-brand"><i class="fas fa-brain"></i>AI Hiring Assessment</a>
        <ul class="navbar-nav">
          <li class="nav-item"><a href="/" class="nav-link" data-page="home"><i class="fas fa-home"></i>Home</a></li>
          <li class="nav-item"><a href="/dashboard.html" class="nav-link active" data-page="dashboard"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
          <li class="nav-item">
            <a href="/assessments" class="nav-link" data-page="assessments"><i class="fas fa-tasks"></i>Assessments<i class="fas fa-chevron-down dropdown-icon"></i></a>
            <div class="dropdown-menu">
              <a href="/assessments/technical" class="dropdown-item"><i class="fas fa-code"></i>Technical</a>
              <a href="/assessments/leadership" class="dropdown-item"><i class="fas fa-users"></i>Leadership</a>
              <a href="/assessments/problem-solving" class="dropdown-item"><i class="fas fa-puzzle-piece"></i>Problem Solving</a>
              <a href="/assessments/create" class="dropdown-item"><i class="fas fa-plus"></i>Create New</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="/candidates" class="nav-link" data-page="candidates"><i class="fas fa-user-tie"></i>Candidates<i class="fas fa-chevron-down dropdown-icon"></i></a>
            <div class="dropdown-menu">
              <a href="/candidates/active" class="dropdown-item"><i class="fas fa-user-clock"></i>Active Candidates</a>
              <a href="/candidates/completed" class="dropdown-item"><i class="fas fa-user-check"></i>Completed Assessments</a>
              <a href="/candidates/top" class="dropdown-item"><i class="fas fa-trophy"></i>Top Performers</a>
              <a href="/candidates/invite" class="dropdown-item"><i class="fas fa-user-plus"></i>Invite Candidate</a>
            </div>
          </li>
          <li class="nav-item">
            <a href="/analytics" class="nav-link" data-page="analytics"><i class="fas fa-chart-bar"></i>Analytics</a>
          </li>
          <li class="nav-item">
            <a href="/profile" class="nav-link" data-page="profile"><i class="fas fa-user-circle"></i>Profile<i class="fas fa-chevron-down dropdown-icon"></i></a>
            <div class="dropdown-menu">
              <a href="/profile/settings" class="dropdown-item"><i class="fas fa-cog"></i>Settings</a>
              <a href="/profile/security" class="dropdown-item"><i class="fas fa-shield-alt"></i>Security</a>
              <a href="/profile/notifications" class="dropdown-item"><i class="fas fa-bell"></i>Notifications</a>
              <a href="/logout" class="dropdown-item"><i class="fas fa-sign-out-alt"></i>Logout</a>
            </div>
          </li>
        </ul>
      </nav>
    `;
    
    // Replace header content with navigation
    header.innerHTML = navHTML;
    
    // Add mobile navigation toggle for responsive design
    addMobileNavToggle();
}

/**
 * Add mobile navigation toggle button for responsive design
 */
function addMobileNavToggle() {
    const navbar = document.querySelector('.navbar');
    const navList = document.querySelector('.navbar-nav');
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.style.display = 'none';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.border = 'none';
    toggleBtn.style.color = 'white';
    toggleBtn.style.fontSize = '1.5rem';
    toggleBtn.style.cursor = 'pointer';
    
    // Add toggle functionality
    toggleBtn.addEventListener('click', function() {
        navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Add toggle button to navbar
    navbar.insertBefore(toggleBtn, navList);
    
    // Add media query for mobile view
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    
    function handleMobileView(e) {
        if (e.matches) {
            toggleBtn.style.display = 'block';
            navList.style.display = 'none';
            
            // Handle dropdown menus in mobile view
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const link = item.querySelector('.nav-link');
                const dropdown = item.querySelector('.dropdown-menu');
                
                if (dropdown) {
                    // Create a mobile-friendly dropdown toggle
                    link.addEventListener('click', function(e) {
                        if (dropdown) {
                            e.preventDefault();
                            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                            dropdown.style.position = 'static';
                            dropdown.style.width = '100%';
                            dropdown.style.opacity = '1';
                            dropdown.style.visibility = 'visible';
                            dropdown.style.transform = 'none';
                            dropdown.style.boxShadow = 'none';
                            dropdown.style.borderTop = '1px solid rgba(255,255,255,0.1)';
                        }
                    });
                }
            });
        } else {
            toggleBtn.style.display = 'none';
            navList.style.display = 'flex';
            
            // Reset dropdown styles for desktop view
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = '';
                dropdown.style.position = '';
                dropdown.style.width = '';
                dropdown.style.opacity = '';
                dropdown.style.visibility = '';
                dropdown.style.transform = '';
                dropdown.style.boxShadow = '';
                dropdown.style.borderTop = '';
            });
        }
    }
    
    // Initial check
    handleMobileView(mediaQuery);
    
    // Add listener for screen size changes
    mediaQuery.addEventListener('change', handleMobileView);
}

/**
 * Initialize all charts on the dashboard
 */
function initCharts() {
    // Assessment Type Chart
    const assessmentTypeCtx = document.getElementById('assessment-type-chart').getContext('2d');
    const assessmentTypeChart = new Chart(assessmentTypeCtx, {
        type: 'bar',
        data: {
            labels: ['Technical', 'Behavioral', 'Communication', 'Problem Solving'],
            datasets: [{
                label: 'Average Score',
                data: [78, 82, 75, 68],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(241, 196, 15, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                }
            }
        }
    });
    
    // Skill Distribution Chart
    const skillDistributionCtx = document.getElementById('skill-distribution-chart').getContext('2d');
    const skillDistributionChart = new Chart(skillDistributionCtx, {
        type: 'radar',
        data: {
            labels: ['System Design', 'Problem Solving', 'Code Quality', 'Debugging', 'Security', 'Testing'],
            datasets: [{
                label: 'Technical Skills',
                data: [87, 82, 79, 58, 62, 75],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
    
    // Performance Trend Chart
    const performanceTrendCtx = document.getElementById('performance-trend-chart').getContext('2d');
    const performanceTrendChart = new Chart(performanceTrendCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Technical',
                data: [65, 68, 72, 75, 79, 82],
                borderColor: 'rgba(52, 152, 219, 1)',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Behavioral',
                data: [70, 75, 78, 76, 80, 85],
                borderColor: 'rgba(155, 89, 182, 1)',
                backgroundColor: 'rgba(155, 89, 182, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Communication',
                data: [60, 65, 70, 72, 75, 78],
                borderColor: 'rgba(46, 204, 113, 1)',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Average Score'
                    }
                }
            }
        }
    });
    
    // Communication Analysis Chart
    const communicationAnalysisCtx = document.getElementById('communication-analysis-chart').getContext('2d');
    const communicationAnalysisChart = new Chart(communicationAnalysisCtx, {
        type: 'polarArea',
        data: {
            labels: ['Clarity', 'Coherence', 'Complexity', 'Professionalism', 'Sentiment'],
            datasets: [{
                data: [84, 72, 68, 80, 76],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(155, 89, 182, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(230, 126, 34, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(230, 126, 34, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

/**
 * Refresh dashboard data based on selected filters
 * @param {string} assessmentType - The selected assessment type filter
 * @param {string} dateRange - The selected date range filter
 */
function refreshDashboardData(assessmentType, dateRange) {
    console.log(`Refreshing dashboard with filters: ${assessmentType}, ${dateRange}`);
    
    // In a real application, this would make an API call to fetch filtered data
    // For demo purposes, we'll simulate data updates with random variations
    
    // Update Assessment Type Chart
    const assessmentTypeChart = Chart.getChart('assessment-type-chart');
    if (assessmentTypeChart) {
        // Simulate data changes based on filters
        let newData = [78, 82, 75, 68]; // Default data
        
        if (assessmentType !== 'all') {
            // Simulate filtered data
            newData = newData.map(score => {
                // Add some random variation to simulate filter effect
                return Math.min(100, Math.max(50, score + (Math.random() * 10 - 5)));
            });
        }
        
        if (dateRange !== '7days') {
            // Simulate date range effect
            const multiplier = dateRange === '30days' ? 1.05 : 1.1;
            newData = newData.map(score => Math.min(100, score * multiplier));
        }
        
        assessmentTypeChart.data.datasets[0].data = newData;
        assessmentTypeChart.update();
    }
    
    // Update Skill Distribution Chart
    const skillDistributionChart = Chart.getChart('skill-distribution-chart');
    if (skillDistributionChart) {
        // Simulate data changes
        const baseData = [87, 82, 79, 58, 62, 75];
        const newData = baseData.map(score => {
            return Math.min(100, Math.max(50, score + (Math.random() * 8 - 4)));
        });
        
        skillDistributionChart.data.datasets[0].data = newData;
        skillDistributionChart.update();
    }
    
    // Update Performance Trend Chart
    const performanceTrendChart = Chart.getChart('performance-trend-chart');
    if (performanceTrendChart) {
        // Simulate data changes for each dataset
        performanceTrendChart.data.datasets.forEach(dataset => {
            dataset.data = dataset.data.map(score => {
                return Math.min(100, Math.max(50, score + (Math.random() * 6 - 3)));
            });
        });
        performanceTrendChart.update();
    }
    
    // Update Communication Analysis Chart
    const communicationAnalysisChart = Chart.getChart('communication-analysis-chart');
    if (communicationAnalysisChart) {
        const baseData = [84, 72, 68, 80, 76];
        const newData = baseData.map(score => {
            return Math.min(100, Math.max(50, score + (Math.random() * 8 - 4)));
        });
        
        communicationAnalysisChart.data.datasets[0].data = newData;
        communicationAnalysisChart.update();
    }
    
    // Show a notification to the user
    showNotification('Dashboard updated with filtered data');
}

/**
 * Update summary cards with filtered data
 * @param {string} assessmentType - The selected assessment type filter
 * @param {string} dateRange - The selected date range filter
 */
function updateSummaryCards(assessmentType, dateRange) {
    // In a real application, this would update with actual filtered data
    // For demo purposes, we'll simulate updates with slight variations
    
    const summaryValues = document.querySelectorAll('.summary-value');
    const summaryTrends = document.querySelectorAll('.summary-trend');
    
    // Update total candidates
    if (summaryValues[0]) {
        let baseValue = 124;
        if (assessmentType !== 'all') {
            baseValue = Math.floor(baseValue * 0.7); // Simulate filter effect
        }
        summaryValues[0].textContent = baseValue;
    }
    
    // Update active assessments
    if (summaryValues[1]) {
        let baseValue = 37;
        if (assessmentType !== 'all') {
            baseValue = Math.floor(baseValue * 0.8);
        }
        summaryValues[1].textContent = baseValue;
    }
    
    // Update completed assessments
    if (summaryValues[2]) {
        let baseValue = 89;
        if (assessmentType !== 'all') {
            baseValue = Math.floor(baseValue * 0.75);
        }
        summaryValues[2].textContent = baseValue;
    }
    
    // Update average score
    if (summaryValues[3]) {
        let baseValue = 72.5;
        if (assessmentType !== 'all') {
            // Different assessment types might have different average scores
            const adjustments = {
                'technical': 2.5,
                'behavioral': 5.0,
                'communication': -1.5
            };
            baseValue += (adjustments[assessmentType] || 0);
        }
        summaryValues[3].textContent = baseValue.toFixed(1) + '%';
    }
    
    // Update trend indicators
    summaryTrends.forEach(trend => {
        // Randomly toggle between positive and negative trends for demo
        const isPositive = Math.random() > 0.3;
        trend.className = isPositive ? 'summary-trend positive' : 'summary-trend negative';
        trend.innerHTML = isPositive ? 
            '<i class="fas fa-arrow-up"></i> ' + (Math.floor(Math.random() * 15) + 5) + '% from last month' :
            '<i class="fas fa-arrow-down"></i> ' + (Math.floor(Math.random() * 10) + 1) + '% from last month';
    });
}

/**
 * Show candidate profile details
 * @param {string} name - Candidate name
 * @param {string} role - Candidate role
 * @param {HTMLElement} row - The table row element containing candidate data
 */
function showCandidateProfile(name, role, row) {
    // In a real application, this would navigate to a detailed profile page
    // or open a modal with candidate details
    
    // For demo purposes, we'll create a simple modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Get scores from the row
    const scores = Array.from(row.querySelectorAll('.score')).map(el => el.textContent);
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="candidate-profile-header">
                <div class="candidate-avatar large"><i class="fas fa-user-circle"></i></div>
                <div>
                    <h2>${name}</h2>
                    <p>${role}</p>
                </div>
            </div>
            <div class="candidate-scores">
                <h3>Assessment Scores</h3>
                <div class="score-details">
                    <div class="score-item">
                        <span class="score-label">Overall:</span>
                        <span class="score-value">${scores[0] || 'N/A'}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Technical:</span>
                        <span class="score-value">${scores[1] || 'N/A'}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Communication:</span>
                        <span class="score-value">${scores[2] || 'N/A'}</span>
                    </div>
                    <div class="score-item">
                        <span class="score-label">Behavioral:</span>
                        <span class="score-value">${scores[3] || 'N/A'}</span>
                    </div>
                </div>
            </div>
            <div class="candidate-actions">
                <button class="btn btn-primary">Schedule Interview</button>
                <button class="btn">Send Message</button>
                <button class="btn">View Full Report</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside the modal content
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Add event listeners for the action buttons
    const actionButtons = modal.querySelectorAll('.candidate-actions .btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert(`Action: ${this.textContent} for ${name}`);
        });
    });
}

/**
 * Download candidate assessment report
 * @param {string} name - Candidate name
 * @param {string} role - Candidate role
 */
function downloadCandidateReport(name, role) {
    // In a real application, this would generate and download a PDF or other report format
    // For demo purposes, we'll show a notification
    showNotification(`Downloading assessment report for ${name} (${role})...`);
    
    // Simulate download delay
    setTimeout(() => {
        showNotification(`Report for ${name} downloaded successfully!`, 'success');
    }, 3000);
}
/**
 * Setup event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Filter button click handler
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const assessmentType = document.getElementById('assessment-type-filter').value;
            const dateRange = document.getElementById('date-range-filter').value;
            
            // Refresh dashboard data with the selected filters
            refreshDashboardData(assessmentType, dateRange);
            
            // Update the summary cards with filtered data
            updateSummaryCards(assessmentType, dateRange);
        });
    }
    
    // Candidate action buttons
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const candidateRow = this.closest('tr');
            const candidateName = candidateRow.querySelector('.candidate-name').textContent;
            const candidateRole = candidateRow.querySelector('.candidate-role').textContent;
            
            if (icon.classList.contains('fa-eye')) {
                showCandidateProfile(candidateName, candidateRole, candidateRow);
            } else if (icon.classList.contains('fa-file-download')) {
                downloadCandidateReport(candidateName, candidateRole);
            }
        });
    });
    
    // Summary card click handlers
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            navigateToDetailView(cardTitle);
        });
    });
    
    // Insight card click handlers  
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const insightTitle = this.querySelector('h3').textContent;
            showInsightDetails(insightTitle);
        });
    });
}

/**
 * Navigate to a detailed view based on summary card
 * @param {string} cardTitle - The title of the clicked card
 */
function navigateToDetailView(cardTitle) {
    // In a real application, this would navigate to a detailed view
    // For demo purposes, we'll show a notification
    showNotification(`Navigating to detailed view for: ${cardTitle}`);
}

/**
 * Show detailed information for an insight
 * @param {string} insightTitle - The title of the insight
 */
function showInsightDetails(insightTitle) {
    // In a real application, this would show a modal or navigate to a detailed view
    // For demo purposes, we'll show a notification
    showNotification(`Showing detailed insights for: ${insightTitle}`);
}

/**
 * Show a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (info, success, warning, error)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Automatically remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Setup event listeners for dashboard interactions
 */
function setupEventListeners() {
    // Filter button click handler
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const assessmentType = document.getElementById('assessment-type-filter').value;
            const dateRange = document.getElementById('date-range-filter').value;
            
            // In a real application, this would fetch filtered data from the server
            // For demo purposes, we'll just show an alert
            alert(`Filters applied: Assessment Type = ${assessmentType}, Date Range = ${dateRange}`);
            
            // Refresh dashboard data with the selected filters
            refreshDashboardData(assessmentType, dateRange);
            
            // Update the summary cards with filtered data
            updateSummaryCards(assessmentType, dateRange);
        });
    }
    
    // Candidate action buttons
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const candidateRow = this.closest('tr');
            const candidateName = candidateRow.querySelector('.candidate-name').textContent;
            const candidateRole = candidateRow.querySelector('.candidate-role').textContent;
            
            if (icon.classList.contains('fa-eye')) {
                // View candidate profile
                showCandidateProfile(candidateName, candidateRole, candidateRow);
            } else if (icon.classList.contains('fa-file-download')) {
                // Download candidate report
                downloadCandidateReport(candidateName, candidateRole);
            }
        });
    });
    
    // Add event listeners for summary cards
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardTitle = this.querySelector('h3').textContent;
            navigateToDetailView(cardTitle);
        });
    });
    
    // Add event listeners for insight cards
    const insightCards = document.querySelectorAll('.insight-card');
    insightCards.forEach(card => {
        card.addEventListener('click', function() {
            const insightTitle = this.querySelector('h3').textContent;
            showInsightDetails(insightTitle);
        });
    });}
