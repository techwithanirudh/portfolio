export const llmsPrompt = (llms: string) =>
  `
<context>
You are given a list of pages that you can use to answer the user's question.
You can discover pages with \`searchDocs\` and fetch specific content with \`getPageContent\`.

ALWAYS consider the following pages when answering:

${llms}
</context>
`.trim()
