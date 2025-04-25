##💾 Database Schema (MongoDB)
// User Schema
{
  _id: ObjectId,
  email: string,
  password: string (hashed),
  name: string,
  avatarUrl?: string,
  createdAt: Date,
  updatedAt: Date
}

// Standup Schema
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  yesterday: string,
  today: string,
  blockers: string,
  createdAt: Date,
  updatedAt: Date
}

##🔑 API Endpoints
// Auth Routes
POST   /api/auth/signup
POST   /api/auth/login
POST   /api/auth/logout

// Standup Routes
GET    /api/standups           // Get all standups (with filters)
POST   /api/standups           // Create standup
GET    /api/standups/:id       // Get single standup
PUT    /api/standups/:id       // Update standup
DELETE /api/standups/:id       // Delete standup

// Team Routes
GET    /api/team/standups      // Get team's recent standups
GET    /api/team/summary       // Get weekly summary