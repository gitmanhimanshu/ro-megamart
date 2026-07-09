const DEFAULT_GLOBAL_SEND_URL =
  'https://d6e4-2401-4900-8f5c-2fce-bdae-a602-d7ee-5f2a.ngrok-free.app'

const ALLOWED_GLOBAL_SEND_ORIGINS = new Set([
  'https://d6e4-2401-4900-8f5c-2fce-bdae-a602-d7ee-5f2a.ngrok-free.app',
])

function parseUrl(value) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

export function getGlobalSendUrl() {
  const configuredUrl = import.meta.env.VITE_GLOBAL_SEND_URL || DEFAULT_GLOBAL_SEND_URL
  const parsedUrl = parseUrl(configuredUrl)

  if (!parsedUrl || !ALLOWED_GLOBAL_SEND_ORIGINS.has(parsedUrl.origin)) {
    return null
  }

  return parsedUrl.toString().replace(/\/$/, '')
}

export async function sendGlobalMessage(payload) {
  const endpoint = getGlobalSendUrl()

  if (!endpoint) {
    throw new Error('Global send URL is not configured or allowed.')
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Global send failed with status ${response.status}.`)
  }

  return response
}
