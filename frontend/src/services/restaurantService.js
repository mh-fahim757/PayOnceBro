import api from './api'

// ─── Onboarding ───────────────────────────────────────────────────────────────

export const createRestaurant = async (fields) => {
  const { data } = await api.post('/restaurants', fields)
  return data.restaurant
}

export const getRestaurantOrders = async () => {
  const { data } = await api.get('/restaurants/orders')
  return data
}

export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(`/restaurants/orders/${orderId}/status`, { status })
  return data
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

export const getMenu = async () => {
  const { data } = await api.get('/restaurants/menu')
  return data // { items, restaurant: { avg_prep_time, max_orders_per_hour } }
}

export const addMenuItem = async (item) => {
  const { data } = await api.post('/restaurants/menu', item)
  return data.item
}

export const updateMenuItem = async (itemId, updates) => {
  const { data } = await api.put(`/restaurants/menu/${itemId}`, updates)
  return data.item
}

export const deleteMenuItem = async (itemId) => {
  await api.delete(`/restaurants/menu/${itemId}`)
}

export const updateRestaurantSettings = async (settings) => {
  const { data } = await api.put('/restaurants/settings', settings)
  return data.restaurant
}

// ─── Public Profile ───────────────────────────────────────────────────────────

export const getProfile = async () => {
  const { data } = await api.get('/restaurants/profile')
  return data.profile
}

export const updateProfile = async (fields) => {
  const { data } = await api.put('/restaurants/profile', fields)
  return data.profile
}

// ─── Reviews / ratings (Member C) ───────────────────────────────────────────

export const getRestaurantReviews = async () => {
  const { data } = await api.get('/restaurants/reviews')
  return data
}

export const addRestaurantReviewResponse = async (ratingId, responseText) => {
  const { data } = await api.post(`/restaurants/reviews/${ratingId}/response`, { responseText })
  return data.review
}
