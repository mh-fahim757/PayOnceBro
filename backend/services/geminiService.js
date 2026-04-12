import model from '../config/gemini.js'

const ALLOWED_TAGS = new Set([
  'vegan',
  'vegetarian',
  'halal',
  'spicy',
  'mild',
  'sweet',
  'gluten-free',
  'dairy-free',
  'high-protein',
  'low-calorie',
])

const MODEL_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS) || 2500

const withTimeout = async (promise, timeoutMs = MODEL_TIMEOUT_MS) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('gemini_timeout')), timeoutMs)
    }),
  ])
}

const extractJsonBlock = (text) => {
  if (typeof text !== 'string') return ''

  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  if (!cleaned) return ''

  if (cleaned.startsWith('{')) {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/)
    return objectMatch?.[0] || cleaned
  }

  if (cleaned.startsWith('[')) {
    const arrayMatch = cleaned.match(/\[[\s\S]*\]/)
    return arrayMatch?.[0] || cleaned
  }

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/)
  if (arrayMatch?.[0]) return arrayMatch[0]

  const objectMatch = cleaned.match(/\{[\s\S]*\}/)
  if (objectMatch?.[0]) return objectMatch[0]

  return cleaned
}

const parseJsonArray = (text) => {
  const block = extractJsonBlock(text)
  if (!block.startsWith('[') || !block.endsWith(']')) return []

  const parsed = JSON.parse(block)
  if (!Array.isArray(parsed)) return []

  return parsed
    .filter((tag) => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => ALLOWED_TAGS.has(tag))
}

export const generateMenuTags = async (name, description) => {
  if (!model) return []

  try {
    const prompt = `Given this menu item:\nName: ${name}\nDescription: ${description || ''}\n\nReturn ONLY a valid JSON array of applicable tags from:\n["vegan", "vegetarian", "halal", "spicy", "mild", "sweet", "gluten-free", "dairy-free", "high-protein", "low-calorie"]\n\nExample: ["halal", "spicy"]`
    const result = await withTimeout(model.generateContent(prompt))
    const text = result.response.text().trim()
    return parseJsonArray(text)
  } catch {
    return []
  }
}

export const generateVibeSummary = async (reviews) => {
  if (!model) return null

  try {
    const prompt = `Summarize these restaurant reviews in ONE sentence of 20 words or less.\nBe specific and honest. Tell a new customer what to expect.\nReviews: ${JSON.stringify((reviews || []).map((r) => r.review_text))}`
    const result = await withTimeout(model.generateContent(prompt))
    return result.response.text().trim()
  } catch {
    return null
  }
}

export const buildCombo = async (userPrompt, menuContext) => {
  if (!model) {
    return { items: [], explanation: 'Could not generate combo. Please try again.' }
  }

  try {
    const prompt = `You are a food ordering assistant. The user wants: "${userPrompt}"\n\nAvailable menu items (JSON):\n${JSON.stringify(menuContext)}\n\nReturn ONLY this exact JSON:\n{\n  "items": [{ "menuItemId": "...", "restaurantId": "...", "quantity": 1 }],\n  "explanation": "One sentence explaining your selection"\n}`

    const result = await withTimeout(model.generateContent(prompt))
    const text = result.response.text().trim()
    const parsed = JSON.parse(extractJsonBlock(text))

    if (!Array.isArray(parsed?.items) || typeof parsed?.explanation !== 'string') {
      return { items: [], explanation: 'Could not generate combo. Please try again.' }
    }

    return parsed
  } catch {
    return { items: [], explanation: 'Could not generate combo. Please try again.' }
  }
}

export const __testables = {
  extractJsonBlock,
  parseJsonArray,
}