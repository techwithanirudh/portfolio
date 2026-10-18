export const markdownResponse = (text: string) =>
  new Response(text, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
    },
  })
