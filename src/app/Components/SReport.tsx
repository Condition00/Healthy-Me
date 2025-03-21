"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

const symptomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age is required"),
  gender: z.enum(["male", "female", "other"]),
  symptoms: z.array(
    z.object({
      name: z.string().min(1, "Symptom name required"),
      duration: z.string().min(1, "Symptom duration required"),
    })
  ),
  duration: z.string().min(1, "Duration required"),
  medical_history: z.array(z.string().min(1, "Medical history required")),
});

export default function SymptomCheckerForm() {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "male" as "male"|"female"|"other",
      symptoms: [{ name: "", duration: "" }],
      duration: "",
      medical_history: [""],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "symptoms" });

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
  
      const queryString = new URLSearchParams({ data: JSON.stringify(result) }).toString();
      router.push(`/PReport?${queryString}`); 
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit form. Please try again.");
    } 
  };
  return (
    <div className="max-w-lg mx-auto space-y-6 mt-5">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mt-">Pre-Diagnosis Report</h2>

      {/* Form Card */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <h3 className="text-xl font-semibold">Enter Your Details</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Enter your name" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Age */}
            <div>
              <Label htmlFor="age">Age</Label>
              <Input type="number" id="age" {...register("age", { valueAsNumber: true })} placeholder="Enter your age" />
              {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select {...register("gender")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
            </div>

            {/* Symptoms */}
            <div>
              <Label>Symptoms</Label>
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2">
                  <Input placeholder="Symptom" {...register(`symptoms.${index}.name` as const)} />
                  <Input placeholder="Duration" {...register(`symptoms.${index}.duration` as const)} />
                  <Button type="button" className="hover:cursor-pointer" onClick={() => remove(index)} variant="destructive">✕</Button>
                </div>
              ))}
              <Button type="button" onClick={() => append({ name: "", duration: "" })} className="mt-2 hover:cursor-pointer">
                + Add Symptom
              </Button>
            </div>

            {/* Duration */}
            <div>
              <Label htmlFor="duration">Overall Duration</Label>
              <Input id="duration" {...register("duration")} placeholder="E.g., 3 days, 1 week" />
              {errors.duration && <p className="text-red-500 text-sm">{errors.duration.message}</p>}
            </div>

            {/* Medical History */}
            <div>
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea 
                  id="medical_history" 
                  {...register("medical_history", {
                    setValueAs: (v) => (typeof v === "string" ? v.split(",").map(item => item.trim()) : [])
                  })} 
                  placeholder="E.g., Diabetes, Hypertension (separate with commas)" 
                />
              {errors.medical_history && <p className="text-red-500 text-sm">{errors.medical_history.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full hover:cursor-pointer bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
