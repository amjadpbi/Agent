# 🏪 ShopAgent MVP

> AI-powered invoice processing and ledger management for shopkeepers — built for the hackathon.

**🔗 Live Demo:** https://amjadpbi.github.io/Agent/

---

## 📌 What It Does

ShopAgent helps small shopkeepers digitize their supplier invoices and query business insights using natural language — no accounting background required.

| Feature | Description |
|---|---|
| 📄 **Process Bill** | Upload or demo-extract a supplier invoice using AI |
| 🗂️ **Ledger Schema** | Define your own custom data structure (or import from CSV template) |
| 🔀 **Field Mapping** | Map AI-extracted fields to your destination structure with auto-suggestions |
| 📊 **Business Data** | View and search all mapped records in your schema's format |
| 🤖 **ShopAgent AI** | Ask natural-language questions about your inventory and expenses |
| 📥 **CSV Export** | Export your ledger in exactly your schema's field order |

---

## 🧠 Architecture

```
Invoice (image/demo)
    ↓ AI Extraction
Raw Fields (Supplier, Date, Items...)
    ↓ Field Mapping (Mapping.tsx)
MappedRecord (stored in localStorage)
    ↓ Normalization Layer (store.tsx)
Invoice[] → ShopAgent AI (existing BI engine)
```

The **normalization layer** ensures the AI query engine always receives a consistent `Invoice[]` format regardless of the user's custom schema — zero breaking changes to the AI logic.

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# → http://localhost:5173
```

Or just double-click `start.bat`.

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Recharts** (charts)
- **React Router v6** (routing)
- **localStorage** (persistence — no backend needed)

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── LedgerSchema.tsx   # Schema builder & CSV import
│   ├── ProcessBill.tsx    # Invoice upload & schema selection
│   ├── Mapping.tsx        # Field mapping UI
│   ├── BusinessData.tsx   # Dynamic table + CSV export
│   └── ShopAgent.tsx      # NLP AI query engine
├── lib/
│   ├── store.tsx          # Global state + normalization layer
│   └── types.ts           # TypeScript interfaces
└── components/
    └── Layout.tsx         # Sidebar navigation
```

---

## 🔄 CI/CD

Deployed automatically to **GitHub Pages** via GitHub Actions on every push to `main`.

Workflow: `.github/workflows/deploy.yml`
