import { ChatSession } from "@google/generative-ai";
import { InfectionSchema } from "./ZodSchema";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const data = InfectionSchema.safeParse(await req.json());
    if (!data.success) {
      return Response.json(data.error.errors.map((x) => ({ error: x.path[0], message: x.message })), {
        status: 400
      });
    }
    const { location, file } = data.data;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    const prompt = `You are a dermatology AI assistant. Your task is to analyze the provided skin image for possible infections or skin conditions. The image shows a skin issue located at: **${location}**.

    ### Instructions:
    1. **Analyze the Image**: Carefully examine the skin image for signs of infection or other dermatological conditions.
    2. **Provide a Detailed Analysis**: Include the following in your response:
       - **Possible Conditions**: List potential skin conditions or infections based on the visual analysis.`;
    const image = {
      inlineData: {
        data: file.split(",")[1],
        mimeType: file.split(",")[0].split(":")[1].split(";")[0],
      },
    };
    const generationConfig = {
      temperature: 1.5,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        "type": "object",
        "properties": {
          "possible_diseases": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "probability": {
                  "type": "number"
                }
              },
              "required": [
                "name", "description", "probability"
              ]
            }
          },
        },
        "required": [
          "possible_diseases"
        ]
      }
    };
    const chatSession: ChatSession = model.startChat({
      generationConfig,
    });

    const result = await chatSession.sendMessage([prompt, image]);
    return Response.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("Error processing request:", error);
  }
}
