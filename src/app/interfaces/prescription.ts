export interface Prescription {
    medicines: Medicine[];
}

export interface Medicine {
    name: string;
    description: string;
    dosage: string;
    usage: string;
    composition: string;
    side_effects: string[];
}