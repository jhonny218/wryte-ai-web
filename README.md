# Wryte AI - Web Client

> [!NOTE]
> 🚧 **Under Development** 🚧
> This project is currently in the **Phase 2: Project Setup** stage.

## Overview
Wryte AI is an AI-powered blog generator that helps companies create high-quality, SEO-optimized content aligned with their brand voice. This repository (`wryte-ai-web`) contains the frontend application.

## Tech Stack
This project is built with a modern, type-safe stack designed for scalability and performance:

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) (Server State)
- **Routing**: [React Router](https://reactrouter.com/)
- **Authentication**: [Clerk](https://clerk.com/)

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd wryte-ai-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
```
src/
├── components/        # Shared UI components
├── features/          # Feature-based modules (Onboarding, Blog, Dashboard)
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
├── pages/             # Route components
└── types/             # Global TypeScript definitions
```

## Roadmap
- [x] Project Initialization
- [ ] Authentication Setup (Clerk)
- [ ] Onboarding Flow
- [ ] Blog Title Generation
- [ ] Calendar View
- [ ] Blog Layout Editor
- [ ] Full Blog Generation
