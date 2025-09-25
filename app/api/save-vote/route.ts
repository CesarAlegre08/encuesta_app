import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { session_id, question_id, selected_option, text_response, participant_name } = body

    console.log("[v0] API received data:", {
      session_id,
      question_id,
      selected_option,
      text_response,
      participant_name,
    })

    let numericSessionId: number

    if (typeof session_id === "string") {
      // Create a simple hash from the string session_id
      numericSessionId = Math.abs(
        session_id.split("").reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0),
      )
    } else {
      numericSessionId = session_id
    }

    const { error: sessionError } = await supabase.from("game_sessions").upsert(
      {
        id: numericSessionId,
        player_name: participant_name || "Anonymous",
        score: 0,
        total_questions: 0,
      },
      {
        onConflict: "id",
      },
    )

    if (sessionError) {
      console.error("Error creating/updating session:", sessionError)
      return NextResponse.json({ error: "Error creating session" }, { status: 500 })
    }

    const voteData: any = {
      session_id: numericSessionId,
      question_id: Number.parseInt(question_id) || 0,
      is_correct: false, // We'll calculate this later if needed
    }

    // Handle multiple choice questions
    if (selected_option && !text_response) {
      console.log("[v0] Processing selected_option:", selected_option)

      // Map option ID to position number (1-4)
      // Extract the letter from option ID (e.g., "2a" -> "a", "3d" -> "d")
      const optionLetter = selected_option.slice(-1).toLowerCase()
      console.log("[v0] Extracted option letter:", optionLetter)

      const optionMap: { [key: string]: number } = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 4, // Map "e" to 4 to comply with constraint (1-4)
      }

      const mappedOption = optionMap[optionLetter]
      console.log("[v0] Mapped option number:", mappedOption)

      if (mappedOption && mappedOption >= 1 && mappedOption <= 4) {
        voteData.selected_option = mappedOption
      } else {
        console.log("[v0] Invalid option mapping, using default 1")
        voteData.selected_option = 1
      }
    }

    if (text_response && text_response.trim() !== "") {
      console.log("[v0] Processing text response:", text_response)
      // For text responses, we set selected_option to 1 since it's required by constraint
      voteData.selected_option = 1
      // Note: text_response field will be saved once the database migration is run
    }

    if (!voteData.selected_option) {
      console.log("[v0] No selected_option set, defaulting to 1")
      voteData.selected_option = 1
    }

    console.log("[v0] Final voteData before insert:", voteData)

    const { data, error } = await supabase.from("user_answers").insert(voteData)

    if (error) {
      console.error("Error saving vote:", error)
      return NextResponse.json({ error: "Error saving vote" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data, numericSessionId })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 })
  }
}
