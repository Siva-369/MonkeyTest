// Main JavaScript for AI Hiring Assessment Platform

document.addEventListener('DOMContentLoaded', function() {
  // Initialize navigation
  initNavigation();
  
  // Handle active page highlighting
  highlightActivePage();
  
  // Initialize interactive components
  initInteractiveComponents();
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
        <li class="nav-item"><a href="/dashboard" class="nav-link" data-page="dashboard"><i class="fas fa-tachometer-alt"></i>Dashboard</a></li>
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
          
          // Add click event listeners to dropdown items
          const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
          dropdownItems.forEach(item => {
            item.addEventListener('click', function(e) {
              e.stopPropagation(); // Prevent event bubbling
              const targetPage = this.getAttribute('href');
              window.history.pushState({}, '', targetPage);
              highlightActivePage();
              loadPageContent(targetPage);
              navList.style.display = 'none'; // Close the mobile menu after selection
            });
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
 * Highlight the active page in the navigation
 */
function highlightActivePage() {
  // Get current path
  const currentPath = window.location.pathname;
  
  // Get all navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Remove active class from all links
  navLinks.forEach(link => link.classList.remove('active'));
  
  // Add active class to current page link
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath === linkPath || 
        (linkPath !== '/' && currentPath.startsWith(linkPath))) {
      link.classList.add('active');
    } else if (currentPath === '/' && linkPath === '/') {
      link.classList.add('active');
    }
  });
}

/**
 * Handle navigation to different pages
 */
document.addEventListener('click', function(event) {
  // Check if clicked element is a navigation link
  if (event.target.classList.contains('nav-link') && !event.target.closest('.nav-item').querySelector('.dropdown-menu')) {
    event.preventDefault();
    const targetPage = event.target.getAttribute('href');
    
    // Update URL without page reload (client-side routing)
    window.history.pushState({}, '', targetPage);
    
    // Update active page highlighting
    highlightActivePage();
    
    // Load page content (in a real SPA, this would fetch and render components)
    loadPageContent(targetPage);
  }
  
  // Check if clicked element is a dropdown item
  if (event.target.classList.contains('dropdown-item') && window.matchMedia('(min-width: 769px)').matches) {
    event.preventDefault();
    const targetPage = event.target.getAttribute('href');
    
    // Update URL without page reload (client-side routing)
    window.history.pushState({}, '', targetPage);
    
    // Update active page highlighting
    highlightActivePage();
    
    // Load page content
    loadPageContent(targetPage);
  }
});

/**
 * Load page content based on route
 * @param {string} route - The route to load
 */
function loadPageContent(route) {
  // Get main content area
  const mainContent = document.querySelector('main');
  
  // Simple routing implementation
  let content = '';
  
  switch(route) {
    case '/':
      content = `
        <section class="welcome">
          <h2>Welcome to the Future of Hiring</h2>
          <p>Our AI-powered platform helps evaluate candidates through comprehensive, automated assessments.</p>
        </section>
      `;
      break;
    case '/dashboard':
      content = `
        <h2>Dashboard</h2>
        <div class="dashboard">
          <div class="card">
            <h3 class="card-title">Active Assessments</h3>
            <p>You have 5 active assessments</p>
          </div>
          <div class="card">
            <h3 class="card-title">Candidates</h3>
            <p>12 candidates in the pipeline</p>
          </div>
          <div class="card">
            <h3 class="card-title">Recent Results</h3>
            <p>3 new assessment results</p>
          </div>
        </div>
      `;
      break;
    case '/assessments':
      content = `
        <h2>Assessments</h2>
        <p>Manage your assessment templates and view results.</p>
        <div class="dashboard">
          <div class="card">
            <h3 class="card-title">Technical Assessment</h3>
            <p>For software engineering roles</p>
            <button class="btn btn-sm btn-create" data-type="technical">Create New</button>
          </div>
          <div class="card">
            <h3 class="card-title">Leadership Assessment</h3>
            <p>For management positions</p>
            <button class="btn btn-sm btn-create" data-type="leadership">Create New</button>
          </div>
          <div class="card">
            <h3 class="card-title">Problem Solving</h3>
            <p>General analytical skills</p>
            <button class="btn btn-sm btn-create" data-type="problem-solving">Create New</button>
          </div>
        </div>
        
        <h3 class="section-title">AI-Powered Assessment Features</h3>
        <div class="feature-cards">
          <div class="card feature-card">
            <i class="fas fa-brain feature-icon"></i>
            <h3>Adaptive Scenario-Based Assessments</h3>
            <p>Generate dynamic, non-repetitive job scenarios that assess problem-solving and decision-making</p>
            <button class="btn btn-sm btn-feature" data-feature="adaptive-scenario">Try Now</button>
          </div>
          <div class="card feature-card">
            <i class="fas fa-comments feature-icon"></i>
            <h3>Communication Analysis</h3>
            <p>Evaluate email etiquette, verbal communication, and professionalism in responses</p>
            <button class="btn btn-sm btn-feature" data-feature="communication-analysis">Try Now</button>
          </div>
          <div class="card feature-card">
            <i class="fas fa-code feature-icon"></i>
            <h3>Comprehensive Skill Assessment</h3>
            <p>Evaluate technical and non-technical skills through various assessment methods</p>
            <button class="btn btn-sm btn-feature" data-feature="skill-assessment">Try Now</button>
          </div>
        </div>
      `;
      break;
    case '/candidates':
      content = `
        <h2>Candidates</h2>
        <p>View and manage candidate profiles and assessment results.</p>
        <div class="dashboard">
          <div class="card">
            <h3 class="card-title">Active Candidates</h3>
            <p>Currently in assessment process</p>
          </div>
          <div class="card">
            <h3 class="card-title">Completed Assessments</h3>
            <p>Candidates who finished assessments</p>
          </div>
          <div class="card">
            <h3 class="card-title">Top Performers</h3>
            <p>Highest scoring candidates</p>
          </div>
        </div>
      `;
      break;
    case '/profile':
      content = `
        <h2>User Profile</h2>
        <p>Manage your account settings and preferences.</p>
        <div class="dashboard">
          <div class="card">
            <h3 class="card-title">Personal Information</h3>
            <p>Update your profile details</p>
          </div>
          <div class="card">
            <h3 class="card-title">Security Settings</h3>
            <p>Manage password and security options</p>
          </div>
          <div class="card">
            <h3 class="card-title">Notification Preferences</h3>
            <p>Control how you receive updates</p>
          </div>
        </div>
      `;
      break;
    default:
      content = `
        <section class="welcome">
          <h2>Page Not Found</h2>
          <p>The requested page does not exist.</p>
        </section>
      `;
  }
  
  // Update main content
  mainContent.innerHTML = content;
}

/**
 * Initialize interactive components
 */
function initInteractiveComponents() {
  // Initialize contact form
  initContactForm();
  
  // Initialize FAQ accordion
  initFaqAccordion();
  // Login button
  const loginBtn = document.querySelector('.btn-login');
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      // In a real app, this would open a login modal or redirect to login page
      alert('Login functionality would be implemented here');
    });
  }
  
  // Signup button
  const signupBtn = document.querySelector('.btn-signup');
  if (signupBtn) {
    signupBtn.addEventListener('click', function() {
      // In a real app, this would open a signup modal or redirect to signup page
      alert('Signup functionality would be implemented here');
    });
  }
  
  // AI Feature buttons
  const featureButtons = document.querySelectorAll('.btn-feature');
  if (featureButtons.length > 0) {
    featureButtons.forEach(button => {
      button.addEventListener('click', function() {
        const feature = this.getAttribute('data-feature');
        showFeatureModal(feature);
      });
    });
  }
  
  // Create assessment buttons
  const createButtons = document.querySelectorAll('.btn-create');
  if (createButtons.length > 0) {
    createButtons.forEach(button => {
      button.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        showCreateAssessmentModal(type);
      });
    });
  }
  
  // Search functionality
  const searchBtn = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', function() {
      performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch(searchInput.value);
      }
    });
  }
  
  // CTA buttons
  const getStartedBtn = document.querySelector('.btn-primary');
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function() {
      // Navigate to dashboard or signup
      window.history.pushState({}, '', '/dashboard');
      highlightActivePage();
      loadPageContent('/dashboard');
    });
  }
  
  const learnMoreBtn = document.querySelector('.btn-secondary');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function() {
      // Scroll to features section or navigate to about page
      const featuresSection = document.querySelector('.features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Perform search functionality
 * @param {string} query - The search query
 */
function performSearch(query) {
  if (!query.trim()) {
    alert('Please enter a search term');
    return;
  }
  
  // In a real app, this would search the database or filter content
  alert(`Searching for: ${query}`);
  // Example: redirect to search results page
  // window.history.pushState({}, '', `/search?q=${encodeURIComponent(query)}`);
  // loadPageContent('/search');
}

/**
 * Show feature modal for AI assessment features
 * @param {string} feature - The feature type
 */
function showFeatureModal(feature) {
  let title, content;
  
  switch(feature) {
    case 'adaptive-scenario':
      title = 'Adaptive Scenario-Based Assessment';
      content = `
        <form id="adaptive-scenario-form">
          <div class="form-group">
            <label for="role">Target Job Role:</label>
            <input type="text" id="role" name="role" required placeholder="e.g., Frontend Developer">
          </div>
          <div class="form-group">
            <label for="difficulty">Difficulty Level:</label>
            <select id="difficulty" name="difficultyLevel" required>
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div class="form-group">
            <label for="skills">Required Skills (comma-separated):</label>
            <input type="text" id="skills" name="skills" required placeholder="e.g., JavaScript, React, CSS">
          </div>
          <button type="submit" class="btn btn-primary">Generate Assessment</button>
        </form>
      `;
      break;
    case 'communication-analysis':
      title = 'Communication Analysis';
      content = `
        <form id="communication-analysis-form">
          <div class="form-group">
            <label for="comm-type">Communication Type:</label>
            <select id="comm-type" name="communicationType" required>
              <option value="written">Written Response</option>
              <option value="email">Email</option>
              <option value="verbal">Verbal Transcript</option>
            </select>
          </div>
          <div class="form-group">
            <label for="job-role">Job Role Context (optional):</label>
            <input type="text" id="job-role" name="jobRole" placeholder="e.g., Product Manager">
          </div>
          <div class="form-group">
            <label for="response">Candidate Response:</label>
            <textarea id="response" name="response" rows="6" required placeholder="Paste candidate's response here..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Analyze Communication</button>
        </form>
      `;
      break;
    case 'skill-assessment':
      title = 'Technical Skill Assessment';
      content = `
        <div class="tabs">
          <button class="tab-btn active" data-tab="technical">Technical Assessment</button>
          <button class="tab-btn" data-tab="non-technical">Non-Technical Assessment</button>
        </div>
        <div class="tab-content" id="technical-tab">
          <form id="technical-assessment-form">
            <div class="form-group">
              <label for="tech-role">Technical Role:</label>
              <input type="text" id="tech-role" name="role" required placeholder="e.g., Backend Developer">
            </div>
            <div class="form-group">
              <label for="tech-level">Experience Level:</label>
              <select id="tech-level" name="level" required>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div class="form-group">
              <label for="technologies">Technologies (comma-separated):</label>
              <input type="text" id="technologies" name="technologies" required placeholder="e.g., Node.js, Express, MongoDB">
            </div>
            <button type="submit" class="btn btn-primary">Generate Technical Assessment</button>
          </form>
        </div>
        <div class="tab-content hidden" id="non-technical-tab">
          <form id="non-technical-assessment-form">
            <div class="form-group">
              <label for="non-tech-role">Non-Technical Role:</label>
              <input type="text" id="non-tech-role" name="role" required placeholder="e.g., Marketing Manager">
            </div>
            <div class="form-group">
              <label for="non-tech-level">Experience Level:</label>
              <select id="non-tech-level" name="level" required>
                <option value="junior">Junior</option>
                <option value="mid">Mid-level</option>
                <option value="senior">Senior</option>
              </select>
            </div>
            <div class="form-group">
              <label for="skills-list">Skills (comma-separated):</label>
              <input type="text" id="skills-list" name="skills" required placeholder="e.g., Market Analysis, Campaign Management, SEO">
            </div>
            <button type="submit" class="btn btn-primary">Generate Non-Technical Assessment</button>
          </form>
        </div>
      `;
      break;
    case 'behavioral-analysis':
      title = 'Behavioral Analysis';
      content = `
        <form id="behavioral-analysis-form">
          <div class="form-group">
            <label for="candidate-name">Candidate Name (optional):</label>
            <input type="text" id="candidate-name" name="candidateName" placeholder="e.g., John Smith">
          </div>
          <div class="form-group">
            <label for="analysis-type">Analysis Type:</label>
            <select id="analysis-type" name="analysisType" required>
              <option value="decision-making">Decision Making</option>
              <option value="leadership">Leadership Style</option>
              <option value="teamwork">Teamwork & Collaboration</option>
              <option value="stress">Stress Management</option>
              <option value="adaptability">Adaptability</option>
            </select>
          </div>
          <div class="form-group">
            <label for="scenario-response">Candidate Response to Scenario:</label>
            <textarea id="scenario-response" name="response" rows="6" required placeholder="Paste candidate's response to the scenario here..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Analyze Behavior</button>
        </form>
      `;
      break;
    case 'analytics':
      title = 'Assessment Analytics';
      content = `
        <form id="analytics-form">
          <div class="form-group">
            <label for="assessment-type">Assessment Type:</label>
            <select id="assessment-type" name="assessmentType" required>
              <option value="technical">Technical Assessment</option>
              <option value="behavioral">Behavioral Assessment</option>
              <option value="communication">Communication Assessment</option>
              <option value="all">All Assessments</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date-range">Date Range:</label>
            <select id="date-range" name="dateRange" required>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div class="form-group">
            <label for="metrics">Metrics to Include:</label>
            <div class="checkbox-group">
              <label><input type="checkbox" name="metrics" value="completion" checked> Completion Rate</label>
              <label><input type="checkbox" name="metrics" value="score" checked> Average Score</label>
              <label><input type="checkbox" name="metrics" value="time" checked> Time to Complete</label>
              <label><input type="checkbox" name="metrics" value="difficulty" checked> Difficulty Analysis</label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Generate Analytics</button>
        </form>
      `;
      break;
    case 'candidate-management':
      title = 'Candidate Management';
      content = `
        <div class="tabs">
          <button class="tab-btn active" data-tab="active">Active Candidates</button>
          <button class="tab-btn" data-tab="invite">Invite Candidate</button>
        </div>
        <div class="tab-content" id="active-tab">
          <p>View and manage candidates currently in your assessment pipeline.</p>
          <div class="form-group">
            <label for="candidate-filter">Filter By:</label>
            <select id="candidate-filter" name="filter">
              <option value="all">All Candidates</option>
              <option value="pending">Pending Assessments</option>
              <option value="completed">Completed Assessments</option>
              <option value="highscore">High Performers</option>
            </select>
          </div>
          <button class="btn btn-primary">View Candidates</button>
        </div>
        <div class="tab-content hidden" id="invite-tab">
          <form id="invite-candidate-form">
            <div class="form-group">
              <label for="candidate-email">Candidate Email:</label>
              <input type="email" id="candidate-email" name="email" required placeholder="candidate@example.com">
            </div>
            <div class="form-group">
              <label for="assessment-select">Assessment Type:</label>
              <select id="assessment-select" name="assessmentType" required>
                <option value="">Select Assessment Type</option>
                <option value="technical">Technical Assessment</option>
                <option value="behavioral">Behavioral Assessment</option>
                <option value="communication">Communication Assessment</option>
                <option value="comprehensive">Comprehensive Assessment</option>
              </select>
            </div>
            <div class="form-group">
              <label for="position">Position:</label>
              <input type="text" id="position" name="position" required placeholder="e.g., Senior Developer">
            </div>
            <button type="submit" class="btn btn-primary">Send Invitation</button>
          </form>
        </div>
      `;
      break;
    default:
      title = 'Feature Not Available';
      content = '<p>This feature is currently under development.</p>';
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Close button functionality
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(modal);
  });
  
  // Close when clicking outside the modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Tab switching for skill assessment
  if (feature === 'skill-assessment') {
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const tab = this.getAttribute('data-tab');
        
        // Update active button
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Show selected tab content
        tabContents.forEach(content => {
          content.classList.add('hidden');
          if (content.id === `${tab}-tab`) {
            content.classList.remove('hidden');
          }
        });
      });
    });
  }
  
  // Form submission handlers
  setupFormHandlers(modal, feature);
}

