import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Getting results from database")
    const supabase = await createClient()

    const { data: answers, error } = await supabase
      .from("user_answers")
      .select("*")
      .order("answered_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching results:", error)
      return NextResponse.json({ error: "Error fetching results" }, { status: 500 })
    }

    console.log("[v0] Raw answers from database:", answers)

    const questionResults: Record<string, Record<string, number>> = {}
    const textResponses: Record<string, string[]> = {}

    answers?.forEach((answer) => {
      const questionId = answer.question_id.toString()
      const selectedOption = answer.selected_option.toString()

      if (!questionResults[questionId]) {
        questionResults[questionId] = {}
      }

      if (answer.text_response) {
        if (!textResponses[questionId]) {
          textResponses[questionId] = []
        }
        textResponses[questionId].push(answer.text_response)
      } else {
        // For multiple choice, count the selected options
        if (!questionResults[questionId][selectedOption]) {
          questionResults[questionId][selectedOption] = 0
        }
        questionResults[questionId][selectedOption]++
      }
    })

    console.log("[v0] Processed question results:", questionResults)
    console.log("[v0] Text responses:", textResponses)

    return NextResponse.json({
      success: true,
      results: questionResults,
      textResponses: textResponses,
      totalAnswers: answers?.length || 0,
      rawAnswers: answers,
    })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
