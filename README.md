This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase accounts

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key from **Project Settings → API**.
3. Run `supabase/migrations/202607160001_fittrack_accounts.sql` in the Supabase SQL editor.
4. In **Authentication → URL Configuration**, set the Site URL and allow `http://localhost:3000/auth/callback` and `https://YOUR_DOMAIN/auth/callback`.
5. Keep email confirmation enabled and configure custom SMTP before production use.
6. In **Authentication → Password Security**, require at least eight characters and enable stronger character requirements.

Passwords are handled by Supabase Auth and never stored in FitTrack's public tables. Supabase stores salted bcrypt password hashes in its protected `auth` schema. Application data is stored in Postgres tables protected by Row Level Security, restricting every row to its owner.
