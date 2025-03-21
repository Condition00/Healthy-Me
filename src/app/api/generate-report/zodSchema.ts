import { z } from 'zod';

const generateReportSchema = z.object({
    "name": z.string(),
    "age": z.number(),
    "gender": z.enum(["male","female","other"]),
    "symptoms": z.array(z.object({
        "name": z.string(),
        "duration": z.string(),
    })),
    "duration": z.string(),
    "medical_history": z.array(z.string()).default(["none."])
});

export { generateReportSchema };