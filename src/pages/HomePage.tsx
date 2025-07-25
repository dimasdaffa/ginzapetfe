import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Category, Product } from "../types/type";
import apiClient from "../services/apiServices";
import { Link } from "react-router-dom";

const fetchCategories = async () => {
  const response = await apiClient.get("/categories"); // Assuming the API returns an array of Category
  return response.data.data; // Adjust if API response structure is different (e.g., response.data)
};

const fetchProducts = async () => {
  const response = await apiClient.get("/products?limit=5&is_popular=1"); // Assuming the API returns an array of Product
  return response.data.data; // Adjust if API response structure is different
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]); // Cannot find name 'Category'.
  const [products, setProducts] = useState<Product[]>([]); // Assuming Product is defined.
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load categories");
        // console.error("Failed to fetch categories:", err); // Optional: for debugging
      } finally {
        setLoadingCategories(false);
      }
    };

    const getProductsData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError("Failed to load products");
        // console.error("Failed to fetch products:", err); // Optional: for debugging
      } finally {
        setLoadingProducts(false);
      }
    };

    getCategoriesData();
    getProductsData();
  }, []);

  if (loadingCategories && loadingProducts) {
    return <p>Loading categories and products...</p>;
  }

  if (error) {
    return <p>Error loading data: {error}</p>;
  }
  // Format currency to IDR
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const BASE_URL = import.meta.env.VITE_REACT_API_STORAGE_URL;

  return (
    <main className="relative mx-auto w-full max-w-[640px] overflow-hidden bg-white pb-[142px]">
      <div id="Background" className="absolute left-0 right-0 top-0">
        <img
          src="assets/images/backgrounds/home-banner.png"
          alt="image"
          className="h-[349.02px] w-full object-cover object-bottom"
        />
      </div>
      <section id="NavTop" className="fixed left-0 right-0 top-5 z-30">
        <div className="relative mx-auto max-w-[640px] px-5">
          <div className="flex items-center justify-between rounded-[22px] bg-white px-4 py-[14px]">
            <a href="#">
              <img
                src="assets/images/logos/company.svg"
                alt="icon"
                className="h-[40px] w-[114px] shrink-0"
              />
            </a>
            <ul className="flex items-center gap-[10px]">
              <li className="shrink-0">
                <a href="#">
                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-ginzapet-graylight">
                    <img
                      src="assets/images/icons/notification.svg"
                      alt="icon"
                      className="h-[22px] w-[22px] shrink-0"
                    />
                  </div>
                </a>
              </li>
              <li className="shrink-0">
                <Link to="/cart">
                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-ginzapet-graylight">
                    <img
                      src="assets/images/icons/cart.svg"
                      alt="icon"
                      className="h-[22px] w-[22px] shrink-0"
                    />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <header className="relative ml-5 mt-[128px] w-[246px]">
        <h1 className="text-[32px] font-extrabold leading-[46px]">
          Discover Top Products
        </h1>
      </header>
      <section
        id="Categories"
        className="swiper mt-[40px] w-full overflow-x-hidden"
      >
        <div className="pb-5">
          <Swiper
            className="swiper-wrapper"
            direction="horizontal"
            spaceBetween={20}
            slidesPerView="auto"
            slidesOffsetAfter={20}
            slidesOffsetBefore={20}
          >
            {categories.length > 0
              ? categories.map((category) => (
                  <SwiperSlide
                    key={category.id}
                    className="swiper-slide !w-fit"
                  >
                    <Link to={`/category/${category.slug}`} className="card">
                      <div className="shrink-0 space-y-3 rounded-[24px] border border-x-ginzapet-graylight bg-white py-4 text-center transition-all duration-300 hover:border-ginzapet-orange">
                        <div className="mx-auto flex h-[70px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-full">
                          <img
                            src={`${BASE_URL}/${category.photo}`}
                            alt="icon"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-[130px] flex-col gap-[2px]">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm leading-[21px] text-ginzapet-gray">
                            {category.products_count} Products
                          </p>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              : "Belum ada kategori yang ditampilkan"}
          </Swiper>
        </div>
      </section>
      <section id="Adverticement" className="relative px-5">
        <a href="#">
          <img src="assets/images/backgrounds/adverticement.png" alt="icon" />
        </a>
      </section>
      <section id="PopularSummer" className="mt-[30px] space-y-[14px]">
        <h2 className="pl-5 text-[18px] font-bold leading-[27px]">
          Popular This Summer
        </h2>
        <div
          id="PopularSummerSlider"
          className="swiper w-full overflow-x-hidden"
        >
          <Swiper
            className="swiper-wrapper pb-[30px]"
            direction="horizontal"
            spaceBetween={20}
            slidesPerView="auto"
            slidesOffsetAfter={20}
            slidesOffsetBefore={20}
          >
            {products.length > 0
              ? products.map((product) => (
                  <SwiperSlide key={product.id} className="swiper-slide !w-fit">
                    <Link to={`/product/${product.slug}`}className="card">
                      <div className="relative flex w-[230px] shrink-0 flex-col gap-[12px] overflow-hidden rounded-[24px] border border-ginzapet-graylight bg-white p-4 transition-all duration-300 hover:border-ginzapet-orange">
                     
                        <div className="flex h-[140px] w-full shrink-0 items-center justify-center overflow-hidden rounded-[16px] bg-[#D9D9D9]">
                          <img
                            src={`${BASE_URL}/${product.thumbnail}`}
                            alt="image"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="line-clamp-2 min-h-[48px] font-semibold">
                          {product.name}
                        </h3>
                        <div className="flex flex-col gap-y-3">
                          <div className="flex items-center gap-2">
                            <img
                              src="assets/images/icons/date.svg"
                              alt="icon"
                              className="h-5 w-5 shrink-0"
                            />
                            <p className="text-sm leading-[21px] text-ginzapet-gray">
                              {product.category.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              src="assets/images/icons/clock.svg"
                              alt="icon"
                              className="h-5 w-5 shrink-0"
                            />
                            <p className="text-sm leading-[21px] text-ginzapet-gray">
                              {product.stok} stok tersedia
                            </p>
                          </div>
                          <strong className="font-semibold text-ginzapet-orange">
                            {formatCurrency(product.price)}
                          </strong>
                          <img
                            className="absolute bottom-0 right-0"
                            src="assets/images/backgrounds/decoration.svg"
                            alt="icon"
                          />
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))
              : "Belum ada services yang ditampilkan"}
          </Swiper>
        </div>
      </section>
      <nav className="fixed bottom-5 left-0 right-0 z-30 mx-auto w-full">
        <div className="mx-auto max-w-[640px] px-5">
          <div className="rounded-[24px] bg-ginzapet-black px-[20px] py-[14px]">
            <ul className="flex items-center gap-[20.30px]">
              <li className="w-full">
                <Link to={"/"}>
                  <div className="flex items-center justify-center gap-2 rounded-full bg-ginzapet-orange px-[18px] py-[10px] transition-all duration-300 hover:shadow-[0px_4px_10px_0px_#D04B1E80]">
                    <img
                      src="assets/images/icons/browse.svg"
                      alt="icon"
                      className="h-6 w-6 shrink-0"
                    />
                    <p className="text-sm font-semibold leading-[21px] text-white">
                      Browse
                    </p>
                  </div>
                </Link>
              </li>
              <li className="shrink-0">
                <Link to={"/my-booking"}>
                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-ginzapet-graylight transition-all duration-300 hover:border-ginzapet-orange">
                    <img
                      src="assets/images/icons/note.svg"
                      alt="icon"
                      className="h-[22px] w-[22px] shrink-0"
                    />
                  </div>
                </Link>
              </li>
              <li className="shrink-0">
                <a href="#">
                  <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-ginzapet-graylight transition-all duration-300 hover:border-ginzapet-orange">
                    <img
                      src="assets/images/icons/profil.svg"
                      alt="icon"
                      className="h-[22px] w-[22px] shrink-0"
                    />
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </main>
  );
}
