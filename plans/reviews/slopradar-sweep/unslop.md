# Unslop pass

Scope: UI copy in `src/`, emails, Simba's prompt and tool descriptions, site constants and page descriptions, MDX under `content/`, and leftover AI-ish comments. Method: `.claude/skills/unslop/SKILL.md`.

Starting state: earlier passes had already removed every em dash and en dash used as punctuation (the only en dash left is the `Aug 2026 – Present` range separator in `src/lib/employment-period.ts`, which is a range, not punctuation). There were no buzzwords from the banned list in copy, and no ALL-CAPS labels other than the three listed under "Left on purpose". So this pass is small: 33 string changes across 15 files.

## Counts

| Area | Changes |
| --- | --- |
| Site constants and page descriptions | 7 |
| UI copy | 2 |
| Emails | 5 |
| Simba prompt (`src/lib/ai/prompts/chat`) | 10 |
| Simba tool descriptions (`src/app/api/chat/utils/tools`) | 6 |
| MDX content | 3 |
| Code comments | 0 |
| Total | 33 |

## Site constants and page descriptions

These feed `llms.txt`, `llms-full.txt`, `about.md`, `contact.md` and Simba's context directly, so no llms route needed its own edit. Verified by fetching each route from the dev server before and after.

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `src/constants/site.ts:10` | Design engineer and full-stack developer who designs and builds web apps with Next.js, React, and TypeScript. | Design engineer and full-stack developer building web apps with Next.js, React, and TypeScript. | "Design engineer ... who designs" repeats itself. Used as the site meta description, the about page description, and the `llms.txt` blockquote. |
| `src/constants/portfolio/faq.ts:11` | I'm focused on shipping personal products, polishing this portfolio, and learning more about scalable web app architecture. | I'm shipping my own products, polishing this portfolio and learning how to build web apps that scale. | "Focused on" restates the question, and "scalable web app architecture" is jargon. Shows on /contact and in `contact.md`. |
| `src/constants/navigation/social.tsx:8` | Check out my open source projects and contributions | My code and open source contributions | Marketing-style call to action. These descriptions only show in `about.md` / `llms-full.txt`. |
| `src/constants/navigation/social.tsx:14` | Follow me for tech updates and project announcements | Posts about what I'm building | Marketing gloss. |
| `src/constants/navigation/social.tsx:20` | Connect with me professionally | My work history | Stock LinkedIn phrase. |
| `src/constants/navigation/social.tsx:26` | Subscribe for tech tutorials and project demos | Tech tutorials and project demos | Dropped the call to action. |
| `src/constants/navigation/social.tsx:33` | Get in touch via email | Write to me directly | Stock phrase. |

## UI copy

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `src/app/(home)/blog/_components/newsletter-section.tsx:15` | Get notified when I publish new posts. No spam, unsubscribe anytime. | An email when I publish a new post. Unsubscribe anytime. | "No spam" is SaaS boilerplate. |
| `src/app/(home)/contact/_components/contact-form.tsx:111` | I will never share your email with anyone else. | I won't share your email with anyone. | Overstated, and stiffer than the rest of the form. |

## Emails

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `emails/newsletter-welcome.tsx:83` (preview) | Thanks for joining my newsletter! | You're subscribed. Here's what I've written so far. | The email said "thanks" three times with three exclamation marks. The preview text now says what's inside. |
| `emails/newsletter-welcome.tsx:96` | Thanks for subscribing to my newsletter! You can expect an email every few weeks. I might also send newsletter-only content now and then. | Thanks for subscribing. Expect an email every few weeks, and now and then something that only goes out to the newsletter. | Dropped the exclamation mark and the hedge ("I might also"), and made it one sentence. |
| `emails/newsletter-welcome.tsx:120` | Thanks for reading! | Thanks for reading, | Now reads as a sign-off before the handwritten name. |
| `emails/newsletter-welcome.tsx:53` | `{description \|\| 'Open the post to read more about this topic.'}` | The description `<Text>` now renders only when the post has a description | The fallback was filler. All three posts have a description today. A post without one now shows only its title and the "Read post" link. |
| `src/lib/resend.ts:97` (subject) | Welcome to my newsletter! | Welcome to my newsletter | Dropped the exclamation mark. |

