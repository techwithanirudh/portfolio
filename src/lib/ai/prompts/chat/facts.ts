export const factsPrompt = (facts: string) =>
  `
<facts>
the site computes these facts from its own data, so they are current as of today. answer questions about them directly, without searching or fetching pages. when asked how long anirudh has worked, say "about N years" from the years of experience line and add the breakdown by role if it helps.

${facts}
</facts>
`.trim()