/**
 * Setup form handlers for AI assessment features
 * @param {HTMLElement} modal - The modal element
 * @param {string} feature - The feature type
 */
function setupFormHandlers(modal, feature) {
  switch(feature) {
    case 'adaptive-scenario':
      const adaptiveForm = modal.querySelector('#adaptive-scenario-form');
      adaptiveForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(adaptiveForm);
        const data = {
          role: formData.get('role'),
          difficultyLevel: formData.get('difficultyLevel'),
          skills: formData.get('skills').split(',').map(skill => skill.trim())
        };
        
        // Call API to generate adaptive assessment
        callApi('/api/v1/adaptive-assessments/adaptive', data, modal);
      });
      break;
    case 'communication-analysis':
      const commForm = modal.querySelector('#communication-analysis-form');
      commForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(commForm);
        const data = {
          response: formData.get('response'),
          communicationType: formData.get('communicationType'),
          context: {
            jobRole: formData.get('jobRole')
          }
        };
        
        // Call API to analyze communication
        callApi('/api/v1/adaptive-assessments/analyze-communication', data, modal);
      });
      break;
    case 'skill-assessment':
      const techForm = modal.querySelector('#technical-assessment-form');
      const nonTechForm = modal.querySelector('#non-technical-assessment-form');
      
      techForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(techForm);
        const data = {
          role: formData.get('role'),
          level: formData.get('level'),
          technologies: formData.get('technologies').split(',').map(tech => tech.trim())
        };
        
        // Call API to generate technical assessment
        callApi('/api/v1/adaptive-assessments/technical', data, modal);
      });
      
      nonTechForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(nonTechForm);
        const data = {
          role: formData.get('role'),
          level: formData.get('level'),
          skills: formData.get('skills').split(',').map(skill => skill.trim())
        };
        
        // Call API to generate non-technical assessment
        callApi('/api/v1/adaptive-assessments/non-technical', data, modal);
      });
      break;
  }
}

