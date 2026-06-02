<div align="center">

<img src="public/logo.svg" alt="SyncPad Logo" width="72" height="72" />

# SyncPad

### Real-Time Collaborative Document Engine

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Convex](https://img.shields.io/badge/Convex-EE342F?style=for-the-badge&logo=convex&logoColor=white)](https://convex.dev)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-FF5C00?style=for-the-badge&logo=liveblocks&logoColor=white)](https://liveblocks.io)
[![TipTap](https://img.shields.io/badge/TipTap-1A1A2E?style=for-the-badge&logo=tiptap&logoColor=white)](https://tiptap.dev)

<br/>

> A Google Docs-like collaborative editor with CRDT-based conflict resolution, live cursors, version history, and organizational support — built on a modern serverless stack.

<br/>

</div>

---

## ✦ Features

| | Feature | Details |
|---|---|---|
| 🔄 | **Real-Time Collaboration** | CRDT-based sync via Liveblocks Yjs — no conflicts, no locks |
| ✍️ | **Rich Text Editor** | TipTap with headings, tables, images, task lists, links & more |
| 🔐 | **Authentication** | Clerk with org support — sign in, teams, and permissions |
| 📁 | **Document Management** | Create, rename, delete, search — personal & org-scoped |
| 🕓 | **Version History** | Snapshot revisions with word-level LCS diff visualization |
| 🧠 | **Smart Compose** | AI-assisted writing extension built into the editor |
| 🖥️ | **Zen Mode** | Distraction-free writing with Zustand-powered UI state |
| 📐 | **Live Margin Control** | Drag-to-resize margins synced across collaborators via Liveblocks Storage |

---

## ⚙️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│   Next.js 15 (App Router)  +  TipTap Editor             │
│        │                          │                     │
│        │                   Liveblocks Yjs (CRDT)        │
│        │                   Live Cursors / Storage       │
└────────┼──────────────────────────┼────────────────────-┘
         │                          │
    Convex Backend            Liveblocks Cloud
    (DB + API + Auth)         (Real-Time Sync)
         │
    Clerk (Auth + Orgs)
```

### How Conflict Resolution Works

SyncPad uses **CRDTs** (Conflict-free Replicated Data Types) via Liveblocks + Yjs — not Operational Transformation.

- Every character has a globally unique ID `(authorId + logicalClock)`
- Concurrent inserts at the same position resolve deterministically by comparing IDs
- Deletions are **tombstoned**, not removed — guaranteeing convergence across all peers
- No central lock, no transformation functions, no bottleneck

```
User A  ──── types "hello" ────►  Liveblocks  ◄──── types "world" ──── User B
                                  Yjs merges
                              ◄── "hello world" ──►
```

Shared UI state (margins, etc.) lives in **Liveblocks Storage** — also CRDT-based.

---

## 🗂️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── (home)/          # Dashboard & document listing
│   │   ├── api/             # API routes (Liveblocks auth, etc.)
│   │   ├── documents/       # Editor page [documentId]
│   │   └── sign-in/         # Auth pages
│   ├── components/          # Shared UI components (shadcn/ui + custom)
│   ├── extensions/          # Custom TipTap extensions
│   │   ├── font-size.ts
│   │   ├── line-height.ts
│   │   └── smart-compose.ts
│   ├── hooks/               # use-debounce, use-mobile, use-search-param…
│   ├── lib/
│   │   ├── diff.ts          # LCS word-diff algorithm for revision history
│   │   └── utils.ts
│   └── store/               # Zustand stores (editor, revision, zen mode)
│
└── convex/
    ├── schema.ts            # Database schema
    ├── documents.ts         # Document CRUD
    ├── revisions.ts         # Snapshot & revision history
    ├── members.ts           # Org membership
    ├── users.ts             # User records
    └── auth.config.ts       # Clerk JWT config
```

---

## 🚀 Getting Started

### Prerequisites

- [Convex](https://convex.dev) account
- [Clerk](https://clerk.com) account
- [Liveblocks](https://liveblocks.io) account

### 1 — Install

```bash
git clone https://github.com/your-username/syncpad.git
cd syncpad
npm install
# if you hit peer dep conflicts:
npm install --legacy-peer-deps
```

### 2 — Environment Variables

Create `.env.local` in the root:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Liveblocks
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
```

### 3 — Convex Setup

```bash
npm install -g convex
npx convex dev
```

In your **Convex Dashboard → Settings → Authentication**, add Clerk as a provider:
- Domain: `https://your-clerk-domain.clerk.accounts.dev`
- Application ID: `convex`

Update `convex/auth.config.ts`:

```ts
export default {
  providers: [{
    domain: "https://your-clerk-domain.clerk.accounts.dev",
    applicationID: "convex"
  }]
}
```

### 4 — Clerk Setup

1. Enable **Organizations** in Configure → Organizations
2. Create a **JWT Template** named `convex` with these claims:

```json
{
  "aud": "convex",
  "name": "{{user.full_name}}",
  "email": "{{user.primary_email_address}}",
  "picture": "{{user.image_url}}",
  "organization_id": "{{org.id}}"
}
```

### 5 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
  <sub>Built with Next.js · Convex · Liveblocks · Clerk · TipTap</sub>
</div>
