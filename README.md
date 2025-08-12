# SkillSwap Backend

Learning new skills can be lonely, costly, and hard to stay motivated. Especially without guidance and support. While many people are eager to share what they know, there’s no simple, peer-based way to connect based on shared interests and skills.

Most platforms are built for content delivery, not human connection.
But what if learning felt more like meeting a friend than taking a class?

This project aims to solve that by creating a user-friendly Skill Exchange App, where users match by what they want to learn and teach, then connect, chat, and support each other. 

It makes learning social, fun, and free. Inspired by social matching platforms, the app helps people find partners with complementary skills and shared interests. By fostering mutual support and peer-to-peer learning, it turns learning into a social, rewarding experience.

## 📺 Deployment
- [SkillSwap Backend](https://skill-swap-backend-35l1.onrender.com)
- [SkillSwap Frontend](https://skill-swap-frontend-dyhq.onrender.com)

## 🚀 Features

- **User Authentication**: Secure login/signup system
- **Profile Management**: Create and edit user profiles with skills to offer and learn
- **AI-Powered Matching**: Intelligent matching based on skill compatibility and learning preferences
- **Match Suggestions**: Browse and filter potential learning partners
- **Profile Viewing**: View other users' profiles to learn about their skills
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Axios
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App

## 📦 Dependencies

### Core Dependencies
- **react**: ^18.2.0 - React library for building user interfaces
- **react-dom**: ^18.2.0 - React DOM rendering
- **axios**: ^1.6.2 - HTTP client for making API requests
- **react-scripts**: 5.0.1 - Create React App build scripts

### Development Dependencies
- **@testing-library/jest-dom**: ^5.17.0 - Custom Jest matchers for DOM testing
- **@testing-library/react**: ^13.4.0 - React testing utilities
- **@testing-library/user-event**: ^13.5.0 - User event simulation for testing
- **web-vitals**: ^2.1.4 - Web performance metrics
- **@babel/preset-env**: ^7.27.2 - Babel preset for modern JavaScript
- **@babel/preset-react**: ^7.27.1 - Babel preset for React
- **babel-jest**: ^29.7.0 - Jest transformer for Babel
- **gh-pages**: ^6.3.0 - GitHub Pages deployment

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Backend API server running (Spring Boot)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <https://github.com/jennylearncoding/skill_swap_frontend>
cd skill_swap_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8080
```

### 4. Start the Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Integration Tests
```bash
npm run test:integration
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Integration Tests with Coverage
```bash
npm run test:integration:coverage
```

## 📁 Project Structure

```
src/
├── components/
│   ├── AuthModal/          # Login/Signup modal
│   ├── LandingPage/        # Home page with "How It Works"
│   ├── MatchCard/          # Individual match display cards
│   ├── MatchSuggestionsPage/ # Match browsing and filtering
│   ├── Navigation/         # Top navigation bar
│   └── ProfilePage/        # User profile management
├── context/
│   └── AuthContext.jsx     # Global authentication state
├── __tests__/
│   └── integration/        # Comprehensive integration tests
└── App.jsx                 # Main application component
```

## 🎯 How It Works

1. **Edit Your Profile**: Add the skills you want to learn and the skills you can offer to others
2. **Explore Match Cards**: Our AI will help find skills you might be interested in and suggest compatible learning partners
3. **Find Learning Partner**: Browse through personalized match suggestions and find your ideal learning partner
4. **Contact Your Partner**: Reach out via email to discuss your learning goals and schedule (chat feature coming soon!)
5. **Plan & Learn Together**: Agree on a time and format for your skill exchange session
6. **Rate Each Other**: After your session, rate your learning partner (rating system coming soon!)

## 🚧 Future Enhancements

- **Real-time Chat**: Direct messaging between matched users
- **Rating System**: Post-session rating and feedback system
- **Photo Upload**: Profile picture upload functionality

---
**SkillSwap AI** - Connecting learners, one skill at a time! 🎓✨
