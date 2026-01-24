# Anirudh's Portfolio

This is my [personal portfolio](https://techwithanirudh.com/) built with Next.js and Fumadocs. It highlights my projects, writing, and experiments in a clean, minimal layout.

## Development

1. Install dependencies:

   ```bash
   bun install
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in the secrets you need for the areas you are working on (auth, email,
   database, analytics).

3. Run the development server:

   ```bash
   bun dev
   ```

Then open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### Environment variables

Environment validation runs on startup via `src/env.ts`, so local dev expects a
`.env.local` file.

```bash
cp .env.example .env.local
```

Fill in the secrets you need for the areas you are working on (auth, email,
database, analytics). If you are just browsing the UI and do not have every secret
yet, you can temporarily set `SKIP_ENV_VALIDATION=true` for builds or CI-only
contexts. Prefer real values when working on features that depend on them.

### Useful commands

- Type generation (run after changing content schema):

  ```bash
  bun run typegen
  ```

- Typecheck:

  ```bash
  bun run typecheck
  ```

- Lint and format (preferred before commits):

  ```bash
  bun x ultracite fix
  ```

- Build the site:

  ```bash
  bun run build
  ```

### Content workflow

- Author docs and posts in `content/`.
- Fumadocs output is generated into `.source/` (do not edit by hand).
- `bun install` runs the MDX sync step automatically.
