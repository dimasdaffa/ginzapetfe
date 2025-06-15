import { useState } from "react";
import type { z } from "zod";
import type { BookingDetails } from "../types/type";
import { viewBookingSchema } from "../types/validationBooking";
import apiClient, { isAxiosError } from "../services/apiServices";
import { Link } from "react-router-dom";
import React from "react"; // Import React

import {
  Search,
  Mail,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  User,
  Phone,
  MapPin,
  Home,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";

// Helper function for currency formatting
const formatCurrency = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// AccordionSection Component
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function AccordionSection({ title, children, defaultOpen = true }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="rounded-2xl lg:rounded-3xl border border-gray-200 bg-white p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg lg:text-xl">{title}</h3>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </button>
      </div>
      {isOpen && <div className="space-y-4">{children}</div>}
    </section>
  );
}

// ProgressIndicator Component
function ProgressIndicator({ isPaid }: { isPaid: boolean }) {
  const steps = [
    { number: 1, label: "Booking\nCreated", completed: true },
    { number: 2, label: "Verifying\nPayment", completed: true },
    { number: 3, label: "Start\nWorking", completed: isPaid },
  ];

  return (
    <div className="relative w-full pb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center relative">
            {/* Progress Line */}
            {index < steps.length - 1 && (
              <div className="absolute top-3 left-6 w-full h-0.5 bg-gray-200 lg:w-32">
                <div
                  className={`h-full transition-all duration-500 ${
                    step.completed && steps[index + 1].completed ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`flex h-6 w-6 lg:h-8 lg:w-8 items-center justify-center rounded-full text-xs lg:text-sm font-bold text-white z-10 ${
                step.completed ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {step.completed ? <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5" /> : step.number}
            </div>

            {/* Step Label */}
            <p className="text-xs lg:text-sm font-semibold text-center mt-2 whitespace-pre-line">{step.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyBookingPage() {
  const [formData, setFormData] = useState({ email: "", booking_trx_id: "" });
  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [notFound, setNotFound] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    setFormErrors((prev) => prev.filter((error) => !error.path.includes(name)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = viewBookingSchema.safeParse(formData);
    if (!validation.success) {
      setFormErrors(validation.error.issues);
      return;
    }
    setFormErrors([]);
    setLoading(true);
    setNotFound(false);

    try {
      const response = await apiClient.post("/check-booking", formData);

      if (response.status === 200 && response.data.data) {
        setBookingDetails(response.data.data);
      } else {
        setNotFound(true);
        setBookingDetails(null);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 404) {
          setNotFound(true);
          setBookingDetails(null);
        } else {
          // Handle other errors, e.g., show a generic error message
          console.error("An unexpected error occurred:", err);
        }
      } else {
        console.error("An unknown error occurred:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Background Image - Mobile Only */}
      <div className="absolute left-0 right-0 top-0 lg:hidden">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="background"
          className="h-70 w-full object-cover object-bottom"
        />
      </div>

      {/* Desktop Background */}
      <div className="hidden lg:block absolute left-0 right-0 top-0 h-40 bg-gradient-to-r from-[#d14a1e] to-[#ff6b35]"></div>

      {/* Main Content */}
      <main className="relative pt-12 lg:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="flex flex-col items-center gap-4 mb-8 lg:mb-12">
            <div className="flex h-16 w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Search className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
            </div>
            <h1 className="text-2xl lg:text-4xl font-extrabold text-white lg:text-black text-center">Check My Booking</h1>
          </header>

          <div className="max-w-4xl mx-auto">
            {/* Search Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="rounded-2xl lg:rounded-3xl border border-gray-200 bg-white p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="bookingTrxId" className="font-semibold text-lg">
                      Booking TRX ID
                    </label>
                    {formErrors.find((error) => error.path.includes("booking_trx_id")) && (
                      <p className="text-red-500 text-sm">
                        {formErrors.find((error) => error.path.includes("booking_trx_id"))?.message}
                      </p>
                    )}
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        onChange={handleChange}
                        value={formData.booking_trx_id}
                        name="booking_trx_id"
                        id="bookingTrxId"
                        placeholder="Your Booking TRX ID"
                        className="h-12 lg:h-14 w-full rounded-full border border-gray-200 bg-transparent pl-12 pr-4 font-semibold focus:border-[#d14a1e] focus:outline-none"
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="emailAddress" className="font-semibold text-lg">
                      Email Address
                    </label>
                    {formErrors.find((error) => error.path.includes("email")) && (
                      <p className="text-red-500 text-sm">
                        {formErrors.find((error) => error.path.includes("email"))?.message}
                      </p>
                    )}
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        required
                        onChange={handleChange}
                        value={formData.email}
                        name="email"
                        id="emailAddress"
                        placeholder="Write your email"
                        className="h-12 lg:h-14 w-full rounded-full border border-gray-200 bg-transparent pl-12 pr-4 font-semibold focus:border-[#d14a1e] focus:outline-none"
                        type="email"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 rounded-full bg-[#d14a1e] py-3 lg:py-4 text-center font-semibold text-white hover:bg-[#b8401a] transition-colors hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Find My Booking"}
                </button>
              </div>
            </form>

            {/* Not Found State */}
            {notFound && (
              <div className="rounded-2xl lg:rounded-3xl border border-gray-200 bg-white p-6 lg:p-8 text-center mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
                  <Search className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="font-bold text-xl mb-2">Oops! Not Found</h3>
                <p className="text-gray-600 leading-relaxed">
                  Kami tidak dapat menemukan pesanan anda silahkan diperiksa kembali
                </p>
              </div>
            )}

            {/* Booking Results */}
            {bookingDetails && !notFound && (
              <div className="space-y-6 lg:space-y-8 pb-24 lg:pb-8">
                {/* Booking Status */}
                <AccordionSection title="Booking Status">
                  <ProgressIndicator isPaid={bookingDetails.is_paid} />
                </AccordionSection>

                {/* Desktop Two-Column Layout */}
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 space-y-6 lg:space-y-0">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Working Schedule */}
                    <AccordionSection title="Working Schedule">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="font-semibold">Date</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                              readOnly
                              type="text"
                              value={bookingDetails.schedule_at}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold">Start Time At</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                              readOnly
                              type="text"
                              value={bookingDetails.started_time}
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionSection>

                    {/* Services Ordered */}
                    <AccordionSection title="Services Ordered">
                      <div className="space-y-4">
                        {bookingDetails.transaction_details.map((detail, index) => (
                          <div key={detail.id} className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-20 w-20 lg:h-24 lg:w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                                <img
                                  src={`${BASE_URL}/${detail.product.thumbnail}`}
                                  alt={detail.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1 space-y-2">
                                <h4 className="font-semibold text-sm lg:text-base line-clamp-2">
                                  {detail.product.name}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatCurrency(detail.price)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{detail.product.stok} Stok Tersedia</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {index < bookingDetails.transaction_details.length - 1 && (
                              <hr className="border-gray-200" />
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionSection>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Booking Details */}
                    <AccordionSection title="Booking Details">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">Booking ID</span>
                          </div>
                          <span className="font-semibold">{bookingDetails.booking_trx_id}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">Sub Total</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(bookingDetails.sub_total)}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">Tax 11%</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(bookingDetails.total_tax_amount)}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-600">Grand Total</span>
                          </div>
                          <span className="text-xl font-bold text-[#d14a1e]">
                            {formatCurrency(bookingDetails.total_amount)}
                          </span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="overflow-hidden rounded-2xl">
                          <img
                            src={`${BASE_URL}/${bookingDetails.proof}`}
                            alt="Payment proof"
                            className="h-48 w-full object-cover"
                          />
                        </div>
                      </div>
                    </AccordionSection>

                    {/* Personal Information */}
                    <AccordionSection title="Personal Information">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="font-semibold">Full Name</label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              readOnly
                              value={bookingDetails.name}
                              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              readOnly
                              value={bookingDetails.email}
                              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                              type="email"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="font-semibold">Phone Number</label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              readOnly
                              value={bookingDetails.phone}
                              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                              type="tel"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionSection>
                  </div>
                </div>

                {/* Address - Full Width */}
                <AccordionSection title="Your Home Address">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="lg:col-span-2 space-y-2">
                      <label className="font-semibold">Address</label>
                      <div className="relative">
                        <Home className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <textarea
                          readOnly
                          className="h-28 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 pt-4 font-semibold focus:outline-none resize-none"
                          value={bookingDetails.address}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-semibold">City</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          readOnly
                          value={bookingDetails.city}
                          className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-semibold">Post Code</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                          readOnly
                          value={bookingDetails.post_code}
                          className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 font-semibold focus:outline-none"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </AccordionSection>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-5 left-0 right-0 z-30 lg:hidden">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl bg-black px-5 py-4">
            <div className="flex items-center gap-3">
              <Link to="/">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d14a1e]">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              </Link>
              <Link to="/my-booking" className="flex-1">
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#d14a1e] px-4 py-2">
                  <Search className="h-5 w-5 text-white" />
                  <span className="text-sm font-semibold text-white">My Booking</span>
                </div>
              </Link>
              <Link to="/profile">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d14a1e]">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile spacing for bottom nav */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}