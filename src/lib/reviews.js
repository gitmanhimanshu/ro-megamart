/**
 * reviews.js — localStorage-backed review system.
 * Reviews are submitted by anyone (logged in or not), stored with status
 * "pending", and only visible on the frontend once an admin/seller marks
 * them "approved".
 */

const STORAGE_KEY = 'rmg_reviews'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function save(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}

/** Submit a new review (always starts as "pending"). */
export function submitReview({ sellerId, sellerName, name, phone, rating, comment }) {
  const reviews = load()
  reviews.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    sellerId,
    sellerName,
    name: name.trim(),
    phone: phone.trim(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment.trim(),
    status: 'pending', // pending | approved | rejected
    createdAt: Date.now(),
  })
  save(reviews)
}

/** Get approved reviews for a seller (shown on public profile). */
export function getApprovedReviews(sellerId) {
  return load().filter((r) => r.sellerId === sellerId && r.status === 'approved')
}

/** Get all reviews for a seller (shown in seller dashboard). */
export function getSellerReviews(sellerId) {
  return load().filter((r) => r.sellerId === sellerId)
}

/** Get all pending reviews (admin dashboard). */
export function getPendingReviews() {
  return load().filter((r) => r.status === 'pending')
}

/** Approve or reject a review by id. */
export function updateReviewStatus(reviewId, status) {
  const reviews = load()
  const idx = reviews.findIndex((r) => r.id === reviewId)
  if (idx !== -1) {
    reviews[idx].status = status
    save(reviews)
  }
}

/** Count pending reviews for a seller. */
export function pendingReviewCount(sellerId) {
  return load().filter((r) => r.sellerId === sellerId && r.status === 'pending').length
}
