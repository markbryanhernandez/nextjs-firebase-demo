# Next.js Firebase Auth Demo

A modern authentication demo app built with [Next.js](https://nextjs.org) and [Firebase Authentication](https://firebase.google.com/docs/auth). Includes sign up, login, and protected routes using idiomatic Next.js App Router patterns and TypeScript.

## Features

- Email/password authentication with Firebase
- Protected routes and user session management
- Accessible, responsive UI with Tailwind CSS
- Linting and formatting with ESLint and Prettier
- Performance and accessibility best practices

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the project root with the following:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build for production
- `npm start` – Start the production server
- `npm run lint` – Run ESLint
- `npm run format` – Format code with Prettier

## Authentication

- Uses Firebase Auth for secure email/password authentication.
- All sensitive config is loaded from environment variables.

## Accessibility & Performance

- Semantic HTML, ARIA attributes, and keyboard navigation
- Optimized images and code splitting with dynamic imports
- Bundle analysis with `@next/bundle-analyzer` (run with `ANALYZE=true npm run build`)

## License

MIT
