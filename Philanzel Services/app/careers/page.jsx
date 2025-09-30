"use client"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Briefcase, Mail, Clock, Send, MessageSquare, Calendar, ArrowRight, CheckCircle, Building } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import JoinTeam from "./joinTeam"
import Footer from "../home/footer"

export default function CareersPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    message: "",
    resume: null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({ ...prev, resume: file }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitted(true)
  }
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />

        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-serif font-black text-gray-900 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 font-sans mb-8">
              Thank you for your interest in joining our team. We'll review your application and get back to you within 5-7 business days.
            </p>
            <div className="space-y-4">
              <Link href="/">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">Return to Homepage</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsSubmitted(false)}
                className="w-full border-cyan-600 text-cyan-600 hover:bg-cyan-50"
              >
                Submit Another Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-black text-gray-900 mb-6">
              Join Our <span className="text-cyan-600">Team</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-sans">
              Join our team of industry experts and make a meaningful impact. Discover opportunities to grow your career with us in a dynamic & rewarding environment.
            </p> 
          </div>
        </div>
      </section>
      <JoinTeam />
      <Footer />
    </div>
  )
}