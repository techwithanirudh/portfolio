# unstable_cache to 'use cache': deferred

Owner decision (pick 18): moving the `unstable_cache` calls to the `'use cache'` directive is deferred for now.

- `'use cache'` needs `cacheComponents` turned on in `next.config.ts`, which changes caching and prerendering for the whole app, so it should land as one change that moves every call site together.
- The call sites are the GitHub feed (`src/app/(home)/about/_components/feed/data.ts`), the guestbook queries (`src/server/db/queries/guestbook.ts`) and `src/lib/github-*.ts`.
- The `TODO(slopradar)` markers on those call sites were already removed during the sweep, so this note is the only record of the follow-up.
