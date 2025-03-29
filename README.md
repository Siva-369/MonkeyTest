# AI-Powered Hiring Assessment Platform

A comprehensive platform that evaluates candidates through AI-powered assessments, providing detailed analytics and insights for hiring decisions.

## Project Structure

The project follows a modern, maintainable architecture with clear separation of concerns:

```
MonkeyTest/
│── backend/
│   ├── src/
│   │   ├── config/            # Environment & database configs
│   │   ├── controllers/       # Business logic handlers
│   │   ├── middleware/        # Authentication, logging, error handling
│   │   ├── models/            # Mongoose/Sequelize models
│   │   ├── routes/            # Express routes
│   │   ├── services/          # Core business logic
│   │   ├── utils/             # Helper functions
│   │   ├── app.js             # Express setup
│   │   ├── server.js          # Entry point
│   ├── package.json
│   ├── Dockerfile
│   ├── .env
│
│── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Screens & views
│   │   ├── routes/            # React Router setup
│   │   ├── services/          # API calls
│   │   ├── context/           # Global state management (Redux, Context API)
│   │   ├── assets/            # Images, icons, styles
│   │   ├── App.js             # Main React app
│   │   ├── index.js           # Entry point
│   ├── package.json
│
│── tests/                     # Unit & integration tests
│── .github/workflows/         # CI/CD pipelines
│── README.md                  # Documentation
│── technical_specification.md # System design details
```

## Features

- **User Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Recruiter, Candidate)
- **Adaptive Assessments**: Dynamic, non-repetitive job scenarios that adapt to candidate responses
- **Technical Skill Assessment**: Evaluate coding skills and technical knowledge
- **Communication Analysis**: Evaluate email etiquette and verbal communication
- **Behavioral Analysis**: Analyze candidate behavior patterns and decision-making processes
- **Analytics Dashboard**: Comprehensive insights into candidate performance
- **Real-time Notifications**: WebSocket-based notifications for updates
- **Dark Mode / Theme Toggle**: Improved user experience with theme options

## Technology Stack

- **Frontend**: React.js with TypeScript, Redux, Material-UI
- **Backend**: Node.js/Express.js, MongoDB, Redis
- **AI/ML**: TensorFlow/PyTorch, GPT-4 API
- **Infrastructure**: Docker, Kubernetes, AWS/Azure

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Redis

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

#### Production Mode

Use Docker Compose to run the entire application:

```
docker-compose up
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.