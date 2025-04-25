##Backend Architecture (Node.js + TypeScript)

src/
  ├── controllers/
  │   ├── authController.ts
  │   └── standupController.ts
  ├── models/
  │   ├── User.ts
  │   └── Standup.ts
  ├── middleware/
  │   ├── auth.ts
  │   └── validation.ts
  ├── routes/
  │   ├── auth.ts
  │   └── standups.ts
  └── utils/
      └── dateHelpers.ts