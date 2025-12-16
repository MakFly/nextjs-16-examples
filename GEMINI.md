# Project Context: Next.js 16 Tutorials

## Project Overview
This project is a comprehensive collection of tutorials and examples built with **Next.js 16** and **React 19**. It demonstrates modern patterns for the App Router, Server Components, State Management, and Form Handling.

**Primary Goals:**
- Demonstrate specific Next.js/React features (Server Actions, `useOptimistic`, etc.).
- Showcase integrations with popular libraries (Zustand, TanStack Query, Zod).
- Maintain compatibility with Static Export (`output: 'export'`) constraints where possible.

## Tech Stack

### Core Frameworks
- **Next.js:** v16.0.10 (App Router)
- **React:** v19.2.3
- **TypeScript:** v5.2
- **Runtime:** Node.js (with Bun or pnpm potentially used for package management)

### UI & Styling
- **Tailwind CSS:** v4.0.0 (using `@tailwindcss/postcss`)
- **Shadcn/UI:** Component primitives located in `components/ui/`
- **Styling Utilities:** `clsx` + `tailwind-merge` (via `lib/utils.ts`)
- **Icons:** Lucide React

### State & Data
- **Global State:** Zustand (`lib/stores/`)
- **Server State:** TanStack Query v5 (`app/tanstack-query/`)
- **Forms:** React Hook Form + Zod (`app/react-hook-form/`, `app/zod/`)

### Internationalization (i18n)
- **Library:** `next-intl` v4.6
- **Strategy:** Client-side centric to support static export.
- **Key Files:**
  - `messages/*.json`: Translation strings.
  - `components/locale-provider.tsx`: Manages locale state (localStorage/Cookie).
  - `i18n/request.ts`: Server-side configuration (with fallbacks for static generation).

## Architecture & Conventions

### Directory Structure
- `app/`: Application routes. Each folder (e.g., `tanstack-query`, `zustand`) represents a specific tutorial module.
- `components/`:
  - `ui/`: Reusable UI components (Shadcn).
  - `*-provider.tsx`: Global providers (Theme, Locale, Query Client).
- `lib/`:
  - `api/`: Mock API calls.
  - `stores/`: Zustand stores.
  - `hooks/`: Custom React hooks.
  - `validations/`: Zod schemas.
- `AI-DD/`: Documentation and design documents.

### Development Guidelines
1.  **Package Manager:** Project contains both `bun.lock` and `pnpm-lock.yaml`. Verify preferred manager (likely Bun given `bun.lock`).
2.  **Commands:**
    - `npm run dev` / `bun dev`: Start development server.
    - `npm run build` / `bun build`: Build for production.
3.  **Static Export Constraints:**
    - Avoid `headers()`, `cookies()`, and API Routes (`app/api/`) in logic intended for static pages.
    - Use Client Components for interactive features and reading cookies/headers dynamically.
4.  **Component Strategy:**
    - Prefer **Server Components** for layout and initial data fetching where possible.
    - Use **Client Components** (`'use client'`) for interactivity, state, and `useTranslations`.

## Key Patterns

### I18n Usage
Use `useTranslations` in Client Components:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Example() {
  const t = useTranslations('Namespace');
  return <div>{t('key')}</div>;
}
```

### Server Actions
Located in `app/server-actions/`. Ensure they degrade gracefully or are used in contexts compatible with the deployment target.

### Styling
Use the `cn` utility for conditional classes:
```tsx
import { cn } from "@/lib/utils"
<div className={cn("base-class", condition && "active-class")} />
```
