interface Symptom {
    name: string;
    duration: string;
  }
  
  export interface PossibleDisease {
    name: string;
    description: string;
    probability: number;
  }
  
  interface RecommendedMedication {
    name: string;
    dosage: string;
  }
  
  interface RecommendedTest {
    name: string;
    check_for: string;
  }
  
export interface PreDiagnosisSummary {
    name: string;
    age: number;
    gender: string;
    symptoms: Symptom[];
    possible_diseases: PossibleDisease[];
    recommended_medications: RecommendedMedication[];
    recommended_tests?: RecommendedTest[];
    additional_notes?: string;
    medical_history: string[]
  }
  