import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Category, Product } from "../types/type";
import apiClient from "../services/apiServices";
import { Link } from "react-router-dom";
import {
  Home,
  User,
  NotebookTabsIcon,
  ShoppingCart,
  Search,
} from "lucide-react"; // Import Search icon

const fetchCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data.data;
};

const fetchProducts = async () => {
  const response = await apiClient.get("/products?limit=5&is_popular=1");
  return response.data.data;
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(""); // New state for search term
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // New state for filtered products

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    const getProductsData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
        setFilteredProducts(productsData); // Initialize filtered products
      } catch (err) {
        setError("Failed to load products");
        console.error("Failed to fetch products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    getCategoriesData();
    getProductsData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const newFilteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredProducts(newFilteredProducts);
    }
  }, [searchTerm, products]); // Re-run when searchTerm or products change

  if (loadingCategories && loadingProducts) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-[#d14a1e] text-lg font-semibold">
          Loading categories and products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">
          Error loading data: {error}
        </p>
      </div>
    );
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed left-0 right-0 top-0 z-30 bg-white/95 backdrop-blur-sm border-b lg:relative lg:bg-white lg:border-none">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/images/logos/lobo.png"
                alt="Ginza Pet Shop"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 border-2 border-[#d14a1e] rounded-full"
              />
              <h1 className="text-[#d14a1e] font-bold text-lg sm:text-xl lg:text-2xl">
                Ginza Pet Shop
              </h1>
            </Link>

            <div className="flex items-center gap-3">
              {/* Search Input Field (Visible on Desktop) */}
              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#d14a1e] w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <div className="hidden lg:flex items-center gap-3">
                <Link to="/">
                  <div className=" flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#d14a1e] hover:bg-[#d14a1e] hover:text-white transition-colors">
                    <Home className="h-5 w-5" />
                  </div>
                </Link>
                {/* My Order Icon */}
                <Link to="/my-Order">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#d14a1e] hover:bg-[#d14a1e] hover:text-white transition-colors">
                    <NotebookTabsIcon className="h-5 w-5" />
                  </div>
                </Link>
                {/* Profile Icon */}
                <Link to="/profile">
                  <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#d14a1e] hover:bg-[#d14a1e] hover:text-white transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                </Link>
              </div>

              {/* Search Icon (Visible on Mobile, opens a search bar or page) */}
              <div className="lg:hidden">
                <input
                  type="text"
                  placeholder="Search products.."
                  className="p-2 border border-gray-300 rounded-full focus:outline-none focus:border-[#d14a1e] "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Cart Icon */}
              <Link to="/cart">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#d14a1e] hover:bg-[#d14a1e] hover:text-white transition-colors">
                  <ShoppingCart className="h-5 w-5 " />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 lg:pt-0">
        <section className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl">
              <img
                src="/assets/images/backgrounds/kucing.jpeg"
                alt="Advertisement"
                className="w-full h-48 sm:h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="px-6 lg:px-12">
                  <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    Summer Sale
                  </h2>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg">
                    Up to 50% off on selected items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-[#d14a1e] text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6 lg:mb-8">
              Categories
            </h2>

            {/* Mobile: Horizontal scroll using Swiper */}
            <div className="lg:hidden overflow-x-auto pb-4">
              <Swiper
                className="swiper-wrapper"
                direction="horizontal"
                spaceBetween={20}
                slidesPerView="auto"
                slidesOffsetAfter={20}
                slidesOffsetBefore={20}
              >
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SwiperSlide key={category.id} className="!w-fit">
                      <Link to={`/category/${category.slug}`}>
                        <div className="w-32 shrink-0 space-y-3 rounded-2xl border border-gray-200 bg-white p-4 text-center hover:border-[#d14a1e] transition-colors">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
                            <img
                              src={`${BASE_URL}/${category.photo}`}
                              alt={category.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {category.products_count} Products
                            </p>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <p className="text-gray-500 px-4">
                      Belum ada kategori yang ditampilkan
                    </p>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link key={category.id} to={`/category/${category.slug}`}>
                    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 text-center hover:border-[#d14a1e] hover:shadow-lg transition-all">
                      <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full">
                        <img
                          src={`${BASE_URL}/${category.photo}`}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.products_count} Products
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">
                  Belum ada kategori yang ditampilkan
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Popular Products Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-[#d14a1e] text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
              Popular This Summer
            </h2>

            {/* Mobile: Horizontal scroll using Swiper */}
            <div className="lg:hidden overflow-x-auto pb-4">
              <Swiper
                className="swiper-wrapper pb-[30px]"
                direction="horizontal"
                spaceBetween={20}
                slidesPerView="auto"
                slidesOffsetAfter={20}
                slidesOffsetBefore={20}
              >
                {filteredProducts.length > 0 ? ( // Use filteredProducts here
                  filteredProducts.map((product) => (
                    <SwiperSlide key={product.id} className="!w-fit">
                      <Link to={`/product/${product.slug}`}>
                        <div className="w-56 shrink-0 rounded-2xl border border-gray-200 bg-white p-4 hover:border-[#d14a1e] transition-colors">
                          <div className="mb-3 h-32 w-full overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={`${BASE_URL}/${product.thumbnail}`}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="font-semibold text-sm mb-3 line-clamp-2 min-h-[40px]">
                            {product.name}
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <img
                                src="/assets/images/icons/date.svg"
                                alt="Calendar icon"
                                className="h-4 w-4 text-gray-400"
                              />
                              <p className="text-xs text-gray-500">
                                {product.category.name}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <img
                                src="/assets/images/icons/clock.svg"
                                alt="Clock icon"
                                className="h-4 w-4 text-gray-400"
                              />
                              <p className="text-xs text-gray-500">
                                {product.stok} stok tersedia
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
                  <SwiperSlide>
                    <p className="text-gray-500 px-4">
                      Belum ada produk yang ditampilkan
                    </p>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? ( // Use filteredProducts here
                filteredProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.slug}`}>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-[#d14a1e] hover:shadow-lg transition-all">
                      <div className="mb-4 h-48 w-full overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={`${BASE_URL}/${product.thumbnail}`}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-4 line-clamp-2 min-h-[56px]">
                        {product.name}
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/images/icons/date.svg"
                            alt="Calendar icon"
                            className="h-5 w-5 text-gray-400"
                          />
                          <p className="text-sm text-gray-500">
                            {product.category.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src="/assets/images/icons/clock.svg"
                            alt="Clock icon"
                            className="h-5 w-5 text-gray-400"
                          />
                          <p className="text-sm text-gray-500">
                            {product.stok} stok tersedia
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
                <p className="text-gray-500">
                  Belum ada produk yang ditampilkan
                </p>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
        <div className="mx-auto max-w-2xl px-4 pb-4">
          <div className="rounded-2xl bg-black px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex-1">
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#d14a1e] px-4 py-2">
                  <Home className="h-5 w-5 text-white" />
                  <span className="text-sm font-semibold text-white">Home</span>
                </div>
              </Link>
              <Link to="/my-Order" className="ml-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d14a1e]">
                  <NotebookTabsIcon className="h-5 w-5 text-white" />
                </div>
              </Link>
              <Link to="/profile" className="ml-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d14a1e]">
                  <User className="h-5 w-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-gray-50 mt-16">
        <div className="mx-auto max-w-7xl px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/images/logos/lobo.png"
                  alt="Ginza Pet Shop"
                  className="h-10 w-10 border-2 border-[#d14a1e] rounded-full"
                />
                <h3 className="text-[#d14a1e] font-bold text-xl">
                  Ginza Pet Shop
                </h3>
              </div>
              <p className="text-gray-600">
                Your trusted partner for all pet needs.
              </p>
            </div>
            <div></div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link
                  to="/contact"
                  className="block text-gray-600 hover:text-[#d14a1e]"
                >
                  Contact Us
                </Link>
                <Link
                  to="/faq"
                  className="block text-gray-600 hover:text-[#d14a1e]"
                >
                  FAQ
                </Link>
                <Link
                  to="/help"
                  className="block text-gray-600 hover:text-[#d14a1e]"
                >
                  Help Center
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-600">
                <p>📧 info@ginzapetshop.com</p>
                <p>📞 +62 123 456 789</p>
                <p>📍 Semarang, Indonesia</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2025 Ginza Pet Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mobile spacing for bottom nav */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}
