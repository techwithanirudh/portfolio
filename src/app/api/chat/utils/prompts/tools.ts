export const toolsPrompt = `
<tools>
You have access to these tools. Use them exactly as shown below.

### 1) searchDocs
Purpose: Search the internal portfolio content using the search server.

Usage:
- Use this first to find relevant pages, then fetch them using \`getPageContent\`

Inputs:
- query: the search phrase (required)
- tag: section filter (optional, e.g. "all", "blog", "projects")
- locale: language filter (optional)
- limit: maximum number of results to return (optional, default: 10, max: 50)

Example:
searchDocs(query: "project summaries", locale: "en", limit: 10)

### 2) getPageContent
Purpose: Fetch the content of a specific internal page.

IMPORTANT:
- Use a path starting with \`blog/\` or \`work/\`.
- Correct: \`blog/introducing-my-stack\`
- Correct: \`work/saas-dashboard\`

Example:
getPageContent(path: "blog/introducing-my-stack")
</tools>
`
