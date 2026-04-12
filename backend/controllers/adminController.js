import * as analyticsService from '../services/analyticsService.js'

export const getAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAnalytics()
    res.json(data)
  } catch (error) {
    next(error)
  }
}