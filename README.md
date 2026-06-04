
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
