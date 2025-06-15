"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { OrderFormData } from "../types/type";
import type { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { OrderSchema } from "../types/validationOrder";
import { ArrowLeft, Calendar, Clock, ListOrderedIcon } from "lucide-react";

export default function OrderPage() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    phone: "",
    started_time: "",
    schedule_at: "",
    post_code: "",
    address: "",
    city: "",
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [formErrors, setFormErrors] = useState<z.ZodIssue[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedData = localStorage.getItem("OrderData");
    const cartData = localStorage.getItem("cart");
    if (!cartData || JSON.parse(cartData).length === 0) {
      navigate("/");
      return;
    }
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [navigate]);

  const cities = [
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Medan",
    "Semarang",
    "Palembang",
    "Makassar",
    "Batam",
    "Pekanbaru",
    "Bogor",
    "Bandar Lampung",
    "Padang",
    "Denpasar",
    "Malang",
    "Samarinda",
    "Yogyakarta",
    "Manado",
    "Pontianak",
    "Banjarmasin",
    "Balikpapan",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0];

    setFormData((prev) => ({
      ...prev,
      schedule_at: formattedDate,
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = OrderSchema.safeParse(formData);

    if (!validation.success) {
      setFormErrors(validation.error.issues);
      return;
    }

    localStorage.setItem("OrderData", JSON.stringify(formData));
    alert("Order information saved!");
    navigate("/payment");

    setFormErrors([]);
  };

  return (
    <main className="relative min-h-screen mx-auto w-full bg-[#F4F5F7]">
      {/* Background Image */}
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="image"
          className="h-[300px] sm:h-[350px] lg:h-[400px] xl:h-[450px] w-full object-cover object-bottom"
        />
      </div>

      {/* Navigation */}
      <section
        id="NavTop"
        className={`fixed left-0 right-0 z-30 transition-all duration-300
            ${isScrolled ? "top-[30px]" : "top-[16px]"}`}
      >
        <div className="relative mx-auto max-w-[640px] lg:max-w-4xl xl:max-w-6xl px-4 sm:px-5 xl:px-8">
          <div
            id="ContainerNav"
            className={`relative flex h-[68px] items-center justify-center transition-all duration-300
                ${
                  isScrolled
                    ? "bg-white rounded-[22px] px-[16px] shadow-[0px_12px_20px_0px_#0305041C]"
                    : ""
                }`}
          >
            <Link
              to={"/cart"}
              id="BackA"
              className="absolute left-0 transition-all duration-300"
            >
              <div
                id="Back"
                className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white
                    ${isScrolled ? "border border-ginzapet-graylight" : ""}`}
              >
                <ArrowLeft className="h-[22px] w-[22px] shrink-0" />
              </div>
            </Link>
            <h2
              id="Title"
              className={`font-semibold text-base sm:text-lg transition-all duration-300
                ${isScrolled ? "" : "text-white"}`}
            >
              Order Services
            </h2>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section
        id="ProgressBar"
        className="relative px-4 sm:px-5 pt-[92px] lg:pt-[120px]"
      >
        <div className="flex max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
          <div className="flex flex-col items-center">
            <div className="relative z-10 flex h-[25px] items-center">
              <div className="h-2 w-[50px] sm:w-[60px] rounded-full bg-white" />
              <div className="absolute right-0 top-0 translate-x-1/2">
                <div className="flex flex-col items-center gap-[6px]">
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white text-xs font-bold leading-[18px]">
                    1
                  </div>
                  <p className="text-xs font-semibold leading-[18px] text-white">
                    Order
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex h-[25px] w-full items-center">
            <div className="h-2 w-full rounded-full bg-[#E68B6D]" />
            <div className="absolute right-1/2 top-0 translate-x-1/2">
              <div className="flex flex-col items-center gap-[6px]">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#FFBFA9] text-xs font-bold leading-[18px] text-[#C2836D]">
                  2
                </div>
                <p className="text-xs font-semibold leading-[18px] text-[#FFBFA9]">
                  Payment
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex h-[25px] w-[50px] sm:w-[60px] items-center">
            <div className="h-2 w-[50px] sm:w-[60px] rounded-full bg-[#E68B6D]" />
            <div className="absolute left-0 top-0 -translate-x-1/2">
              <div className="flex flex-col items-center gap-[6px]">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#FFBFA9] text-xs font-bold leading-[18px] text-[#C2836D]">
                  3
                </div>
                <p className="text-xs font-semibold leading-[18px] text-[#FFBFA9]">
                  Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Content */}
      <div className="relative mt-[30px] sm:mt-[44px] flex flex-col px-4 sm:px-5 pb-5">
        <div className="max-w-2xl mx-auto w-full xl:max-w-4xl">
          <form onSubmit={handleSubmit}>
            <header className="flex flex-col gap-[2px] mb-5 sm:mb-[20px]">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[34px] font-extrabold leading-[33px] sm:leading-[39px] lg:leading-[45px] xl:leading-[51px] text-white text-center lg:text-left">
                Start Order
              </h1>
            </header>

            <div className="xl:grid xl:grid-cols-2 xl:gap-8 flex flex-col gap-4 sm:gap-5 lg:gap-6 ">
              <div className="xl:col-span-2">
                {/* Working Schedule Section */}
                <section
                  id="WorkingSchedule"
                  className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                      Working Schedule
                    </h3>
                    <button type="button" data-expand="WorkingScheduleJ">
                      <ListOrderedIcon className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300" />
                    </button>
                  </div>
                  <div id="WorkingScheduleJ" className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 xl:gap-6">
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Date
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight">
                          <Calendar className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2" />
                          <input
                            value={formData.schedule_at}
                            onChange={handleChange}
                            name="scheduled_at"
                            required
                            className="h-full w-full rounded-full bg-[#F4F5F7] pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold text-sm sm:text-base xl:text-lg focus:outline-none"
                            readOnly
                            type="text"
                          />
                        </div>
                      </label>
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Start Time At
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <Clock className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2" />
                          <select
                            value={formData.started_time}
                            onChange={handleChange}
                            name="started_time"
                            className="h-full w-full appearance-none rounded-full bg-transparent relative z-10 pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold text-sm sm:text-base xl:text-lg focus:outline-none"
                          >
                            <option value="">Enter the time</option>
                            <option value="09:00">09:00</option>
                            <option value="10:00">10:00</option>
                            <option value="11:00">11:00</option>
                          </select>
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("started_time")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("started_time")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div>
                {/* Personal Information Section */}
                <section
                  id="PersonalInformations"
                  className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                      Personal Information
                    </h3>
                    <button type="button" data-expand="PersonalInformationsJ">
                      <img
                        src="/assets/images/icons/bottom-Order-form.svg"
                        alt="icon"
                        className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300"
                      />
                    </button>
                  </div>
                  <div
                    className="flex flex-col gap-4"
                    id="PersonalInformationsJ"
                  >
                    <div className="grid grid-cols-1 gap-4">
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Full Name
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <img
                            src="/assets/images/icons/profil-Order-form.svg"
                            alt="icon"
                            className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                          <input
                            required
                            value={formData.name}
                            onChange={handleChange}
                            name="name"
                            className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                            placeholder="Write your complete name"
                            type="text"
                          />
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("name")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("name")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Email Address
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <img
                            src="/assets/images/icons/amplop-Order-form.svg"
                            alt="icon"
                            className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                          <input
                            required
                            value={formData.email}
                            onChange={handleChange}
                            name="email"
                            className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                            placeholder="Write your email"
                            type="email"
                          />
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("email")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("email")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Phone Number
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <img
                            src="/assets/images/icons/telepon-Order-form.svg"
                            alt="icon"
                            className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            name="phone"
                            onChange={handleChange}
                            className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                            placeholder="Write your active number"
                          />
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("phone")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("phone")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div>
                {/* Address Section */}
                <section
                  id="YourHomeAddress"
                  className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                      Your Home Address
                    </h3>
                    <button type="button" data-expand="YourHomeAddressJ">
                      <img
                        src="/assets/images/icons/bottom-Order-form.svg"
                        alt="icon"
                        className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300"
                      />
                    </button>
                  </div>
                  <div id="YourHomeAddressJ" className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                        Address
                      </h4>
                      <div className="relative h-[100px] sm:h-[110px] xl:h-[120px] w-full overflow-hidden rounded-[18px] sm:rounded-[22px] xl:rounded-[24px] border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                        <textarea
                          placeholder="Enter your complete address"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="h-full w-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 sm:pr-[14px] xl:pr-[16px] pt-[14px] xl:pt-[16px] font-semibold leading-6 sm:leading-7 xl:leading-8 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none resize-none"
                          name="address"
                        />
                        <img
                          src="/assets/images/icons/school-Order-form.svg"
                          alt="icon"
                          className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-[14px] xl:top-[16px] h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0"
                        />
                      </div>
                      {formErrors.find((error) =>
                        error.path.includes("address")
                      ) && (
                        <p className="text-red-500 text-sm xl:text-base">
                          {
                            formErrors.find((error) =>
                              error.path.includes("address")
                            )?.message
                          }
                        </p>
                      )}
                    </label>
                    <div className="grid grid-cols-1 gap-4">
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          City
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <img
                            src="/assets/images/icons/location-Order-form.svg"
                            alt="icon"
                            className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                          <select
                            value={formData.city}
                            onChange={handleChange}
                            name="city"
                            className="h-full w-full appearance-none rounded-full bg-transparent relative z-10 pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-10 font-semibold text-sm sm:text-base xl:text-lg focus:outline-none"
                          >
                            <option value="">Enter the city name</option>
                            {cities.map((city) => (
                              <option key={city} value={city}>
                                {city}
                              </option>
                            ))}
                          </select>
                          <img
                            src="/assets/images/icons/bottom-select.svg"
                            alt="icon"
                            className="absolute right-[12px] sm:right-[14px] xl:right-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("city")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("city")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                      <label className="flex flex-col gap-2">
                        <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                          Post Code
                        </h4>
                        <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                          <img
                            src="/assets/images/icons/ball-Order-form.svg"
                            alt="icon"
                            className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                          />
                          <input
                            required
                            value={formData.post_code}
                            onChange={handleChange}
                            name="post_code"
                            className="h-full w-full rounded-full pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                            placeholder="What's your postal code"
                            type="tel"
                          />
                        </div>
                        {formErrors.find((error) =>
                          error.path.includes("post_code")
                        ) && (
                          <p className="text-red-500 text-sm xl:text-base">
                            {
                              formErrors.find((error) =>
                                error.path.includes("post_code")
                              )?.message
                            }
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 sm:mt-[44px] xl:mt-12 w-full max-w-md mx-auto xl:max-w-lg xl:mx-auto block rounded-full bg-[#d14a1e] py-3 sm:py-[14px] xl:py-4 font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80] hover:bg-[#c1431a]"
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
