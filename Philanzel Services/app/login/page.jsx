"use client"
import React, { useState, useEffect } from "react"
import Navigation from "@/components/navigation.jsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Footer from "../home/footer"
import { isUserLoggedIn, getLoggedInUser, logoutUser } from "../../utils/auth"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const checkLoginStatus = () => {
      if (isUserLoggedIn()) {
        setLoggedIn(true)
        setUser(getLoggedInUser())
      }
    }
    checkLoginStatus()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Login failed. Please check your credentials.")
      }

      localStorage.setItem("authToken", data.data.token)
      localStorage.setItem("user", JSON.stringify(data.data.user))
      router.push("/")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation loggedIn={loggedIn} user={user} onLogout={handleLogout} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          {loggedIn && user ? (
            <Card className="border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-serif font-bold">You are already logged in</CardTitle>
                <CardDescription className="font-sans">
                  Welcome back, {user.name || user.email}!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                >
                  Go to Homepage
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full">
                  Logout
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-cyan-600" />
                </div>
                <h2 className="text-3xl font-serif font-black text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600 font-sans">Sign in to access your investment portfolio</p>
              </div>

              {/* Login Form */}
              <Card className="border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-serif font-bold">Sign In</CardTitle>
                  <CardDescription className="font-sans">
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 font-sans">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm font-sans"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 font-sans">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm font-sans"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked)}
                        />
                        <Label htmlFor="remember-me" className="text-sm text-gray-600 font-sans">Remember me</Label>
                      </div>

                      <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 font-sans font-medium">
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 font-sans"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                      {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500 font-sans">
                      Don't have an account?{" "}
                      <Link href="/register" className="font-medium text-cyan-600 hover:text-cyan-700">
                        Create one now
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {/* Security Notice */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 font-sans">
              Your data is protected with bank-level security. We never share your personal information.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div >
  )
}
