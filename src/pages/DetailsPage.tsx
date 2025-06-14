import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { CartItem, Product } from "../types/type";
import apiClient from "../services/apiServices";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Clock,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";

export default function DetailsPage() {
  const { slug } = useParams<{ slug: string }>(); 

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdding, setIsAdding] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false); 

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
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
        .get(`/product/${slug}`)
        .then((response) => {
          setProduct(response.data.data); 
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to load product details");
          setLoading(false);
          console.error("Error fetching service details:", error); 
        });
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      setIsAdding(true);
      const itemExists = cart.find((item) => item.product_id === product.id);

      if (itemExists) {
        alert("Jasa sudah tersedia di Cart!"); 
        setIsAdding(false);
      } else {
        const newCartItem: CartItem = {
          product_id: product.id,
          slug: product.slug,
          quantity: 1, 
        };
        const updatedCart = [...cart, newCartItem];
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        alert("Jasa berhasil ditambahkan ke Cart!"); 
        setIsAdding(false);
      }
    }
  };

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error loading: {error}</p>;
  }

  if (!product) {
    return <p>Product not found!</p>;
  }
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Background Image - Mobile Only */}
      <div className="absolute left-0 right-0 top-0 h-56 lg:hidden">
        <img
          src="/assets/images/backgrounds/orange-service-details.png"
          alt="background"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Desktop Background */}
      <div className="hidden lg:block absolute left-0 right-0 top-0 h-32 bg-gradient-to-r from-[#d14a1e] to-[#ff6b35]"></div>

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
                  isScrolled ? "border border-gray-200" : "lg:bg-white/20 lg:backdrop-blur-sm"
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
              Details
            </h1>
            <Link to="/cart">
              <div
                className={`flex h-11 w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-white transition-all duration-300 ${
                  isScrolled ? "border border-gray-200" : "lg:bg-white/20 lg:backdrop-blur-sm"
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
          {/* Mobile Layout */}
          <div className="lg:hidden pb-40">
            {/* Product Image */}
            <header className="mb-6">
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={product.thumbnail ? `${BASE_URL}/${product.thumbnail}` : "/placeholder.svg"}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />
                {product.is_popular && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-white px-3 py-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-semibold text-sm">Popular</span>
                  </div>
                )}
              </div>
              <h1 className="mt-4 text-2xl font-bold leading-tight">{product.name}</h1>
            </header>

            {/* Product Info Grid */}
            <section className="mb-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F5F7] p-4">
                <Clock className="h-8 w-8 text-[#d14a1e]" />
                <div>
                  <p className="font-semibold text-sm">{product.stok}</p>
                  <p className="text-sm text-gray-500">Stok tersedia</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F5F7] p-4">
                <Award className="h-8 w-8 text-[#d14a1e]" />
                <div>
                  <p className="font-semibold text-sm">Top Product</p>
                  <p className="text-sm text-gray-500">Guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F5F7] p-4 col-span-2">
                <Calendar className="h-8 w-8 text-[#d14a1e]" />
                <div>
                  <p className="font-semibold text-sm">{product.category.name}</p>
                  <p className="text-sm text-gray-500">Category</p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="mb-6">
              <h3 className="font-semibold mb-3">Details</h3>
              <p className="leading-relaxed text-gray-700">{product.about}</p>
            </section>

            {/* Benefits */}
            <section className="mb-6">
              <div className="rounded-2xl border border-gray-200 p-4">
                <h3 className="font-semibold mb-4">Product Details</h3>
                <div className="space-y-4">
                  {product.benefits.map((benefit, index) => (
                    <div key={benefit.id} className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <p className="leading-relaxed">{benefit.name}</p>
                      </div>
                      {index < product.benefits.length - 1 && <hr className="border-gray-200" />}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="mb-6">
              <h3 className="font-semibold mb-4">Great Customers</h3>
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 w-max">
                  {product.testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-72 rounded-2xl border border-gray-200 p-5">
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                        ))}
                      </div>
                      <p className="leading-relaxed mb-4 text-gray-700">{testimonial.message}</p>
                      <div className="flex items-center gap-3">
                        <img
                          src={testimonial.photo ? `${BASE_URL}/${testimonial.photo}` : "/placeholder.svg"}
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="font-semibold">{testimonial.name}</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-2 lg:gap-12 py-8">
            {/* Left Column - Product Image and Info */}
            <div className="space-y-8">
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src={product.thumbnail ? `${BASE_URL}/${product.thumbnail}` : "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.is_popular && (
                  <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-white px-4 py-3">
                    <Star className="h-6 w-6 text-yellow-500 fill-current" />
                    <span className="font-semibold">Popular</span>
                  </div>
                )}
              </div>

              {/* Product Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 rounded-2xl bg-[#F4F5F7] p-6">
                  <Clock className="h-10 w-10 text-[#d14a1e]" />
                  <div>
                    <p className="font-semibold text-lg">{product.stok}</p>
                    <p className="text-gray-500">Stok tersedia</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-[#F4F5F7] p-6">
                  <Award className="h-10 w-10 text-[#d14a1e]" />
                  <div>
                    <p className="font-semibold text-lg">Top Product</p>
                    <p className="text-gray-500">Guarantee</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-[#F4F5F7] p-6 col-span-2">
                  <Calendar className="h-10 w-10 text-[#d14a1e]" />
                  <div>
                    <p className="font-semibold text-lg">{product.category.name}</p>
                    <p className="text-gray-500">Category</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold leading-tight mb-6">{product.name}</h1>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Details</h3>
                  <p className="leading-relaxed text-gray-700 text-lg">{product.about}</p>
                </div>

                {/* Benefits */}
                <div className="mb-8">
                  <div className="rounded-2xl border border-gray-200 p-6">
                    <h3 className="text-xl font-semibold mb-6">Product Details</h3>
                    <div className="space-y-4">
                      {product.benefits.map((benefit, index) => (
                        <div key={benefit.id} className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500" />
                            <p className="leading-relaxed text-lg">{benefit.name}</p>
                          </div>
                          {index < product.benefits.length - 1 && <hr className="border-gray-200" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Add to Cart */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-[#d14a1e]">{formatCurrency(product.price)}</p>
                      <p className="text-gray-500">Refund Guarantee</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="w-full bg-[#d14a1e] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#b8401a] transition-colors hover:shadow-lg disabled:opacity-50"
                  >
                    {isAdding ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials - Full Width on Desktop */}
          <section className="hidden lg:block mt-12">
            <h3 className="text-2xl font-semibold mb-8">Great Customers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="leading-relaxed mb-6 text-gray-700">{testimonial.message}</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.photo ? `${BASE_URL}/${testimonial.photo}` : "/placeholder.svg"}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-semibold">{testimonial.name}</h5>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-5 left-0 right-0 z-30 lg:hidden">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-4 rounded-2xl bg-black px-5 py-4">
            <div className="flex-1">
              <p className="text-xl font-extrabold text-white">{formatCurrency(product.price)}</p>
              <p className="text-sm text-white/80">Refund Guarantee</p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 rounded-full bg-[#d14a1e] px-6 py-3 text-center font-semibold text-white hover:bg-[#b8401a] transition-colors disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile spacing for bottom nav */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}