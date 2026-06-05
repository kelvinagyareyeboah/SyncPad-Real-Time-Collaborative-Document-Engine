ttps://github.com/your-username/
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
