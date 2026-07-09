// Timed dismissal — a dismissed prompt stays hidden for `ttlMs`, then reappears.
export const DAY_MS = 24 * 60 * 60 * 1000

export function isDismissed(key, ttlMs = DAY_MS) {
  const ts = Number(localStorage.getItem(key))
  return Boolean(ts) && Date.now() - ts < ttlMs
}

export function dismissFor(key) {
  localStorage.setItem(key, String(Date.now()))
}
