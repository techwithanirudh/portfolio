export const markdownResponse = (text: string, status = 200) =>
  new Response(text, {
    headers: {
      'Content-Type': 'text/markdown;charset=utf-8',
      Vary: 'Accept',
    },
    status,
  })
