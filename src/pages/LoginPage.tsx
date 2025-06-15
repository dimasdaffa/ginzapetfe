"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = loginSchema.safeParse(formData)
    if (!validation.success) {
      setFormErrors(validation.error.issues)
      return
    }

    setFormErrors([])
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user session (replace with actual API call)
      localStorage.setItem("user", JSON.stringify({ email: formData.email }))

      // Navigate to dashboard or home
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen mx-auto w-full bg-[#F4F5F7]">
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="image"
          className="h-[350px] sm:h-[400px] lg:h-[450px] xl:h-[500px] w-full object-cover object-bottom"
        />
      </div>

      <section id="NavTop" className="fixed left-0 right-0 top-[16px] z-30 transition-all duration-300">
        <div className="relative mx-auto max-w-[640px] lg:max-w-4xl xl:max-w-6xl px-4 sm:px-5 xl:px-8">
          <div className="relative flex h-[68px] items-center justify-center rounded-[22px] transition-all duration-300">
            <Link to={"/"} className="absolute left-0 transition-all duration-300">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white">
                <img src="/assets/images/icons/back.svg" alt="icon" className="h-[22px] w-[22px] shrink-0" />
              </div>
            </Link>
            <h2 className="font-semibold text-base sm:text-lg xl:text-xl text-white transition-all duration-300">
              Sign In
            </h2>
          </div>
        </div>
      </section>

      <div className="relative pt-[120px] sm:pt-[140px] lg:pt-[160px] flex flex-col px-4 sm:px-5 pb-5">
        <div className="max-w-md mx-auto w-full lg:max-w-lg xl:max-w-xl">
          <header className="text-center mb-8 sm:mb-10 xl:mb-12">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[38px] font-extrabold leading-[39px] sm:leading-[45px] lg:leading-[51px] xl:leading-[57px] text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white text-sm sm:text-base xl:text-lg">Sign in to continue to your account</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 xl:space-y-8">
            <section className="flex flex-col gap-4 xl:gap-6 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6">
              <div className="space-y-4 xl:space-y-6">
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Email Address</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <input
                      required
                      value={formData.email}
                      onChange={handleChange}
                      name="email"
                      type="email"
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>
                  {formErrors.find((error) => error.path.includes("email")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("email"))?.message}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Password</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <input
                      required
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-12 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[12px] sm:right-[14px] xl:right-[16px] top-1/2 -translate-y-1/2 p-1"
                    >
                    </button>
                  </div>
                  {formErrors.find((error) => error.path.includes("password")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("password"))?.message}
                    </p>
                  )}
                </label>
              </div>
            </section>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#d14a1e] py-3 sm:py-[14px] xl:py-4 font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80] hover:bg-[#c1431a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center">
              <p className="text-[#d14a1e] text-sm sm:text-base xl:text-lg">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
