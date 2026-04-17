import { useEffect, useState } from 'react'
import { getMyOrders } from '../../services/orderService'
import RatingModal from '../../components/user/RatingModal'
import { toast } from 'sonner'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    orderId: null,
    riderId: null,
  })
  const [dismissedOrders, setDismissedOrders] = useState(new Set())

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders()
        setOrders(Array.isArray(data) ? data : [])
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load your orders.')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  const handleRateRider = (orderId, riderId) => {
    setRatingModal({
      isOpen: true,
      orderId,
      riderId,
    })
  }

  const handleRatingSubmitted = () => {
    toast.success('Thank you for rating!')
    setRatingModal({ isOpen: false, orderId: null, riderId: null })
  }

  const handleDismissRating = (orderId) => {
    setDismissedOrders(prev => new Set([...prev, orderId]))
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading orders...</div>
  }

  if (orders.length === 0) {
    return <div className="p-6 text-sm text-gray-500">No orders yet.</div>
  }

  return (
    <>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-800">Order {order.id.slice(0, 8)}</p>
              <span className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                {String(order.status || '').replaceAll('_', ' ')}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Total: ৳{Number(order.total_price || 0).toFixed(0)}</p>
              <p>Delivery fee: ৳{Number(order.delivery_fee || 0).toFixed(0)}</p>
            </div>
            
            {/* Rate Rider Button */}
            {order.status === 'delivered' && order.rider_id && !dismissedOrders.has(order.id) && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => handleRateRider(order.id, order.rider_id)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
                >
                  ⭐ Rate Rider
                </button>
                <button
                  onClick={() => handleDismissRating(order.id)}
                  className="text-lg text-gray-500 hover:text-red-500 hover:bg-red-50 rounded px-2 py-1 transition duration-200"
                  title="Dismiss rating"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        orderId={ratingModal.orderId}
        riderId={ratingModal.riderId}
        type="rider"
        onClose={() => setRatingModal({ isOpen: false, orderId: null, riderId: null })}
        onDismiss={() => ratingModal.orderId && handleDismissRating(ratingModal.orderId)}
        onSubmit={handleRatingSubmitted}
      />
    </>
  )
}

export default Orders
