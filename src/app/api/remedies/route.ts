import { RemediesSchema } from "./ZodSchema";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export async function POST(req: Request) {
  const data = RemediesSchema.safeParse(await req.json());
  if (!data.success) {
    return Response.json(
      data.error.errors.map((x) => ({ error: x.path[0], message: x.message })),
      {
        status: 400,
      }
    );
  }
  const { description } = data.data;
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        description: {
          type: "string",
        },
        remedies: {
          type: "array",
          items: {
            type: "object",
            properties: {
              remedy: {
                type: "string",
              },
              instructions: {
                type: "string",
              },
            },
            required: ["remedy", "instructions"],
          },
        },
      },
      required: ["description", "remedies"],
    },
  };
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Given the following description of a condition, ailment, or problem, provide effective remedies. The remedies should be natural, medical, or lifestyle-based, depending on the context. Include step-by-step instructions, ingredients (if applicable), and additional precautions or alternative options. If the problem is severe, suggest consulting a professional.",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(`Description: ${description}`);
  return Response.json(JSON.parse(result.response.text()));
}
