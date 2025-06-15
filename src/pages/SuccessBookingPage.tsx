"use client"

import { Link, useLocation } from "react-router-dom"

export default function SuccessBookingPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const bookingTrxId = queryParams.get("trx_id")
  const email = queryParams.get("email")

  return (
    <main className="relative mx-auto min-h-screen w-full bg-[#F4F5F7] pb-[30px] sm:pb-[40px] xl:pb-[50px]">
      {/* Background Image */}
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="/assets/images/backgrounds/orange.png"
          alt="image"
          className="h-[400px] sm:h-[480px] lg:h-[520px] xl:h-[560px] w-full object-cover object-bottom"
        />
      </div>

      {/* Navigation */}
      <section id="NavTop" className="fixed left-0 right-0 top-[16px] z-30 transition-all duration-300">
        <div className="relative mx-auto max-w-[640px] lg:max-w-4xl xl:max-w-6xl px-4 sm:px-5 xl:px-8">
          <div
            id="ContainerNav"
            className="relative flex h-[68px] items-center justify-center rounded-[22px] transition-all duration-300"
          >
            <h2
              id="Title"
              className="font-semibold text-base sm:text-lg xl:text-xl text-white transition-all duration-300"
            >
              Finished Booking
            </h2>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section id="ProgressBar" className="relative px-4 sm:px-5 pt-[92px] lg:pt-[120px]">
        <div className="flex max-w-md mx-auto lg:max-w-lg xl:max-w-xl">
          <div className="flex flex-col items-center">
            <div className="relative z-10 flex h-[25px] items-center">
              <div className="h-2 w-[50px] sm:w-[60px] rounded-full bg-[#E68B6D]" />
              <div className="absolute h-2 w-[50px] sm:w-[60px] rounded-full bg-white" />
              <div className="absolute right-0 top-0 z-10 translate-x-1/2">
                <div className="flex flex-col items-center gap-[6px]">
                  <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white text-xs font-bold leading-[18px]">
                    1
                  </div>
                  <p className="text-xs font-semibold leading-[18px] text-white">Booking</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex h-[25px] w-full items-center">
            <div className="h-2 w-full rounded-full bg-[#E68B6D]" />
            <div className="absolute h-2 w-1/2 rounded-full bg-white" />
            <div className="absolute right-1/2 top-0 z-10 translate-x-1/2">
              <div className="flex flex-col items-center gap-[6px]">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white text-xs font-bold leading-[18px]">
                  2
                </div>
                <p className="text-xs font-semibold leading-[18px] text-white">Payment</p>
              </div>
            </div>
            <div className="absolute right-0 h-2 w-1/2 rounded-full bg-white" />
          </div>
          <div className="relative z-10 flex h-[25px] w-[50px] sm:w-[60px] items-center">
            <div className="h-2 w-[50px] sm:w-[60px] rounded-full bg-[#E68B6D]" />
            <div className="absolute left-0 top-0 z-10 -translate-x-1/2">
              <div className="flex flex-col items-center gap-[6px]">
                <div className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-white text-xs font-bold leading-[18px]">
                  3
                </div>
                <p className="text-xs font-semibold leading-[18px] text-white">Delivery</p>
              </div>
            </div>
            <div className="absolute h-2 w-full rounded-full bg-white" />
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="relative mt-[30px] sm:mt-[44px] px-4 sm:px-5">
        <div className="max-w-2xl mx-auto w-full xl:max-w-4xl">
          {/* Success Icon and Header */}
          <div className="text-center lg:text-left">
            <img
              src="/assets/images/icons/note-finished.svg"
              alt="icon"
              className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] xl:h-[80px] xl:w-[80px] shrink-0 mx-auto lg:mx-0"
            />
            <header className="mt-[15px] sm:mt-[19px] xl:mt-[24px] flex flex-col gap-[6px]">
              <h1 className="text-[22px] sm:text-[26px] lg:text-[30px] xl:text-[34px] font-extrabold leading-[33px] sm:leading-[39px] lg:leading-[45px] xl:leading-[51px] text-white">
                Booking Finished
              </h1>
              <p className="leading-[26px] sm:leading-[30px] xl:leading-[34px] text-white text-sm sm:text-base xl:text-lg">
                Kami akan memeriksa pembayaran Anda silahkan periksa status secara berkala
              </p>
            </header>
          </div>

          {/* Booking Details Section */}
          <section
            id="BookingDetails"
            className="mt-[25px] sm:mt-[30px] xl:mt-[40px] flex flex-col gap-4 xl:gap-6 rounded-2xl sm:rounded-3xl border border-ginzapet-graylight bg-white px-4 sm:px-[14px] xl:px-6 py-4 sm:py-[14px] xl:py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
              <label className="flex flex-col gap-2">
                <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Booking TRX ID</h4>
                <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight bg-[#F4F5F7]">
                  <img
                    src="/assets/images/icons/note-id-finished.svg"
                    alt="icon"
                    className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                  />
                  <input
                    readOnly
                    defaultValue={bookingTrxId ? bookingTrxId : "Undefined"}
                    className="h-full w-full rounded-full bg-transparent pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                    placeholder="Booking ID"
                    type="text"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2">
                <h4 className="font-semibold text-sm sm:text-base xl:text-lg">Email Address</h4>
                <div className="relative h-[48px] sm:h-[52px] xl:h-[56px] w-full overflow-hidden rounded-full border border-ginzapet-graylight bg-[#F4F5F7]">
                  <img
                    src="/assets/images/icons/amplop-booking-form.svg"
                    alt="icon"
                    className="absolute left-[12px] sm:left-[14px] xl:left-[16px] top-1/2 h-5 w-5 sm:h-6 sm:w-6 xl:h-7 xl:w-7 shrink-0 -translate-y-1/2"
                  />
                  <input
                    readOnly
                    defaultValue={email ? email : "Undefined"}
                    className="h-full w-full rounded-full bg-transparent pl-[44px] sm:pl-[50px] xl:pl-[56px] pr-4 font-semibold leading-6 text-sm sm:text-base xl:text-lg placeholder:text-sm sm:placeholder:text-[16px] xl:placeholder:text-lg placeholder:font-normal placeholder:text-ginzapet-gray focus:outline-none"
                    placeholder="Write your email"
                    type="email"
                  />
                </div>
              </label>
            </div>

            <hr className="border-ginzapet-graylight" />

            <div className="flex gap-3 sm:gap-[10px] xl:gap-4">
              <img
                src="/assets/images/icons/penting-finished.svg"
                alt="icon"
                className="h-[35px] w-[35px] sm:h-[40px] sm:w-[40px] xl:h-[45px] xl:w-[45px] shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs sm:text-sm xl:text-base leading-[18px] sm:leading-[21px] xl:leading-[24px] text-ginzapet-gray">
                  Penting Diingat:
                </p>
                <strong className="font-semibold text-sm sm:text-base xl:text-lg">
                  Silakan simpan ID transaksi ini untuk referensi pembayaran Anda
                </strong>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section
            id="Btn"
            className="mt-[40px] sm:mt-[54px] xl:mt-[64px] flex flex-col lg:flex-row gap-[14px] lg:gap-6 xl:gap-8"
          >
            <Link to={"/"} className="flex-1">
              <div className="w-full rounded-full bg-[#d14a1e] py-3 sm:py-[14px] xl:py-4 text-center font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80] hover:bg-[#c1431a] cursor-pointer">
                Order Service Again
              </div>
            </Link>
            <Link to={"/my-booking"} className="flex-1">
              <div className="w-full rounded-full bg-black py-3 sm:py-[14px] xl:py-4 text-center font-semibold text-white text-base sm:text-lg xl:text-xl transition-all duration-300 hover:bg-gray-800 cursor-pointer">
                View My Booking Details
              </div>
            </Link>
          </section>
        </div>
      </div>
    </main>
  )
}
