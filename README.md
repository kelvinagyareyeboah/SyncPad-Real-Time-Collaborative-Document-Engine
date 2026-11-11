

#syncpad/
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
