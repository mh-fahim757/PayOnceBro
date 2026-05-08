import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config({ path: new URL('../../.env', import.meta.url) })

const apiKey = process.env.GEMINI_API_KEY

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set. Gemini features will use fallback responses.')
}

const client = apiKey ? new GoogleGenerativeAI(apiKey) : null

const model = client
  ? client.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash' })
  : null

export default model