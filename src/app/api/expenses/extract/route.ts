import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { imageUrl } = await req.json()

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: `Extract the following information from this receipt image: ${imageUrl}
    1. Total amount
    2. Date of purchase
    3. Merchant name
    4. List of items purchased (if available)
    
    Format the response as JSON with keys: amount, date, merchant, items`,
  })

  const extractedData = JSON.parse(text)

  return NextResponse.json(extractedData)
}

