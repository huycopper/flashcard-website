# How to Run and Test the Flashcard Website

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Supabase account and credentials (for backend)

## Step 1: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the backend directory** with your Supabase credentials:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=4000
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:4000`

## Step 2: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend/flashcard-frontend-auth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file in the frontend directory:**
   ```env
   REACT_APP_API_URL=http://localhost:4000/api
   ```

4. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will automatically open in your browser at `http://localhost:3000`

## Step 3: Testing the Website

### Test the Login Page:
1. Navigate to `http://localhost:3000/login`
2. You should see the modern login page with:
   - Email and password fields
   - "Remember me" checkbox
   - "Forgot password?" link
   - Social login buttons
   - Link to registration

### Test Registration:
1. Click "Sign up here" on the login page or navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. After successful registration, you'll be redirected to the login page

### Test the Dashboard:
1. After logging in, you'll be redirected to `/dashboard`
2. You should see:
   - Welcome message with your username
   - Statistics cards (Total Decks, Total Cards, etc.)
   - Quick Actions section
   - Recent Activity timeline
   - Study Progress section

### Test Navigation:
- Use the header navigation to move between pages
- Logout button should work and redirect to home
- Home page should redirect logged-in users to dashboard

## Troubleshooting

### Backend won't start:
- Check that port 4000 is not already in use
- Verify your `.env` file has correct Supabase credentials
- Make sure all dependencies are installed (`npm install`)

### Frontend can't connect to backend:
- Verify backend is running on port 4000
- Check that `REACT_APP_API_URL` in frontend `.env` is set to `http://localhost:4000/api`
- Restart the frontend server after changing `.env` file

### CORS errors:
- The backend should have CORS enabled (it's already configured)
- Make sure backend is running before starting frontend

### Port already in use:
- Backend: Change `PORT` in backend `.env` file
- Frontend: React will prompt you to use a different port, or set `PORT=3001` in frontend `.env`

## Quick Start Commands Summary

**Terminal 1 (Backend):**
```bash
cd backend
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend/flashcard-frontend-auth
npm install
npm start
```

Then open `http://localhost:3000` in your browser!