## Simba prompt

Wording only. No rule was added or removed, and no tool name, schema, XML tag or step number changed. Simba's voice examples (`examples.ts`, the refusal examples, `personality.ts`, `core.ts`) are untouched.

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `src/lib/ai/prompts/chat/directives.ts:5` | only provide information you can verify from the portfolio content | only state what you can find in the portfolio content | Plainer. |
| `src/lib/ai/prompts/chat/directives.ts:6` | never invent, assume, or extrapolate facts about anirudh | never invent or guess facts about anirudh | Three near-synonyms became two plain words. |
| `src/lib/ai/prompts/chat/directives.ts:7` | if the content doesn't have the answer, say "i don't know" honestly | if the content doesn't have the answer, say "i don't know" | "honestly" adds nothing. |
| `src/lib/ai/prompts/chat/directives.ts:9` | never fabricate information that could affect anirudh's reputation | never make up anything that could hurt anirudh's reputation | Plain words. "hurt" is the intended direction. |
| `src/lib/ai/prompts/chat/directives.ts:11` | for business deals, confirmations, or sensitive matters, direct users to contact anirudh | for business deals, confirmations or sensitive matters, tell the user to contact anirudh | Plainer verb. |
| `src/lib/ai/prompts/chat/directives.ts:26` | 4. otherwise use searchDocs to find relevant pages, then getPageContent to fetch the actual content | 4. otherwise use searchDocs to find the pages, then getPageContent to read them | Dropped "relevant" and "actual". |
| `src/lib/ai/prompts/chat/directives.ts:60` | - request is completely unrelated to the portfolio | - request has nothing to do with the portfolio | Dropped the intensifier. |
| `src/lib/ai/prompts/chat/directives.ts:66` | - keep it brief, no lengthy explanations | - keep it short, no long explanations | Plain words. |
| `src/lib/ai/prompts/chat/tools.ts:116` | - user explicitly asks to talk to a human | - user asks to talk to a human | Dropped the adverb. |
| `src/lib/ai/prompts/chat/tools.ts:120` | - user is just asking questions you can answer from the portfolio | - user only asks questions you can answer from the portfolio | "just" is filler. "only" is what it means. |

## Simba tool descriptions

These are the descriptions the model sees. Tool names, input and output schemas, defaults and enums are unchanged.

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `src/app/api/chat/utils/tools/celebrate.ts:7` | ...and rarely otherwise, only for a genuinely great moment, never just to decorate an answer. At most once per reply. | ...and otherwise only rarely, for a great moment, never to decorate an answer. At most once per reply. | Dropped "genuinely" and "just". Same rule. |
| `src/app/api/chat/utils/tools/get-page-content.ts:7` | Get the content of a specific internal page: a blog post, ... | Get the full text of a page on this site: a blog post, ... | "specific internal" is vague. |
| `src/app/api/chat/utils/tools/search-docs.ts:56` | Search the portfolio content using the internal search server. | Search the site's blog posts and projects. | Describes the implementation, not what gets searched. The index holds blog and projects pages only. |
| `src/app/api/chat/utils/tools/search-docs.ts:101` | Optional tag filter. | Limit results to blog posts or projects. Defaults to all. | Says what the tag does. |
| `src/app/api/chat/utils/tools/show-contact-form.ts:14` | Suggested message based on conversation context | A draft message from what the user said in the chat | Plainer. |
| `src/app/api/chat/utils/tools/show-contact-form.ts:19` | Optional prefill data for the form fields based on chat context | Values to prefill in the form, taken from the chat | Plainer. The schema already marks it optional. |

