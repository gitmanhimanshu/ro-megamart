// Stand-in for a real backend "does this phone number already have an
// account" check — backed by localStorage since this app has no server.
const KEY = 'rmg_registered_phones'
const SEED = ['7080159181', '9648676532'] // demo seller / buyer accounts

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : SEED
  } catch {
    return SEED
  }
}

export function isRegisteredPhone(phone) {
  return load().includes(phone)
}

export function registerPhone(phone) {
  const list = load()
  if (!list.includes(phone)) {
    list.push(phone)
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}
