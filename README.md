# Copyright Music Detection Platform

A comprehensive Next.js web application designed to help users detect copyright music. This platform offers scanning capabilities, detailed results, and subscription plans, fully internationalized for English and German users.


## 🚀 Tech Stack

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) (with RTK Query)
- **Internationalization:** [next-intl](https://next-intl-docs.vercel.app/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Package Manager:** pnpm

## ✨ Features

- **Music Copyright Scanning:** Analyze audio/video for copyright issues.
- **Multilingual Support:** Full content localization in English (`en`) and German (`de`).
- **User Authentication:** Secure Login, Signup, Password Reset, and OTP Verification.
- **Subscription Management:** View and manage subscription plans and invoices.
- **Responsive Design:** Optimized for desktop and mobile devices.
- **Dynamic Blogs & FAQs:** Content managed via API integration.

## 📂 Project Structure

```bash
├── app/
│   └── [locale]/          # Localized App Router pages
│       ├── blog/          # Blog listing and details
│       ├── checkout/      # Payment flow
│       ├── mysubscription/# User subscription management
│       ├── results/       # Scan results and history
│       ├── scan/          # Main scanning interface
│       ├── store/         # Redux store and API integration
│       └── ...            # Auth pages (login, signup, etc.)
├── components/
│   ├── ui/                # Reusable Shadcn UI components (buttons, cards, etc.)
│   ├── header.tsx         # Global navigation
│   ├── hero.tsx           # Landing page hero section
│   └── ...                # Feature-specific components
├── hooks/                 # Custom React hooks
├── i18n/                  # Internationalization configuration (request, routing)
├── messages/              # Translation JSON files (en.json, de.json)
├── public/                # Static assets (images, icons)
├── redux/                 # Global state management
│   ├── api/               # RTK Query API definitions
│   └── slices/            # Redux slices (auth, etc.)
├── proxy.ts               # Middleware proxy for Auth & Locale handling
└── next.config.mjs        # Next.js configuration
```

## 🛠️ Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TAIJULAMAN/copywright-music-detect-website.git
    cd copywright-music-detect-website
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add necessary variables (e.g., API endpoints, Auth secrets).

4.  **Run the development server:**

    ```bash
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📜 Scripts

- `pnpm dev`: Runs the development server.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code quality.

## 🌐 Internationalization

This project uses `next-intl`. Translations are stored in the `messages/` directory:

- `messages/en.json`: English translations
- `messages/de.json`: German translations

Routing is handled via `app/[locale]/` to ensure SEO-friendly localized URLs.
