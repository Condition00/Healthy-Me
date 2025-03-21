import { ChatSession } from "@google/generative-ai";
import { PrescriptionSchema } from "./ZodSchema";

const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);
export async function POST(req: Request) {
  try {
    const data = PrescriptionSchema.safeParse(await req.json());
    if (!data.success) {
      return Response.json(data.error.errors.map((x) => ({ error: x.path[0], message: x.message })), {
        status: 400
      });
    }
    const { file } = data.data;
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `You are a medical assistant AI. Your task is to analyze the provided prescription and provide a detailed breakdown of each medicine listed. For each medicine, include the following information:

1. **Medicine Name**: The name of the medicine as written in the prescription.
2. **Description**: A brief description of what the medicine is used for.
3. **Usage**: Detailed instructions on how the medicine should be used (e.g., frequency, timing, with or without food, etc.).
4. **Composition**: The active ingredients and their quantities in the medicine.
5. **Dosage**: The recommended dosage for the patient, including any adjustments based on age, weight, or medical conditions.`;

    const image = {
      inlineData: {
        data: file.split(",")[1],
        mimeType: "image/jpeg",
      },
    };
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          medicines: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                dosage: {
                  type: "string",
                },
                usage: {
                  type: "string",
                },
                composition: {
                  type: "string",
                },
                side_effects: {
                  type: "array",
                  items: {
                    type: "string",
                  },
              },
            },
              required: ["name", "description", "dosage", "usage", "composition","side_effects"],
            },
          },
        },
        required: ["medicines"],
      },
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
