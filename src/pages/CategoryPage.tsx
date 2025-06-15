import { Link, useParams } from "react-router-dom";
import type { Category } from "../types/type";
import { useEffect, useState } from "react";
import apiClient from "../services/apiServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ShoppingCart, Calendar, Clock } from "lucide-react";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    if (slug) {
      apiClient
        .get(`/category/${slug}`)
        .then((response) => {
          setCategory(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to load service details");
          console.error("Error fetching category:", error);
          setLoading(false);
        });
    }
  }, [slug]);

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500">Error loading: {error}</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>Category not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Background Image - Mobile Only */}
      <div className="absolute left-0 right-0 top-0 lg:hidden">
        <img
          src="/public/assets/images/backgrounds/orange.png"
          alt="background"
          className="h-86 w-full object-cover object-bottom"
        />
      </div>

      {/* Desktop Background */}
      <div className="hidden lg:block absolute left-0 right-0 top-0 h-48 bg-gradient-to-r from-[#d14a1e] to-[#ff6b35] "></div>

      {/* Navigation */}
      <nav
        className={`fixed left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? "top-7 lg:top-4" : "top-4 lg:top-4"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between py-3 lg:py-4 transition-all duration-300 ${
              isScrolled
                ? "bg-white rounded-2xl lg:rounded-3xl px-4 lg:px-6 shadow-lg"
                : "lg:bg-white/10 lg:backdrop-blur-sm lg:rounded-3xl lg:px-6"
            }`}
          >
            <Link to="/">
              <div
                className={`flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                  isScrolled
                    ? "border border-gray-200"
                    : "lg:bg-white/20 lg:backdrop-blur-sm"
                }`}
              >
                <ArrowLeft className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
              </div>
            </Link>
            <h1
              className={`font-semibold text-lg lg:text-xl transition-all duration-300 ${
                isScrolled ? "text-gray-900" : "text-white lg:text-white"
              }`}
            >
              Explore
            </h1>
            <Link to="/cart">
              <div
                className={`flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                  isScrolled
                    ? "border border-gray-200"
                    : "lg:bg-white/20 lg:backdrop-blur-sm"
                }`}
              >
                <ShoppingCart className="h-5 w-5 lg:h-6 lg:w-6 text-gray-700" />
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Header */}
          <header className="flex items-center gap-4 mb-8 lg:mb-10">
            <div className="flex h-16 w-16 lg:h-30 lg:w-30 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm z-10">
              <div className="h-8 w-8 lg:h-20 lg:w-20 bg-white rounded-lg overflow-hidden"> 
                <img
                  src={`${BASE_URL}/${category.photo}`}
                  alt={category.name}
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="z-10">
              <h1 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight ">
                {category.name}
              </h1>
              <p className="text-black/90 text-lg lg:text-xl">
                {category.products_count} Products
              </p>
            </div>
          </header>

          {/* Most Ordered Section */}
          <section className="mb-12 lg:mb-16">
            <h2 className="text-xl lg:text-2xl font-bold text-white lg:text-gray-900 mb-6">
              Most Ordered
            </h2>

            {/* Mobile: Horizontal scroll */}
            <div className="lg:hidden overflow-x-auto pb-4">
              <div className="flex gap-4 w-max">
                <Swiper
                  className="swiper-wrapper pb-[30px]"
                  direction="horizontal"
                  spaceBetween={20}
                  slidesPerView="auto"
                  slidesOffsetAfter={20}
                  slidesOffsetBefore={20}
                >
                  {category.popular_products.length > 0 ? (
                    category.popular_products.map((product) => (
                      <SwiperSlide key={product.id} className="!w-fit">
                        <Link to={`/product/${product.slug}`}>
                          <div className="w-56 rounded-2xl border border-gray-200 bg-white p-4 hover:border-[#d14a1e] transition-colors relative">
                            <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 shadow-sm z-10"></div>
                            <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-gray-100">
                              <img
                                src={
                                  product.thumbnail
                                    ? `${BASE_URL}/${product.thumbnail}`
                                    : "/placeholder.svg"
                                }
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-[40px]">
                              {product.name}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <p className="text-xs text-gray-500">
                                  {category.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <p className="text-xs text-gray-500">
                                  {product.stok} Stok tersedia
                                </p>
                              </div>
                              <p className="font-semibold text-[#d14a1e]">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </SwiperSlide>
                    ))
                  ) : (
                    <p className="px-5 text-white lg:text-gray-900">
                      No popular products available yet.
                    </p>
                  )}
                </Swiper>
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.popular_products.length > 0 ? (
                category.popular_products.map((product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#d14a1e] hover:shadow-lg transition-all relative">
                      <div className="mb-4 h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={
                            product.thumbnail
                              ? `${BASE_URL}/${product.thumbnail}`
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-4 line-clamp-2 min-h-[56px]">
                        {product.name}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {category.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {product.stok} Stok tersedia
                          </p>
                        </div>
                        <p className="font-semibold text-lg text-[#d14a1e]">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-gray-900">
                  No popular products available yet.
                </p>
              )}
            </div>
          </section>

          {/* Latest Products Section */}
          <section className="pb-24 lg:pb-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-6 text-white lg:text-gray-900">
              Latest Products
            </h2>

            {/* Mobile: Vertical list */}
            <div className="lg:hidden space-y-4">
              {category.products.length > 0 ? (
                category.products.map((product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 hover:border-[#d14a1e] transition-colors">
                      <div className="flex h-24 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={
                            product.thumbnail
                              ? `${BASE_URL}/${product.thumbnail}`
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {product.stok} Stok tersedia
                          </p>
                        </div>
                        <p className="font-semibold text-[#d14a1e]">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-white lg:text-gray-900">
                  No latest products available yet.
                </p>
              )}
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.length > 0 ? (
                category.products.map((product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#d14a1e] hover:shadow-lg transition-all">
                      <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={
                            product.thumbnail
                              ? `${BASE_URL}/${product.thumbnail}`
                              : "/placeholder.svg"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-2 flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {product.stok} Stok tersedia
                          </p>
                        </div>
                        <p className="font-semibold text-lg text-[#d14a1e]">
                          {formatCurrency(product.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full text-gray-900">
                  No latest products available yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