/**
 * Call API and handle response
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @param {HTMLElement} modal - The modal element
 */
function callApi(endpoint, data, modal) {
  // Show loading state
  const modalBody = modal.querySelector('.modal-body');
  const originalContent = modalBody.innerHTML;
  modalBody.innerHTML = '<div class="loading">Processing request...</div>';
  
  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('API request failed');
    }
    return response.json();
  })
  .then(result => {
    // Show success message with assessment details
    modalBody.innerHTML = `
      <div class="success-message">
        <i class="fas fa-check-circle"></i>
        <h4>Success!</h4>
        <p>Your assessment has been generated successfully.</p>
        <div class="assessment-details">
          <h5>${result.data.title}</h5>
          <p>${result.data.description}</p>
          <p><strong>Type:</strong> ${result.data.type}</p>
          <p><strong>Difficulty:</strong> ${result.data.difficultyLevel}</p>
          <p><strong>Total Points:</strong> ${result.data.totalPoints}</p>
        </div>
        <button class="btn btn-primary view-assessment" data-id="${result.data._id}">View Assessment</button>
      </div>
    `;
    
    // Add event listener for view assessment button
    const viewBtn = modalBody.querySelector('.view-assessment');
    viewBtn.addEventListener('click', function() {
      const assessmentId = this.getAttribute('data-id');
      window.location.href = `/assessments/${assessmentId}`;
    });
  })
  .catch(error => {
    console.error('Error:', error);
    modalBody.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <h4>Error</h4>
        <p>Failed to process your request. Please try again.</p>
        <button class="btn btn-secondary try-again">Try Again</button>
      </div>
    `;
    
    // Add event listener for try again button
    const tryAgainBtn = modalBody.querySelector('.try-again');
    tryAgainBtn.addEventListener('click', function() {
      modalBody.innerHTML = originalContent;
      setupFormHandlers(modal, modal.getAttribute('data-feature'));
    });
  });
}

/**
 * Show create assessment modal
 * @param {string} type - The assessment type
 */
function showCreateAssessmentModal(type) {
  let title, content;
  
  switch(type) {
    case 'technical':
      title = 'Create Technical Assessment';
      content = `
        <p>Create a customized technical assessment for software engineering roles.</p>
        <button class="btn btn-feature" data-feature="skill-assessment">Create with AI</button>
        <button class="btn btn-secondary">Create Manually</button>
      `;
      break;
    case 'leadership':
      title = 'Create Leadership Assessment';
      content = `
        <p>Create a customized leadership assessment for management positions.</p>
        <button class="btn btn-feature" data-feature="adaptive-scenario">Create with AI</button>
        <button class="btn btn-secondary">Create Manually</button>
      `;
      break;
    case 'problem-solving':
      title = 'Create Problem-Solving Assessment';
      content = `
        <p>Create a customized problem-solving assessment for analytical skills.</p>
        <button class="btn btn-feature" data-feature="adaptive-scenario">Create with AI</button>
        <button class="btn btn-secondary">Create Manually</button>
      `;
      break;
    default:
      title = 'Create Assessment';
      content = '<p>This assessment type is not available.</p>';
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <span class="close">&times;</span>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  // Add modal to body
  document.body.appendChild(modal);
  
  // Close button functionality
  const closeBtn = modal.querySelector('.close');
  closeBtn.addEventListener('click', function() {
    document.body.removeChild(modal);
  });
  
  // Close when clicking outside the modal
  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  // Add event listeners for feature buttons
  const featureButtons = modal.querySelectorAll('.btn-feature');
  featureButtons.forEach(button => {
    button.addEventListener('click', function() {
      const feature = this.getAttribute('data-feature');
      document.body.removeChild(modal);
      showFeatureModal(feature);
    });
  });
}

/**
 * Initialize FAQ accordion functionality
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', function() {
        // Toggle active class on the clicked item
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
          faqItem.classList.remove('active');
        });
        
        // If the clicked item wasn't active, make it active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
    
    // Open the first FAQ item by default
    faqItems[0].classList.add('active');
  }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function() {
  highlightActivePage();
  loadPageContent(window.location.pathname);
});