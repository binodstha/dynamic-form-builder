# Configurable Dynamic Form Builder

An intuitive, interactive dynamic form builder built with React 19, TypeScript, and Vite. Easily construct complex nested form schemas with live preview, real-time validation, and schema import/export capabilities.

🚀 **Live Demo:** [https://conf-form-builder.vercel.app/](https://conf-form-builder.vercel.app/)

---

## ✨ Features

- **Nested Form Architecture**: Support for recursive group fields and hierarchical form structures.
- **Multiple Field Types**:
  - Text, Number, Textarea
  - Single Checkbox
  - Radio Groups & Select Dropdowns (with configurable options)
  - Field Groups (collapsible and nestable)
- **Interactive Builder Canvas**:
  - Reorder fields up / down
  - Duplicate fields and full sub-trees
  - Add child fields directly to groups
  - Expand / Collapse all groups or individual groups
- **Live Form Preview**:
  - Real-time form rendering as you build
  - Instant validation (required checks, min/max numbers, option selection)
  - Visual error indicators and touched states
  - Form submission with nested payload output
- **Schema Management**:
  - Export configuration as JSON
  - Import existing configurations with schema validation
  - Reset to default templates

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite](https://vite.dev/)
- **Styling**: Vanilla CSS (Custom design system with dark mode aesthetics)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm / yarn)

### Installation

```bash
# Clone the repository
git clone git@github.com:binodstha/dynamic-form-builder.git

# Navigate into project directory
cd dynamic-form-builder

# Install dependencies
pnpm install
```

### Development

```bash
# Start local development server
pnpm run dev
```

### Production Build

```bash
# Type-check and build for production
pnpm run build

# Preview production build locally
pnpm run preview
```

### Linting

```bash
# Run ESLint
pnpm run lint
```

---

## 📄 License

MIT
