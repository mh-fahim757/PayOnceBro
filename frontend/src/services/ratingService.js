import api from './api'

/**
 * Create a restaurant or rider rating
 * POST /api/ratings or POST /api/ratings/rider
 */
export const createRating = async (data) => {
  try {
    const endpoint = data.riderId ? '/ratings/rider' : '/ratings'
    const response = await api.post(endpoint, data)
    return response.data
  } catch (error) {
    console.error('Error creating rating:', error)
    // Throw more descriptive error for duplicate ratings
    if (error.response?.status === 409) {
      throw { message: 'You already rated this delivery before. Thank you!' }
    }
    throw error.response?.data || error
  }
}

/**
 * Get ratings for a restaurant
 * GET /api/ratings/restaurant/:id
 */
export const getRestaurantRatings = async (restaurantId) => {
  try {
    const response = await api.get(`/ratings/restaurant/${restaurantId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching restaurant ratings:', error)
    throw error.response?.data || error
  }
}

/**
 * Add response to a restaurant rating
 * POST /api/ratings/:id/response
 */
export const addRatingResponse = async (ratingId, responseText) => {
  try {
    const response = await api.post(`/ratings/${ratingId}/response`, {
      responseText,
    })
    return response.data
  } catch (error) {
    console.error('Error adding rating response:', error)
    throw error.response?.data || error
  }
}
