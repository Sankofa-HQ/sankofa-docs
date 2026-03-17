# Sankofa Documentation Site

The **Sankofa Documentation** is a high-performance, developer-centric documentation portal built with Next.js 16 and MDX. This site serves as the official guide for implementing, hosting, and scaling the Sankofa analytics platform.

---

## ✨ Features

- **MDX-Driven Content**: All documentation is written in Markdown with JSX support, allowing for interactive components like `CodeTabs` and `Alerts`.
- **Lightning Fast**: Built with Next.js 16 App Router and Turbopack for the ultimate developer experience.
- **Modern Typography**: Carefully curated fonts and layouts for maximum readability.
- **Tailwind CSS 4**: Uses the latest styling utilities for a clean, consistent design system.
- **SEO Optimized**: Automated metadata generation for every documentation page.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js 20+**
- **NPM**

### 2. Installation
```bash
npm install --legacy-peer-deps
```

### 3. Run Development Server
```bash
npm run d
```

The documentation site will be available at [http://localhost:3002](http://localhost:3002).

---

## 📂 Project Structure

- `/app`: Next.js App Router structure for metadata, layout, and page routing.
- `/content`: **Where all documentation lives.** Organized by categories (SDK, Self-Hosting, Usage, etc.).
- `/components`: Reusable UI elements for MDX (e.g., `<CodeTabs />`, `<Steps />`, `<Callout />`).
- `/lib`: Logic for parsing MDX files and handling front-matter.
- `/public`: Static images and documents.

---

## ✍️ Adding Content

To add or edit documentation:

1. Navigate to the `/content` directory.
2. Find the relevant folder (e.g., `sdk`) or create a new one.
3. Create a `.mdx` file.
4. Add the required front-matter:
   ```mdx
   ---
   title: "My New Guide"
   description: "Learn how to use X feature."
   ---
   ```
5. Your changes will be reflected in real-time if the dev server is running.

---

## 📦 Build & Deployment

The documentation is built as a **Static Export**, making it easy to host on any CDN or static file host (S3, Vercel, Netlify).

### Build Procedure
```bash
npm run build
```

The output will be generated in the `/out` directory.

### Preview Build
```bash
npm run start
```

---

## 🛡 License

This project is licensed under the MIT License.
