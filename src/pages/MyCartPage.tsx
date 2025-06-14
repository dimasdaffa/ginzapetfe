import { useEffect, useState } from "react";
import type { CartItem, Product } from "../types/type";
import apiClient from "../services/apiServices";
import { Link } from "react-router-dom";
import AccordionSection from "../components/AccordionSection";
import { ArrowLeft, DollarSign, Clock, Trash2 } from "lucide-react";


export default function MyCartPage() {
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
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
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const cartItems: CartItem[] = JSON.parse(savedCart);
      setCart(cartItems);

      const fetchProductDetails = async () => {
        const validProducts: Product[] = [];
        const updatedCart: CartItem[] = [];

        for (const item of cartItems) {
          try {
            const response = await apiClient.get(`/product/${item.slug}`);
            const product = response.data.data;
            if (product) {
              validProducts.push({ ...product, quantity: item.quantity });
              updatedCart.push(item);
            } else {
              console.warn(
                `Product with slug ${item.slug} is no longer available`
              );
            }
          } catch (error: unknown) {
            if (error instanceof Error) {
              setError(error.message);
              console.error(
                `Error fetching product with slug ${item.slug}: ${error.message}`
              );
            }
          }
        }

        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setProductDetails(validProducts);
        setLoading(false);
      };

      fetchProductDetails();
    } else {
      setLoading(false);
    }
  }, []);

  const handleRemoveItem = (slug: string) => {
    const updatedCart = cart.filter((item) => item.slug !== slug);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setProductDetails((prevDetails) =>
      prevDetails.filter((product) => product.slug !== slug)
    );
  };

  const subtotal = productDetails.reduce(
    (acc, product) => acc + product.price,
    0
  );
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-600">Error loading data: {error}</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      {/* Background Image */}
      <div className="absolute left-0 right-0 top-0 lg:hidden">
        <img
          src="/assets/images/backgrounds/orange.png" 
          alt="background"
          className="h-48 w-full object-cover object-bottom"
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
            className={`flex h-16 lg:h-20 items-center justify-center transition-all duration-300 ${
              isScrolled
                ? "bg-white rounded-2xl lg:rounded-3xl px-4 lg:px-6 shadow-lg"
                : "lg:bg-white/10 lg:backdrop-blur-sm lg:rounded-3xl lg:px-6"
            }`}
          >
            <Link to="/" className="absolute left-4 lg:left-6">
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
              My Cart
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative pt-24 lg:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden flex flex-col gap-5 pb-40">
            <AccordionSection
              title="Home Services"
              iconSrc="/assets/images/icons/bottom-booking-form.svg" 
            >
              <div className="flex flex-col gap-4">
                {productDetails.length > 0 ? (
                  productDetails.map((product, index) => (
                    <div key={product.id} className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                            <img
                              src={`${BASE_URL}/${product.thumbnail}`} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1 flex-1">
                            <h3 className="line-clamp-2 text-sm font-semibold leading-5">{product.name}</h3>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{formatCurrency(product.price)}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-500">{product.stok} Stok tersedia</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(product.slug)}
                          className="p-2 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                      {index < productDetails.length - 1 && <hr className="border-gray-200" />}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">Your cart is empty</p>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Booking Details"
              iconSrc="/assets/images/icons/bottom-booking-form.svg" 
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">Sub Total</p>
                  </div>
                  <strong className="font-semibold">{formatCurrency(subtotal)}</strong>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <p className="text-gray-600">Tax 11%</p>
                  </div>
                  <strong className="font-semibold">{formatCurrency(tax)}</strong>
                </div>
                <hr className="border-gray-200" />
              </div>
            </AccordionSection>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8 pb-8 pt-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/assets/images/icons/bottom-booking-form.svg" alt="icon" className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Cart Items</h2>
                </div>

                <div className="space-y-6">
                  {productDetails.length > 0 ? (
                    productDetails.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          <img
                            src={`${BASE_URL}/${product.thumbnail}`}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{formatCurrency(product.price)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{product.stok} Stok tersedia</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <button
                            onClick={() => handleRemoveItem(product.slug)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">Your cart is empty</p>
                      <Link
                        to="/"
                        className="text-[#d14a1e] hover:underline mt-2 inline-block"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <img src="/assets/images/icons/bottom-booking-form.svg" alt="icon" className="h-6 w-6" />
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (11%)</span>
                    <span className="font-semibold">{formatCurrency(tax)}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-[#d14a1e]">{formatCurrency(total)}</span>
                  </div>
                </div>

                {productDetails.length > 0 && ( 
                  <Link to="/booking" className="block mt-6">
                    <button className="w-full bg-[#d14a1e] text-white font-semibold py-4 px-6 rounded-full hover:bg-[#b8401a] transition-colors hover:shadow-lg">
                      Continue to Checkout
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-5 left-0 right-0 z-30 lg:hidden">
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex items-center gap-4 rounded-2xl bg-black px-5 py-4">
            <div className="flex-1">
              <p className="text-2xl font-extrabold text-white">{formatCurrency(total)}</p>
              <p className="text-sm text-white/80">Grand Total</p>
            </div>
            {productDetails.length > 0 && ( 
              <Link to="/booking" className="flex-1">
                <button className="w-full rounded-full bg-[#d14a1e] px-6 py-3 text-center font-semibold text-white hover:bg-[#b8401a] transition-colors">
                  Continue
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile spacing for bottom nav */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}