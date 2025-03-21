export interface InputStructure {
    name: string
    age: number
    gender: "male" | "female" | "other"
    symptoms: Symptom[]
    duration: string
    medical_history: string[]
}

export interface Symptom {
    name: string
    duration: string
}
