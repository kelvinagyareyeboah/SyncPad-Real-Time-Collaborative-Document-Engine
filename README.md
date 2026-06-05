<div align="center">

```
███████╗██╗   ██╗███╗   ██╗ ██████╗██████╗  █████╗ ██████╗ 
██╔════╝╚██╗ ██╔╝████╗  ██║██╔════╝██╔══██╗██╔══██╗██╔══██╗
███████╗ ╚████╔╝ ██╔██╗ ██║██║     ██████╔╝███████║██║  ██║
╚════██║  ╚██╔╝  ██║╚██╗██║██║     ██╔═══╝ ██╔══██║██║  ██║
███████║   ██║   ██║ ╚████║╚██████╗██║     ██║  ██║██████╔╝
╚══════╝   ╚═╝   ╚═╝  ╚═══╝ ╚═════╝╚═╝     ╚═╝  ╚═╝╚═════╝ 
```

**Real-time collaborative document engine · CRDT conflict resolution · live cursors · version history · AI smart compose**

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white&labelColor=161b22)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white&labelColor=161b22)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white&labelColor=161b22)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white&labelColor=161b22)](https://tailwindcss.com)
[![Convex](https://img.shields.io/badge/Convex-serverless_DB-ee342f?style=flat-square&labelColor=161b22)](https://convex.dev)
[![Liveblocks](https://img.shields.io/badge/Liveblocks-CRDT_sync-ff5c00?style=flat-square&labelColor=161b22)](https://liveblocks.io)
[![TipTap](https://img.shields.io/badge/TipTap-rich_editor-1a1a2e?style=flat-square&labelColor=161b22)](https://tiptap.dev)
[![License](https://img.shields.io/badge/License-MIT-bc8cff?style=flat-square&labelColor=161b22)](./LICENSE)

</div>

---

## `$ whoami`

**SyncPad** is a Google Docs-grade collaborative document engine built on a modern serverless stack. It uses **CRDT-based conflict resolution** via Liveblocks + Yjs — meaning no merge conflicts, no locking, no last-write-wins data loss. Multiple users edit simultaneously with live cursors, shared margin state, AI-assisted writing, and full snapshot version history with word-level diff visualization.

> *"Not a demo. A production-grade real-time document system."*

---

## `$ ls features/`

| Feature | Details |
|---|---|
| 🔄 **Real-Time Collaboration** | CRDT sync via Liveblocks Yjs — no conflicts, no locks, no bottleneck |
| ✍️ **Rich Text Editor** | TipTap with headings, tables, images, task lists, links, font size, line height |
| 🧠 **Smart Compose** | AI-assisted writing extension built directly into the editor |
| 🕓 **Version History** | Snapshot revisions with **word-level LCS diff** visualization |
| 🖥️ **Zen Mode** | Distraction-free writing via Zustand-powered UI state |
| 📐 **Live Margin Control** | Drag-to-resize margins synced across all collaborators via Liveblocks Storage |
| 📁 **Document Management** | Create, rename, delete, and search across all documents |
| 🔐 **Lightweight Identity** | Fast local name-prompt with persistent `localStorage` session support |

---

## `$ cat ARCHITECTURE.md`

```
┌──────────────────────────────────────────────────────────────┐
│                          Browser                             │
│                                                              │
│      Next.js 15 (App Router)  +  TipTap Editor              │
│               │                        │                     │
│               │              Liveblocks Yjs (CRDT)           │
│               │              Live Cursors · Shared Storage   │
│               └──────────────┬──────────┘                    │
└──────────────────────────────│──────────────────────────────-┘
                               │
              ┌────────────────┴─────────────────┐
              │                                  │
      [ Convex Backend ]              [ Liveblocks Cloud ]
      Documents · Revisions           Real-time CRDT sync
      Members · Users DB              Cursor broadcast
```

### How conflict resolution works

SyncPad uses **CRDTs** (Conflict-free Replicated Data Types) via Liveblocks + Yjs — not Operational Transformation.

```
User A  ──── types "hello" ────►  Liveblocks  ◄──── types "world" ──── User B
                                   Yjs merges
                               ◄── "hello world" ──►
                               (deterministic, no conflict)
```

- Every character has a globally unique ID `(authorId + logicalClock)`
- Concurrent inserts at the same position resolve **deterministically** by comparing IDs
- Deletions are **tombstoned**, not removed — guaranteeing convergence across all peers
- No central lock, no transformation pipeline, no race conditions

Shared UI state (margins, zen mode, etc.) lives in **Liveblocks Storage** — also CRDT-based.

---

## `$ ls project/`

```
syncpad/
├── src/
│   ├── app/
│   │   ├── (home)/              # Dashboard & document listing
│   │   ├── api/                 # API routes (Liveblocks auth, etc.)
│   │   ├── documents/           # Editor page [documentId]
│   │   └── sign-in/             # Redirect fallback sign-in page
│   ├── components/              # Shared UI (shadcn/ui + custom)
│   ├── extensions/              # Custom TipTap extensions
│   │   ├── font-size.ts
│   │   ├── line-height.ts
│   │   └── smart-compose.ts     # AI smart compose
│   ├── hooks/                   # use-debounce, use-mobile, use-search-param
│   ├── lib/
│   │   ├── diff.ts              # LCS word-diff for revision history
│   │   └── utils.ts
│   └── store/                   # Zustand (editor, revision, zen mode)
│
└── convex/
    ├── schema.ts                # Database schema
    ├── documents.ts             # Document CRUD
    ├── revisions.ts             # Snapshot & revision history
    ├── members.ts               # Document membership & access
    └── users.ts                 # Demo user queries
```

---

## `$ cat INSTALL.md`

### Prerequisites

| Requirement | Notes |
|---|---|
| Node.js 18+ | [nodejs.org](https://nodejs.org) |
| Convex account | [convex.dev](https://convex.dev) — free tier available |
| Liveblocks account | [liveblocks.io](https://liveblocks.io) — free tier available |

---

### Step 1 — Clone & install

```bash
git clone https://github.com/your-username/syncpad.git
cd syncpad
npm install
```

---

### Step 2 — Environment variables

Create `.env.local` in the project root:

```env
# Convex — from your Convex dashboard
NEXT_PUBLIC_CONVEX_URL=your-convex-deployment-url

# Liveblocks — from your Liveblocks dashboard → API Keys
LIVEBLOCKS_SECRET_KEY=your-liveblocks-secret-key
```

---

### Step 3 — Convex setup

```bash
npx convex dev
```

> This deploys your schema and starts the serverless database. Keep this terminal running alongside `npm run dev`.

---

### Step 4 — Run

```bash
npm run dev
```

> App starts at `http://localhost:3000`

---

## `$ cat VERIFY.md`

```
[1]  Open  →  http://localhost:3000
[2]  Create a new document
[3]  Open the same document URL in a second browser tab
[4]  Type in one tab  →  changes appear instantly in the other
[5]  Move your cursor  →  live cursor visible across sessions
[6]  Drag a margin handle  →  margin syncs to the other tab
[7]  Save a revision snapshot  →  open Version History
[8]  Compare revisions  →  word-level LCS diff renders inline
[9]  Trigger Smart Compose  →  AI suggestions appear in editor
```

---

## `$ cat package.json | jq '.dependencies'`

| Package | Purpose |
|---|---|
| `next` 15 | App Router framework |
| `react` 19 | UI layer |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first styling |
| `convex` | Serverless database + real-time queries |
| `@liveblocks/react` | CRDT sync, live cursors, shared storage |
| `@tiptap/react` | Rich text editor core |
| `@tiptap/extension-*` | Headings, tables, images, task lists, links |
| `zustand` | Client-side UI state (zen mode, revision panel) |
| `shadcn/ui` | Accessible component primitives |

---

## `$ cat ROADMAP.md`

```
[✓] CRDT real-time collaboration (Liveblocks + Yjs)
[✓] Rich text editing (TipTap)
[✓] Live cursors across sessions
[✓] Shared margin control via Liveblocks Storage
[✓] Snapshot version history
[✓] Word-level LCS diff visualization
[✓] AI Smart Compose extension
[✓] Zen mode (Zustand)
[✓] Document CRUD + search (Convex)
[ ] Clerk / Auth.js authentication
[ ] Document sharing via invite link
[ ] Comments + threaded annotations
[ ] Export to PDF / Markdown / DOCX
[ ] Offline mode + local-first sync
[ ] Multiplayer presence avatars
[ ] Document templates gallery
[ ] Mobile editor support
```

---

## `$ cat LICENSE`

MIT License — © 2025 [Agyare Kelvin Yeboah](https://kelvinagyareyeboah.me)

Free to use, modify, and distribute with attribution.

---

## `$ whoami --links`

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-kelvinagyareyeboah-161b22?style=flat-square&logo=github&logoColor=white)](https://github.com/kelvinagyareyeboah)
[![Twitter](https://img.shields.io/badge/Twitter-@_yo_kelvin-161b22?style=flat-square&logo=x&logoColor=white)](https://x.com/_yo_kelvin)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-agyarekelvinyeboah-0a66c2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/agyarekelvinyeboah)
[![Website](https://img.shields.io/badge/Website-kelvinagyareyeboah.me-3fb950?style=flat-square&logo=safari&logoColor=white)](https://kelvinagyareyeboah.me)
[![Zoharix](https://img.shields.io/badge/Company-zoharix.tech-bc8cff?style=flat-square&logo=vercel&logoColor=white)](https://zoharix.tech)

---

*built with intention by [@kelvinagyareyeboah](https://github.com/kelvinagyareyeboah) · co-founder @ [Zoharix](https://zoharix.tech)*

</div>
