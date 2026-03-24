import { useState } from 'react'

const ReviewResponseForm = ({ onSubmit, saving = false }) => {
  const [responseText, setResponseText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!responseText.trim()) {
      setError('Response cannot be empty.')
      return
    }

    await onSubmit(responseText.trim())
    setResponseText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      <textarea
        value={responseText}
        onChange={(e) => setResponseText(e.target.value)}
        rows={3}
        placeholder="Write a response to this review"
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-3 py-1.5 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
      >
        {saving ? 'Posting…' : 'Post response'}
      </button>
    </form>
  )
}

export default ReviewResponseForm
