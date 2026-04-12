import { Router } from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { restrictTo } from '../middleware/roleMiddleware.js'
import { getAnalytics } from '../controllers/adminController.js'

const router = Router()

router.get('/analytics', protect, restrictTo('admin'), getAnalytics)

export default router