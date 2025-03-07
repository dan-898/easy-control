# Employee management

## Project Overview

This project is a full-stack authentication application, consisting of a React-based frontend and a backend API. It's designed to provide a robust authentication system that can be easily integrated into various web applications.

### Key Features

- User registration and login
- JWT-based authentication
- Responsive UI using Material-UI
- Docker containerization for both frontend and backend
- Database migrations using Alembic

## Project Structure

The project is divided into two main parts:

1. `auth-backend`: Contains the backend API logic
2. `auth-frontend`: Houses the React-based frontend application

### Backend (`auth-backend`)

- Built with Python (specific framework FastAPI)
- Uses Alembic for database migrations
- Dockerized for easy deployment

### Frontend (`auth-frontend`)

- Created with Create React App
- Uses Material-UI for styling
- React Router for navigation
- Axios for API requests
- Dockerized with NGINX for serving static files

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)
- Python 3.x (for local backend development)

### Installation and Running the Application

1. Clone the repository:

2. Start the application using Docker Compose: docker-compose up --build

3. Access the application at `http://localhost:3000`

### Local Development

#### Frontend

1. Navigate to the frontend directory: cd auth-frontend

2. Install dependencies: npm install

#### Backend

1. Navigate to the backend directory:
  cd auth-backend

2. Create and activate a virtual environment:
  python -m venv venv
   source venv/bin/activate  # On Windows use
   
3. Install dependencies:


   
4. Run the backend server (command may vary based on the framework used)

## Available Scripts (Frontend)

In the frontend directory, you can run:

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App setup

## Deployment

The application is containerized and can be deployed to any platform that supports Docker containers. Adjust the `docker-compose.yml` file as needed for your specific deployment environment.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

