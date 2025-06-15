"use client"

import type React from "react"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

// Register form validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    const validation = registerSchema.safeParse(formData)
    if (!validation.success) {
      setFormErrors(validation.error.issues)
      return
    }

    setFormErrors([])
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store user session (replace with actual API call)
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      )

      // Navigate to dashboard or home
      navigate("/")
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen mx-auto w-full bg-[#F4F5F7]">
      {/* Background Image */}
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="image"
          className="h-[350px] sm:h-[400px] lg:h-[450px] xl:h-[500px] w-full object-cover object-bottom"
        />
      </div>

      {/* Navigation */}
      <section id="NavTop" className="fixed left-0 right-0 top-[16px] z-30 transition-all duration-300">
        <div className="relative mx-auto max-w-[640px] lg:max-w-4xl xl:max-w-6xl px-4 sm:px-5 xl:px-8">
          <div className="relative flex h-[68px] items-center justify-center rounded-[22px] transition-all duration-300">
            <Link to={"/"} className="absolute left-0 transition-all duration-300">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white">
                <img src="/assets/images/icons/back.svg" alt="icon" className="h-[22px] w-[22px] shrink-0" />
              </div>
            </Link>
            <h2 className="font-semibold text-base sm:text-lg xl:text-xl text-white transition-all duration-300">
              Sign Up
            </h2>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative pt-[120px] sm:pt-[140px] lg:pt-[160px] flex flex-col px-4 sm:px-5 pb-8">
        <div className="max-w-md mx-auto w-full lg:max-w-lg xl:max-w-xl">
          {/* Header */}
          <header className="text-center mb-6 sm:mb-8 xl:mb-10">
            <h1 className="text-[26px] sm:text-[30px] lg:text-[34px] xl:text-[38px] font-extrabold leading-[39px] sm:leading-[45px] lg:leading-[51px] xl:leading-[57px] text-white mb-2">
              Create Account
            </h1>
            <p className="text-white text-sm sm:text-base xl:text-lg">Sign up to get started with our services</p>
          </header>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 xl:space-y-8">
            <section className="flex flex-col gap-4 xl:gap-6 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6">
              <div className="space-y-4 xl:space-y-6">
                {/* Name Field */}
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Full Name</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <img
                      src="/assets/images/icons/profil-booking-form.svg"
                      alt="icon"
                      className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                    />
                    <input
                      required
                      value={formData.name}
                      onChange={handleChange}
                      name="name"
                      type="text"
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {formErrors.find((error) => error.path.includes("name")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("name"))?.message}
                    </p>
                  )}
                </label>

                {/* Email Field */}
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Email Address</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <img
                      src="/assets/images/icons/amplop-booking-form.svg"
                      alt="icon"
                      className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                    />
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

                {/* Phone Field */}
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Phone Number</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <img
                      src="/assets/images/icons/telepon-booking-form.svg"
                      alt="icon"
                      className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                    />
                    <input
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      name="phone"
                      type="tel"
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {formErrors.find((error) => error.path.includes("phone")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("phone"))?.message}
                    </p>
                  )}
                </label>

                {/* Password Field */}
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Password</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <img
                      src="/assets/images/icons/lock.svg"
                      alt="icon"
                      className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                    />
                    <input
                      required
                      value={formData.password}
                      onChange={handleChange}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-12 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-[12px] sm:right-[14px] xl:right-[16px] top-1/2 -translate-y-1/2 p-1"
                    >
                      <img
                        src={showPassword ? "/assets/images/icons/eye-off.svg" : "/assets/images/icons/eye.svg"}
                        alt="toggle password"
                        className="h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7"
                      />
                    </button>
                  </div>
                  {formErrors.find((error) => error.path.includes("password")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("password"))?.message}
                    </p>
                  )}
                </label>

                {/* Confirm Password Field */}
                <label className="flex flex-col gap-2">
                  <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Confirm Password</h4>
                  <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                    <img
                      src="/assets/images/icons/lock.svg"
                      alt="icon"
                      className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                    />
                    <input
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-12 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-[12px] sm:right-[14px] xl:right-[16px] top-1/2 -translate-y-1/2 p-1"
                    >
                      <img
                        src={showConfirmPassword ? "/assets/images/icons/eye-off.svg" : "/assets/images/icons/eye.svg"}
                        alt="toggle password"
                        className="h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7"
                      />
                    </button>
                  </div>
                  {formErrors.find((error) => error.path.includes("confirmPassword")) && (
                    <p className="text-red-500 text-sm xl:text-base">
                      {formErrors.find((error) => error.path.includes("confirmPassword"))?.message}
                    </p>
                  )}
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#d14a1e] py-3 sm:py-[14px] xl:py-4 font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80] hover:bg-[#c1431a] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-white text-sm sm:text-base xl:text-lg">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
