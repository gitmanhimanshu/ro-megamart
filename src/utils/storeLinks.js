export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ro_mart.ro_mart'
export const APP_STORE_URL = 'https://apps.apple.com/us/app/romegamart/id6550910373'

export function storeUrlForDevice() {
  if (typeof navigator === 'undefined') return PLAY_STORE_URL
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ? APP_STORE_URL : PLAY_STORE_URL
}
