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
      <a href="/" class="navbar-brand">AI Hiring Assessment</a>
      <ul class="navbar-nav">
        <li class="nav-item"><a href="/" class="nav-link" data-page="home">Home</a></li>
        <li class="nav-item"><a href="/dashboard" class="nav-link" data-page="dashboard">Dashboard</a></li>
        <li class="nav-item"><a href="/assessments" class="nav-link" data-page="assessments">Assessments</a></li>
        <li class="nav-item"><a href="/candidates" class="nav-link" data-page="candidates">Candidates</a></li>
        <li class="nav-item"><a href="/profile" class="nav-link" data-page="profile">Profile</a></li>
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
    } else {
      toggleBtn.style.display = 'none';
      navList.style.display = 'flex';
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
  if (event.target.classList.contains('nav-link')) {
    event.preventDefault();
    const targetPage = event.target.getAttribute('href');
    
    // Update URL without page reload (client-side routing)
    window.history.pushState({}, '', targetPage);
    
    // Update active page highlighting
    highlightActivePage();
    
    // Load page content (in a real SPA, this would fetch and render components)
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
          </div>
          <div class="card">
            <h3 class="card-title">Leadership Assessment</h3>
            <p>For management positions</p>
          </div>
          <div class="card">
            <h3 class="card-title">Problem Solving</h3>
            <p>General analytical skills</p>
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

// Handle browser back/forward navigation
window.addEventListener('popstate', function() {
  highlightActivePage();
  loadPageContent(window.location.pathname);
});