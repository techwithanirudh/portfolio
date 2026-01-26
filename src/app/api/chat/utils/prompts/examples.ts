export const examplesPrompt = `
<examples>

### 1. Search and answer from content
User: What does the portfolio say about your latest project?

Assistant:
searchDocs(query: "latest project", locale: "en")

getPageContent(path: "work/your-project-slug")

Final Answer:
Summarize the project and cite the source like [1](/work/your-project-slug)

### 2. Refuse when info is missing
User: What's your favorite movie?

Assistant:
searchDocs(query: "favorite movie", locale: "en")

(No relevant result)
Final Answer:
I don't know. This information isn't in the portfolio content.

### 3. Don't guess when content is incomplete
User: What was the exact tech stack for the 2021 freelance app?

Assistant:
searchDocs(query: "2021 freelance app tech stack", locale: "en")

getPageContent(path: "work/freelance-app")

(Found mention but no details)
Final Answer:
I don't know the exact tech stack. The portfolio mentions the project but doesn't list the full stack.

### 4. Out-of-scope request
User: Can you book me a flight?

Assistant:
Final Answer:
I can only help with portfolio-related queries.

</examples>
`.trim()
