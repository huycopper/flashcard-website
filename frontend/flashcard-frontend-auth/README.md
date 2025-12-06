# Flashcard Frontend Auth

This project is a frontend application for managing flashcards with user authentication features. It is built using React and TypeScript.

## Project Structure

- **public/**: Contains static files.
  - **index.html**: The main HTML file that serves as the entry point for the application.

- **src/**: Contains the source code for the application.
  - **index.tsx**: The entry point of the React application.
  - **App.tsx**: The main application component that sets up routing.
  - **App.css**: Styles for the App component.
  - **pages/**: Contains the different pages of the application.
    - **Home.tsx**: Home page component.
    - **Login.tsx**: Login page component with authentication form.
    - **Register.tsx**: Registration page component with registration form.
  - **components/**: Contains reusable components.
    - **Header.tsx**: Navigation bar and user information display.
    - **PrivateRoute.tsx**: Component to protect routes from unauthenticated access.
  - **context/**: Contains context for managing authentication state.
    - **AuthContext.tsx**: Provides authentication state and functions.
  - **services/**: Contains services for handling authentication.
    - **authService.ts**: Functions for login, logout, and registration.
  - **hooks/**: Custom hooks for the application.
    - **useAuth.ts**: Hook for accessing authentication context.
  - **api/**: Contains API client for making HTTP requests.
    - **apiClient.ts**: API client for backend communication.
  - **types/**: Contains TypeScript types and interfaces.
    - **index.ts**: Type definitions used throughout the application.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd flashcard-frontend-auth
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory and define the necessary environment variables based on the `.env.example` file.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.