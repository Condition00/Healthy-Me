"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Upload,
  ImageIcon,
  X,
  Send,
  Camera,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import Header from "../Components/Header"
import { Medicine, Prescription } from "../interfaces/prescription"

export default function PrescriptionReader() {
  const [image, setImage] = useState<string | null>(null)
  const [analysis,setAnalysis] = useState<Array<Medicine>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64Image = reader.result as string
        setImage(base64Image)

        // Make POST request to /api/analyze-prescription
        const response = await fetch('/api/analyze-prescription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ file: base64Image }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Analysis result:', data)
          setAnalysis(data.medicines as Medicine[]);
          console.log(analysis)
          // Handle the analysis result here
        } else {
          console.error('Failed to analyze prescription')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-5xl print:py-2">
        <div className="text-center mb-10 print:hidden">
          <h1 className="text-3xl font-bold mb-3 gradient-heading">Prescription Reader</h1>
          <p className="text-muted-foreground">
            Upload an image of your prescription for analysis and get a detailed report
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="gradient-border h-full">
              <CardHeader>
                <CardTitle>Upload Prescription</CardTitle>
              </CardHeader>
              <CardContent>
                {!image ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 1.5,
                      }}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-teal-500" />
                    </motion.div>
                    <p className="text-muted-foreground mb-2">Drag and drop your prescription image here</p>
                    <p className="text-sm text-muted-foreground mb-4">or</p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="rounded-full">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Select Image
                      </Button>
                      <Button variant="outline" className="rounded-full">
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt="Prescription"
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-lg object-contain max-h-[300px]"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={() => setImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="gradient-border h-full">
              <CardHeader>
                <CardTitle>Prescription Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Recommended Medications */}
                <div className="p-4 border rounded-lg shadow-md bg-gray-100">
                  <h3 className="text-xl font-semibold">Medications</h3>
                  <ul>
                    {analysis?.map((medicine) => (
                      <li key={medicine.name} className="mb-4">
                      <div className="p-4 border rounded-lg shadow-md bg-white">
                        <h4 className="text-lg font-bold mb-2">{medicine.name}</h4>
                        <p><strong>Description:</strong> {medicine.description}</p>
                        <p><strong>Dosage:</strong> {medicine.dosage}</p>
                        <p><strong>Usage:</strong> {medicine.usage}</p>
                        <p><strong>Side Effects:</strong> {medicine.side_effects.join(", ")}</p>
                      </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}