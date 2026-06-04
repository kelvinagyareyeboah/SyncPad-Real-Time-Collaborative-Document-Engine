s&logoColor=white)](https://liveblocks.io)
[![TipTap](https://img
> A Google Docs-ative editor with CRDT-based conflict resolution, live cursors, 

## ✦ Features

| | Feature | Details |
|---|---|---|
| 🔄 | **Real-Time Collaboration** | CRDT-based sync via Liveblocks Yjs — no conflicts, no locks |
| ✍ | **Rich Text Editor** | TipTap with headings, tables, images, task lists, links & more |
| 🔐 | **Lightweight Identity** | Fast local name-prompt system with persistent `localStorage` session support |
| 📁 | **Document Management** | Create, rename, delete, and search documents |
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
│        └──────────────┬───────────┼─────────────────────┘
│                       │           │
│                       ▼           ▼
│                 Convex Backend  Liveblocks Cloud
│               (DB & API Queries) (Real-Time Sync)
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
│   │   └── sign-in/         # Redirect fallback sign-in page
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
    ├── members.ts           # Document membership & access queries
    └── users.ts             # Demo user queries
```

---

## 🚀 Getting Started

### Prerequisites

- [Convex](https://convex.dev) account
- [Liveblocks](https://liveblocks.io) account

### 1 — Install

```bash
git clone https://github.com/your-username/syncpad.git
cd syncpad
npm install
```

### 2 — Environment Variables

Create `.env.local` in the root:

```env
# Convex URL (obtained from Convex setup)
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Liveblocks Secret Key (obtained from Liveblocks Dashboard)
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
```

### 3 — Convex Setup

Run the Convex development server. This will deploy the schema and start your serverless database:

```bash
npx convex dev
```

### 4 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
  <sub>Built with Next.js · Convex · Liveblocks · TipTap</sub>
</div>