## MDX content

Only clear tells. No facts, links, code, frontmatter or quotes changed. The rest of the posts and all project pages already read in Anirudh's voice.

| File:line | Before | After | Reason |
| --- | --- | --- | --- |
| `content/blog/hello-world.mdx:11` | This site is where I share projects, experiments, and lessons from recent builds and ideas. | This site is where I share my projects and experiments, and what I learn building them. | Rule-of-three padding ("recent builds and ideas"). |
| `content/blog/hello-world.mdx:13` | Expect behind-the-scenes builds, research notes, and demos from my latest work. | Expect behind-the-scenes builds, research notes, and demos. | "from my latest work" is filler. |
| `content/blog/gorkie-sandboxes.mdx:14` | The bot needed to actually execute. | The bot needed to run the code itself. | Dropped the intensifier, and said what it executes. |

The MDX feeds `llms-full.txt`, `/blog.mdx/*` and Simba's search through the same source, so those picked up the change on their own (confirmed in the `llms-full.txt` diff).

## Left on purpose

- **Simba's voice.** Lowercase, "woof", "uwu", ":3", exclamation marks in his lines, the welcome line, toasts ("party time, woof!"), placeholders ("Sniffing for answers…"), the 404 copy ("Simba ate this page"), the prompt examples and the refusal examples. That's the character, not slop.
- **Testimonials** (`src/constants/portfolio/testimonials.ts`). They're real people's words, so I didn't touch them even where they use "very", "Not only... he", or exclamation marks.
- **Uppercase styling.** The search result tag chip (`search-client.tsx:37`), the resume section headings (`resume/page.tsx:33`), and the `404` eyebrow (`not-found-content.tsx:27`, digits only, so `uppercase` does nothing). These are small mono labels styled as such, not shouting copy, and the resume convention is deliberate.
- **Lists of three that are real lists.** Depensa's "run faster, cost less, and are easier to test", Gorkie's "three things stayed constant", the guestbook's "a quick hello, a thought about the work, or a suggestion", and the FAQ's list. Each item is a distinct, real thing.
- **Gorkie post voice.** "the cracks showed quickly", "We wanted boring infrastructure", "by accident". That's the author's voice, not filler.
- **Exclamation marks in human copy.** "You're subscribed. Thanks for signing up!", "Thanks for signing the guestbook!", "Welcome!" and "Glad you're here!" in hello-world, "thanks for reading!" in the VS Code post. Each one is a single natural exclamation, not spam.
- **Developer-facing errors** in `src/app/api/chat/route.ts` ("An unknown error occurred.", and others). The chat UI never shows them. `ReplyError` shows its own "Simba lost the scent." line.
- **Moderation prompt.** Already plain, and it's strict on purpose.
- **Code comments.** A grep for the AI-vocabulary list found nothing in comments. The "Journey timeline adapted from braydoncoyer.dev" attribution comment is a credit, so it stays.

## Seen, not in scope

- `src/app/(home)/contact/_components/hero.tsx:33`: a missing space joins two class names in `transition-[color,background-color,scale]text-muted-foreground`, so the hover transition and the muted color likely don't apply. Not a copy issue, so I didn't change it.

## Checks

- `bunx tsc --noEmit -p .`: clean.
- `bunx biome check --write` on the 13 changed source files: formatted 2 (the email preview prop wrap, the email description conditional).
- `bun run check`: clean.
- `bun run check:spelling`: clean, and `.cspell.jsonc` was not touched.
- `bun run check:links`: 0 errors.
- `bun run doctor`: no issues, score 100.
- llms routes: fetched `llms.txt`, `llms-full.txt`, `about.md`, `contact.md`, `uses.md`, `stack.md`, `colophon.md`, `experience.md` and `testimonials.md` from `localhost:3111` before and after. The only diffs are the changed strings above, plus the live GitHub commit list, which isn't part of this change.
