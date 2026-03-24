import ReviewResponseForm from './ReviewResponseForm'

const renderStars = (score) => '★'.repeat(score) + '☆'.repeat(5 - score)

const ReviewList = ({ reviews, respondingId, onRespond }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
        No reviews yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">{review.reviewer_name || 'Customer'}</p>
              <p className="text-xs text-gray-500">
                {review.created_at ? new Date(review.created_at).toLocaleString() : 'Unknown date'}
              </p>
            </div>
            <p className="text-sm font-semibold text-amber-600" title={`${review.score}/5`}>
              {renderStars(Number(review.score) || 0)}
            </p>
          </div>

          {review.review_text ? (
            <p className="mt-2 text-sm text-gray-700">{review.review_text}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-400 italic">No written comment.</p>
          )}

          {review.restaurant_response ? (
            <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2">
              <p className="text-xs font-semibold text-orange-700">Your response</p>
              <p className="text-sm text-orange-900 mt-1">{review.restaurant_response}</p>
            </div>
          ) : (
            <ReviewResponseForm
              saving={respondingId === review.id}
              onSubmit={(responseText) => onRespond(review.id, responseText)}
            />
          )}
        </article>
      ))}
    </div>
  )
}

export default ReviewList
