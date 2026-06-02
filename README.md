# Google Docs Clone

A collaborative document editor built with Next.js, featuring real-time collaboration, authentication, and organizational support. This application provides a Google Docs-like experience with rich text editing, live cursors, comments, and document management.

## Features

- **Real-time Collaboration**: Multiple users can edit documents simultaneously with live cursors and instant updates
- **Rich Text Editor**: Powered by TipTap with support for headings, formatting, tables, images, and more
- **Authentication**: Secure user authentication with Clerk, supporting organizations and personal accounts
- **Document Management**: Create, edit, delete, and organize documents with search functionality
- **Organizational Support**: Share documents within organizations and manage team collaboration
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Template Gallery**: Pre-built document templates for common use cases

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex for real-time database and API
- **Authentication**: Clerk with organization support
- **Real-time Collaboration**: Liveblocks for collaborative editing
- **Editor**: TipTap with collaborative extensions
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand

## Prerequisites

Before setting up the project, ensure you have:

- A Convex account
- A Clerk account
- A Liveblocks account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/Davronov-Alimardon/google-docs.git
cd google-docs-clone
npm install
```

> **Note**: Use `npm install --legacy-peer-deps` flag if you encounter version conflicts during installation.

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Liveblocks
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
```

### 3. Convex Setup

#### Install Convex CLI
```bash
npm install -g convex
```

#### Initialize Convex
```bash
npx convex dev
```

#### Configure Authentication
1. Go to your Convex dashboard
2. Navigate to Settings > Authentication
3. Add Clerk as an authentication provider
4. Use your Clerk domain: `https://your-clerk-domain.clerk.accounts.dev`
5. Set the application ID to: `convex`

#### Deploy Convex Functions
```bash
npx convex deploy
```

### 4. Clerk Setup

#### Create Clerk Application
1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Enable organizations in your Clerk dashboard:
   - Go to Configure > Organizations
   - Enable organizations feature
   - Configure organization settings as needed

#### Configure JWT Template
1. In your Clerk dashboard, go to Configure > JWT Templates
2. Create a new template called `convex`
3. Add the following claims:
```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "nickname": "{{user.username}}",
  "given_name": "{{user.first_name}}",
  "updated_at": "{{user.updated_at}}",
  "family_name": "{{user.last_name}}",
  "phone_number": "{{user.primary_phone_number}}",
  "email_verified": "{{user.email_verified}}",
  "organization_id": "{{org.id}}",
  "phone_number_verified": "{{user.phone_number_verified}}"
}
```

#### Update Convex Auth Config
Update `convex/auth.config.ts` with your Clerk domain:
```typescript
export default {
  providers: [
    {
      domain: "https://your-clerk-domain.clerk.accounts.dev",
      applicationID: "convex"
    }
  ]
}
```

### 5. Liveblocks Setup

#### Create Liveblocks Project
1. Sign up at [liveblocks.io](https://liveblocks.io)
2. Create a new project
3. Get your public and secret keys from the dashboard

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                   # Next.js app directory
│   ├── (home)/            # Home page and document listing
│   ├── api/               # API routes
│   ├── documents/         # Document editing interface
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   └── ...                # Custom components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── store/                 # Zustand stores

convex/
├── documents.ts          # Document CRUD operations
├── schema.ts             # Database schema
└── auth.config.ts        # Authentication configuration
```

## How Real-Time Conflict Resolution Works

This is the most technically interesting part of the project — worth understanding deeply.

### The Problem: Two Users, One Document

Imagine a user in London and a user in New York both have the document open. The London user types `" is great"` at position 5. At the exact same millisecond, the New York user deletes the word at position 3. Both operations are sent to the server. Which one wins? If you apply them naively in arrival order, you get data corruption — the positions are now wrong because each operation was computed against a *different* version of the document.

This is the core distributed systems problem: **concurrent operations on shared mutable state**.

### Operational Transformation (OT) vs. CRDTs

There are two main approaches to solving this:

**Operational Transformation (OT)** — used by Google Docs internally:
- Every operation is transformed against concurrent operations before being applied
- Requires a central server to serialize and transform operations in the correct order
- Complex to implement correctly (the transformation functions must satisfy convergence properties)
- Scales poorly: the server becomes a bottleneck

**Conflict-free Replicated Data Types (CRDTs)** — used in this project via Liveblocks:
- Data structures mathematically guaranteed to converge to the same state regardless of operation order
- No central coordinator needed — every peer can apply operations independently
- For text, Liveblocks uses a variant of **Yjs** (a CRDT library), which represents the document as a sequence of uniquely-identified characters
- Each character gets a globally unique ID (author ID + logical clock). Deletions mark characters as tombstoned rather than removing them immediately
- Because every character has a unique identity, two concurrent inserts at the same position are resolved deterministically by comparing IDs — no transformation needed

### What This Project Does

```
User A (London)          Liveblocks CRDT Layer         User B (New York)
     |                          |                              |
 types "hello"  ──────────────► |  ◄─────────────  types "world"
     |                    merges via Yjs                       |
     |                    (no server lock)                     |
     ◄──────────── "hello world" ──────────────────────────────►
```

- The `useLiveblocksExtension` in [`editor.tsx`](src/app/documents/%5BdocumentId%5D/editor.tsx) binds TipTap to a Liveblocks Yjs document
- `history: false` is set in StarterKit because Yjs manages its own undo/redo history across all collaborators
- `offlineSupport_experimental: true` enables local-first editing — changes are queued and synced when reconnected
- Shared state like margin positions lives in Liveblocks Storage (a CRDT map), so even UI state is conflict-free

### Version History & Diffing

The revision system in [`revision-sidebar.tsx`](src/app/documents/%5BdocumentId%5D/revision-sidebar.tsx) snapshots plain text to Convex. The visual diff uses a custom **Longest Common Subsequence (LCS)** algorithm in [`lib/diff.ts`](src/lib/diff.ts) — the same class of algorithm used by `git diff` — to compute word-level insertions and deletions between any two versions.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
