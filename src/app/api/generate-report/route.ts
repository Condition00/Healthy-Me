import { InputStructure } from "../../interfaces/report-input";
import { generateReportSchema } from "./zodSchema";
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

export async function POST(req: Request) {
  const data = generateReportSchema.safeParse(await req.json());
  if(!data.success) {
    return Response.json(data.error.errors.map((x) => ({error: x.path[0],message:x.message})),{
      status: 400
    });
  }
  const {
    name,
    age,
    gender,
    symptoms,
    duration,
    medical_history,
  } = data.data;
  const prompt = generatePrompt({
    name,
    age,
    gender,
    symptoms,
    duration,
    medical_history,
  });
  const report = await generateReport(prompt);
  return Response.json(report);
}

function generatePrompt({
  name,
  age,
  gender,
  symptoms,
  duration,
  medical_history,
}: InputStructure): string {
  const prompt = `
    Patient: ${name}
    Age: ${age}
    Gender: ${gender}
    Symptoms: ${symptoms
      .map(({ name, duration }) => `${name} for ${duration}`)
      .join(", ")}
    Duration: ${duration}
    Medical History: ${medical_history.join(", ")}
    `;
  return prompt;
}

async function generateReport(input: string) {
  const generationConfig = {
    temperature: 0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        age: {
          type: "number",
        },
        gender: {
          type: "string",
        },
        symptoms: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              duration: {
                type: "string",
              },
            },
            required: ["name", "duration"],
          },
        },
        possible_diseases: {
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
              probability: {
                type: "number",
              },
            },
            required: ["name", "description", "probability"],
          },
        },
        recommended_medications: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              dosage: {
                type: "string",
              },
            },
            required: ["name", "dosage"],
          },
        },
        recommended_tests: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              check_for: {
                type: "string",
              },
            },
            required: ["name", "check_for"],
          },
        },
        medical_history: {
          type: "array",
          items: {
            type: "string"
          }
        },
        additional_notes: {
          type: "string",
        }
      },
      required: [
        "name",
        "age",
        "gender",
        "symptoms",
        "possible_diseases",
        "recommended_medications",
      ],
    },
  };
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `
                    You are an AI medical assistant. The user will provide input including symptoms, their duration, age, gender, and any existing medical conditions. Based on this information, generate a structured JSON response with the following fields:

summary: A concise summary of the user's symptoms.
possible_diseases: An array of possible diseases or conditions that could match the symptoms. Each disease should include a name and an optional confidence_score (0 to 1).
possible_medications: An array of suggested medications or treatments for the possible diseases. Each medication should include name, purpose, and dosage (if applicable).
recommended_tests: An array of suggested diagnostic tests, including name and reason for recommending the test.
additional_notes: Any additional insights or important considerations based on age, gender, or medical history.
`,
          },
        ],
      }
    ],
  });

  const result = await chatSession.sendMessage(input);
  return JSON.parse(result.response.text());
}
