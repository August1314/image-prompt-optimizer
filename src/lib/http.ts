type JsonLikeResponse = Pick<Response, 'ok'> &
  Partial<Pick<Response, 'text' | 'json'>> & {
    status?: number
  }

export async function readJsonSafely<T>(
  response: JsonLikeResponse,
  fallbackError: string,
): Promise<T & { error?: string }> {
  if (typeof response.text === 'function') {
    const text = await response.text()

    if (!text) {
      return {} as T & { error?: string }
    }

    try {
      return JSON.parse(text) as T & { error?: string }
    } catch {
      if (!response.ok) {
        return {
          error: fallbackError,
        } as T & { error?: string }
      }

      throw new Error(fallbackError)
    }
  }

  if (typeof response.json === 'function') {
    try {
      return (await response.json()) as T & { error?: string }
    } catch {
      if (!response.ok) {
        return {
          error: fallbackError,
        } as T & { error?: string }
      }

      throw new Error(fallbackError)
    }
  }

  if (!response.ok) {
    return {
      error: fallbackError,
    } as T & { error?: string }
  }

  throw new Error(fallbackError)
}
