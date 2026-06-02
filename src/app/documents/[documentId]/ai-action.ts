"use server";

/**
 * Direct fetch integration with the Google Gemini 1.5 Flash API.
 * This runs securely on the server side to protect API keys.
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
    return "";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 100,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status} - ${errorText}`);
      return "";
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return resultText ? resultText.trim() : "";
  } catch (error) {
    console.error("Failed to connect to Gemini API:", error);
    return "";
  }
}

/**
 * Generates an inline autocompletion suggestion based on document context.
 */
export async function getSmartComposeSuggestion(context: string): Promise<string> {
  if (!context || context.trim().length === 0) {
    return "";
  }

  const prompt = `You are an inline text autocomplete assistant (like Google Docs Smart Compose).
Given the following context from a document, predict the most logical, natural, and immediate next 1 to 5 words to complete the current sentence.

STRICT CONSTRAINTS:
- Return ONLY the exact predicted trailing characters (words, spaces, or punctuation).
- Do NOT include any quotation marks, introductory text, explanations, formatting, markdown, or meta-comments.
- Return empty text if you are not highly confident.

Context of the document:
"""
${context}
"""
`;

  return await callGeminiAPI(prompt);
}

/**
 * Rewrites or modifies selected document text based on a user instruction.
 */
export async function getAIPromptResponse(
  selectedText: string,
  userInstruction: string
): Promise<string> {
  const prompt = `You are a helpful AI writing assistant integrated into a collaborative rich text editor.
The user has highlighted the following text:
"${selectedText}"

They want you to perform the following action:
"${userInstruction}"

Please return the resulting text.
STRICT CONSTRAINTS:
- Return ONLY the resulting text.
- Do NOT include any comments, introductory text ("Here is your text:"), or meta-notes.
- Maintain any standard paragraph structures.
`;

  return await callGeminiAPI(prompt);
}
