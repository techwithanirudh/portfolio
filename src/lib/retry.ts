interface RetryOptions {
  attempts: number
  baseDelayMs: number
  shouldRetry: (error: unknown) => boolean
}

export const retryWithBackoff = async <T>(
  task: () => Promise<T>,
  { attempts, baseDelayMs, shouldRetry }: RetryOptions
): Promise<T> => {
  let lastError: unknown

  // Sequential await inside the loop is intentional: each retry must wait for
  // the previous attempt to fail (and its back-off delay to elapse) before
  // trying again. Parallelising with Promise.all would defeat the purpose.
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await task()
    } catch (error) {
      lastError = error

      if (!shouldRetry(error) || attempt === attempts) {
        break
      }

      await delay(baseDelayMs * attempt)
    }
  }

  throw lastError
}

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
