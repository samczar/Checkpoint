##Frontend Architecture (React + TypeScript)

src/
  ├── components/
  │   ├── auth/
  │   │   ├── LoginForm.tsx
  │   │   └── SignupForm.tsx
  │   ├── standup/
  │   │   ├── StandupForm.tsx
  │   │   ├── StandupCard.tsx
  │   │   └── StandupList.tsx
  │   ├── team/
  │   │   ├── TeamView.tsx
  │   │   └── UserAvatar.tsx
  │   └── common/
  │       ├── Layout.tsx
  │       ├── Navbar.tsx
  │       └── LoadingSpinner.tsx
  ├── hooks/
  │   ├── useAuth.ts
  │   └── useStandups.ts
  ├── services/
  │   ├── api.ts
  │   └── auth.ts
  ├── types/
  │   └── index.ts
  └── utils/
      └── dateHelpers.ts