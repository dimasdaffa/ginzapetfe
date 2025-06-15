"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { OrderFormData, CartItem, Product } from "../types/type";
import type { ZodIssue } from "zod";
import apiClient from "../services/apiServices";
import { paymentSchema } from "../types/validationOrder";

type FormData = {
  proof: File | null;
  product_ids: number[];
};

export default function PaymentPage() {
  const [formData, setFormData] = useState<FormData>({
    proof: null,
    product_ids: [],
  });

  const [productDetails, setProductDetails] = useState<Product[]>([]);
  const [OrderData, setOrderData] = useState<OrderFormData | null>(null);
  const [formErrors, setFormErrors] = useState<ZodIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const navigate = useNavigate();
  const TAX_RATE = 0.11;

  const subtotal = productDetails.reduce(
    (acc, product) => acc + product.price,
    0
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    setFormData((prev) => ({
      ...prev,
      proof: file,
    }));
    setFileName(file ? file.name : null);
  };

  const fetchProductDetails = async (cartItems: CartItem[]) => {
    try {
      const fetchedDetails = await Promise.all(
        cartItems.map(async (item) => {
          const response = await apiClient.get(`/product/${item.slug}`);
          return response.data.data;
        })
      );

      setProductDetails(fetchedDetails);
      setLoading(false);

      const productIds = fetchedDetails.map((product) => product.id);
      setFormData((prevData) => ({
        ...prevData,
        product_ids: productIds,
      }));
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("Failed to fetch product details");
      setLoading(false);
    }
  };

  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    const savedOrderData = localStorage.getItem("OrderData");

    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData) as OrderFormData);
    }

    if (!cartData || (cartData && JSON.parse(cartData).length === 0)) {
      navigate("/");
      return;
    }

    const cartItems = JSON.parse(cartData) as CartItem[];
    fetchProductDetails(cartItems);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7]">
        <p className="text-lg font-semibold text-red-500">
          Error loading data: {error}
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = paymentSchema.safeParse(formData);
    if (!validation.success) {
      setFormErrors(validation.error.issues);
      return;
    }
    setFormErrors([]);

    const submissionData = new FormData();

    if (formData.proof) {
      submissionData.append("proof", formData.proof);
    }

    if (OrderData) {
      submissionData.append("name", OrderData.name);
      submissionData.append("email", OrderData.email);
      submissionData.append("phone", OrderData.phone);
      submissionData.append("address", OrderData.address);
      submissionData.append("city", OrderData.city);
      submissionData.append("post_code", OrderData.post_code);
      submissionData.append("started_time", OrderData.started_time);
      submissionData.append("schedule_at", OrderData.schedule_at);
    }

    formData.product_ids.forEach((id, index) => {
      submissionData.append(`product_ids[${index}]`, String(id));
    });

    try {
      setLoading(true);
      const response = await apiClient.post(
        "/Order-transaction",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const OrderTrxId = response.data.data.Order_trx_id;
        const email = response.data.data.email;

        if (!OrderTrxId) console.error("Error: Order_trx_id is undefined");
        setSuccessMessage("Payment proof submitted successfully!");
        localStorage.removeItem("cart");
        localStorage.removeItem("OrderData");
        setFormData({ proof: null, product_ids: [] });
        setLoading(false);
        navigate(`/success-Order?trx_id=${OrderTrxId}&email=${email}`);
      } else {
        console.error("Unexpected response status", response.status);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting payment proof", error);
      setLoading(false);
      setFormErrors([]);
    }
  };

  return (
    <main className="relative min-h-screen mx-auto w-full bg-[#F4F5F7]">
      {/* Background Image */}
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="image"
          className="h-[250px] sm:h-[280px] lg:h-[320px] xl:h-[350px] w-full object-cover object-bottom"
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
              to={"/Order"}
              id="BackA"
              className="absolute left-0 transition-all duration-300"
            >
              <div
                id="Back"
                className={`flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-white
                    ${isScrolled ? "border border-ginzapet-graylight" : ""}`}
              >
                <img
                  src="/assets/images/icons/back.svg"
                  alt="icon"
                  className="h-[22px] w-[22px] shrink-0"
                />
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
              <div className="h-2 w-[50px] sm:w-[60px] rounded-full bg-[#E68B6D]" />
              <div className="absolute h-2 w-[50px] sm:w-[60px] rounded-full bg-white" />
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
            <div className="absolute h-2 w-1/2 rounded-full bg-white" />
            <div className="absolute right-1/2 top-0 translate-x-1/2">
              <div className="flex flex-col items-center gap-[6px]">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white text-xs font-bold leading-[18px]">
                  2
                </div>
                <p className="text-xs font-semibold leading-[18px] text-white">
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

      {/* Content */}
      <div className="relative mt-[30px] sm:mt-[44px] flex flex-col px-4 sm:px-5 pb-5">
        <div className="max-w-2xl mx-auto w-full xl:max-w-4xl">
          <header className="flex flex-col gap-[2px] mb-5 sm:mb-[20px]">
            <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[34px] font-extrabold leading-[33px] sm:leading-[39px] lg:leading-[45px] xl:leading-[51px] text-white text-center lg:text-left">
              Payment
            </h1>
            <p className="text-white text-center lg:text-left text-sm sm:text-base">
              Dibayar dulu nanti baru dikerjain
            </p>
          </header>

          <div className="xl:grid xl:grid-cols-3 xl:gap-8 flex flex-col gap-4 sm:gap-5 lg:gap-6">
            {/* Payment Method - Full width on mobile, spans 2 columns on xl */}
            <div className="xl:col-span-3">
              <section id="PaymentMethod" className="mb-4 sm:mb-5 lg:mb-6">
                <div className="flex items-center justify-center gap-[10px] rounded-[16px] sm:rounded-[20px] border border-ginzapet-graylight bg-white py-3 sm:py-[14px] px-4">
                  <img
                    src="/assets/images/icons/credit-payment.svg"
                    alt="icon"
                    className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0"
                  />
                  <div>
                    <h5 className="text-sm sm:text-base xl:text-lg font-semibold leading-[21px]">
                      Send to Bank
                    </h5>
                    <p className="text-sm sm:text-base leading-[21px]">
                      Available
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Available Payment - Left column on xl */}
            <div className="xl:col-span-2">
              <section
                id="AvailablePayment"
                className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6 mb-4 sm:mb-5 lg:mb-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                    Available Payment
                  </h3>
                  <button type="button" data-expand="AvailablePaymentJ">
                    <img
                      src="/assets/images/icons/bottom-Order-form.svg"
                      alt="icon"
                      className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300"
                    />
                  </button>
                </div>
                <div
                  id="AvailablePaymentJ"
                  className="flex flex-col gap-4 xl:gap-6"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-[50px] w-[70px] sm:h-[60px] sm:w-[81px] xl:h-[70px] xl:w-[90px] items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/assets/images/thumbnails/bca.png"
                        alt="image"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-[10px] flex-1">
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Name
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          Bank Central Asia
                        </strong>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Number
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          18212331928391
                        </strong>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Account
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          Ghiza Petshop
                        </strong>
                      </div>
                    </div>
                  </div>
                  <hr className="border-ginzapet-graylight" />
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-[50px] w-[70px] sm:h-[60px] sm:w-[81px] xl:h-[70px] xl:w-[90px] items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/assets/images/thumbnails/mandiri.png"
                        alt="image"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="flex flex-col gap-2 sm:gap-[10px] flex-1">
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Name
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          Bank Mandiri
                        </strong>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Number
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          829123192
                        </strong>
                      </div>
                      <div className="flex flex-col gap-[2px]">
                        <h4 className="text-ginzapet-gray text-xs sm:text-sm xl:text-base">
                          Bank Account
                        </h4>
                        <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                          Ghiza Petshop
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Order Details - Right column on xl */}
            <div className="xl:col-span-1">
              <section
                id="OrderDetails"
                className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6 mb-4 sm:mb-5 lg:mb-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                    Order Details
                  </h3>
                  <button type="button" data-expand="OrderDetailsJ">
                    <img
                      src="/assets/images/icons/bottom-Order-form.svg"
                      alt="icon"
                      className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300"
                    />
                  </button>
                </div>
                <div
                  className="flex flex-col gap-3 sm:gap-4"
                  id="OrderDetailsJ"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-[10px]">
                      <img
                        src="/assets/images/icons/note-payment.svg"
                        alt="icon"
                        className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] xl:h-[28px] xl:w-[28px] shrink-0"
                      />
                      <p className="text-ginzapet-gray text-sm sm:text-base xl:text-lg">
                        Sub Total
                      </p>
                    </div>
                    <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                      {formatCurrency(subtotal)}
                    </strong>
                  </div>
                  <hr className="border-ginzapet-graylight" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-[10px]">
                      <img
                        src="/assets/images/icons/note-payment.svg"
                        alt="icon"
                        className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] xl:h-[28px] xl:w-[28px] shrink-0"
                      />
                      <p className="text-ginzapet-gray text-sm sm:text-base xl:text-lg">
                        Tax 11%
                      </p>
                    </div>
                    <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                      {formatCurrency(tax)}
                    </strong>
                  </div>
                  <hr className="border-ginzapet-graylight" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-[10px]">
                      <img
                        src="/assets/images/icons/note-payment.svg"
                        alt="icon"
                        className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] xl:h-[28px] xl:w-[28px] shrink-0"
                      />
                      <p className="text-ginzapet-gray text-sm sm:text-base xl:text-lg">
                        Service Tools
                      </p>
                    </div>
                    <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                      Free
                    </strong>
                  </div>
                  <hr className="border-ginzapet-graylight" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 sm:gap-[10px]">
                      <img
                        src="/assets/images/icons/note-payment.svg"
                        alt="icon"
                        className="h-[20px] w-[20px] sm:h-[24px] sm:w-[24px] xl:h-[28px] xl:w-[28px] shrink-0"
                      />
                      <p className="text-ginzapet-gray text-sm sm:text-base xl:text-lg">
                        Grand Total
                      </p>
                    </div>
                    <strong className="text-[18px] sm:text-[20px] xl:text-[22px] font-bold leading-[27px] sm:leading-[30px] xl:leading-[33px] text-ginzapet-orange">
                      {formatCurrency(total)}
                    </strong>
                  </div>
                </div>
              </section>
            </div>

            {/* Confirmation Form - Full width */}
            <div className="xl:col-span-3">
              <form onSubmit={handleSubmit}>
                <section className="flex flex-col gap-4 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base sm:text-lg xl:text-xl">
                      Confirmation
                    </h3>
                    <button type="button" data-expand="ConfirmationJ">
                      <img
                        src="/assets/images/icons/bottom-Order-form.svg"
                        alt="icon"
                        className="h-[28px] w-[28px] sm:h-[32px] sm:w-[32px] xl:h-[36px] xl:w-[36px] shrink-0 transition-all duration-300"
                      />
                    </button>
                  </div>
                  <div id="ConfirmationJ" className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <h4 className="font-semibold text-sm sm:text-base xl:text-lg">
                        Add Proof of Payment
                      </h4>
                      <div className="relative flex h-[48px] sm:h-[52px] xl:h-[56px] w-full items-center overflow-hidden rounded-full border border-ginzapet-graylight transition-all duration-300 focus-within:border-ginzapet-orange">
                        <img
                          src="/assets/images/icons/proof-payment.svg"
                          alt="icon"
                          className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                        />
                        <p
                          id="upload"
                          className="absolute left-10 sm:left-12 xl:left-14 top-1/2 -translate-y-1/2 text-ginzapet-gray text-sm sm:text-base xl:text-lg pointer-events-none"
                        >
                          {fileName ? fileName : "Upload image"}
                        </p>
                        <input
                          onChange={handleChange}
                          type="file"
                          name="proof"
                          id="file-upload"
                          className="opacity-0 w-full h-full cursor-pointer"
                          accept="image/*"
                        />
                      </div>
                      {formErrors.find((error) =>
                        error.path.includes("proof")
                      ) && (
                        <p className="text-red-500 text-sm xl:text-base">
                          {
                            formErrors.find((error) =>
                              error.path.includes("proof")
                            )?.message
                          }
                        </p>
                      )}
                    </label>
                  </div>
                </section>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-8 sm:mt-[54px] xl:mt-12 w-full max-w-md mx-auto xl:max-w-lg xl:mx-auto block rounded-full bg-[#d14a1e] py-3 sm:py-[14px] xl:py-4 font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80] hover:bg-[#c1431a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Confirm My Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
