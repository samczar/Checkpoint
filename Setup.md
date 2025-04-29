# 🚀 Project Setup Documentation
## 📋 Prerequisites
- Node.js (v16.0.0 or higher recommended)
- npm (included with Node.js installation)
- Git (for cloning repositories)

1.  Clone the Repository
- git clone https://github.com/samczar/Checkpoint
- cd <Checkpoint>

2. Frontend Setup (React + Vite)
### a. Install Dependencies
- cd frontend
- npm install
- create .env file
- Add this to .env file <VITE_API_URL=http://localhost:4000/api>

### b. Start Development Server
- npm run dev
- The app will typically be available at http://localhost:5173 (or as specified in the terminal).

### c. Build for Production
- npm run build
- The production build will be available in the `dist` folder.

### d. Run Tests
- npm test
- Ensure all tests pass before deployment.

### e. Start the Development Server
- npm run dev
- Access the app at the development URL provided in the terminal.

### f. Preview Production Build
- npm run preview
- This serves the production build locally.

3. Backend Setup (Node.js/Express)
### a. Install Dependencies
- cd backend
- npm install

### b. Set Up Environment Variables
- Create a `.env` file in the `backend` directory and add the required environment variables.
- MONGO_URI= <Add-your-mongo-db-uri-here>
- JWT_SECRET=AnythingHere
- CLIENT_ORIGIN=http://localhost:5173

### c. Start Development Server
- npm run dev
- Verify the server is running at the specified port.
- The server will typically run at http://localhost:4000 (or as specified in your code).

### d. Start Production Server
- npm run build 
- npm start

4. Connecting Frontend and Backend
- Ensure the frontend is configured to communicate with the backend API (e.g., update API base URLs in the frontend configuration).
- Set up CORS in the backend server to allow frontend requests.
