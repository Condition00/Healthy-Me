"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React from "react";
import Header from "../Components/Header";

const symptomSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export default function SymptomCheckerForm() {
  const router = useRouter();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(symptomSchema),
    defaultValues: {
      description: "",   
     },
  });
  
  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/remedies", {
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
      router.push(`/RReport?${queryString}`);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <>
    <Header/>
    <div className="max-w-lg mx-auto space-y-6 mt-5">
      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-blue-700 mt-">Find Remedies</h2>

      {/* Form Card */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <h3 className="text-xl font-semibold">Enter Your Details</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                  id="description" 
                  {...register("description", {
                    setValueAs: (v) => (typeof v === "string" ? v : "")
                  })} 
                  placeholder="Describe your condition as much as you can." 
                />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>
            {/* Submit Button */}
            <Button type="submit" className="w-full hover:cursor-pointer bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}