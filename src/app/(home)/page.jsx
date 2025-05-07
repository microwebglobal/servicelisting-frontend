"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CitySelector from "@components/home/CitySelector";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {
  ArrowRight,
  Calendar,
  Check,
  CircleCheckBig,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import ServiceCard from "@/components/home/ServiceCard";
import CountUp from "react-countup";
import { useToast } from "@/hooks/use-toast";
import { FaAppStore, FaGooglePlay } from "react-icons/fa";
import { serviceAPI } from "@/api/services";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import PageSection from "@/components/PageSection";
import AnimatedButton from "@/components/home/AnimatedButton";
import SectionBadge from "@/components/home/SectionBadge";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { toast } = useToast();
  // Fetch categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesResponse = await serviceAPI.getAllCategories();
        const sortedCategories = [...categoriesResponse.data].sort(
          (a, b) => a.display_order - b.display_order
        );

        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const steps = [
    {
      title: "Book Your Service",
      description:
        "Choose from our wide range of services available in your city.",
      icon: <Calendar size={40} className="text-indigo-600" />,
      img: "/assets/images/step1.png",
    },
    {
      title: "Confirm & Schedule",
      description: "Pick a date and time that works best for you.",
      icon: <ListChecks size={40} className="text-indigo-600" />,
      img: "/assets/images/step2.png",
    },
    {
      title: "Enjoy & Relax",
      description: "Our professionals will take care of everything for you.",
      icon: <ShieldCheck size={40} className="text-indigo-600" />,
      img: "/assets/images/step3.png",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative mt-10 pb-28 pt-16 lg:py-32 flex flex-col justify-center items-center text-white overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full h-full"
          >
            {/* Slide 1 */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image
                  src="/assets/images/herobg-5.jpg"
                  alt="Home Maintenance 1"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            </SwiperSlide>

            {/* Slide 2 */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image
                  src="/assets/images/herobg-6.jpg"
                  alt="Home Maintenance 2"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            </SwiperSlide>

            {/* Slide 3 */}
            <SwiperSlide>
              <div className="relative w-full h-full">
                <Image
                  src="/assets/images/herobg-7.jpg"
                  alt="Home Maintenance 3"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 px-6 sm:px-6 md:px-8 lg:px-10 text-center flex flex-col items-center justify-center w-full max-w-6xl pb-28 space-y-8 sm:space-y-10"
        >
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            Find Trusted Professionals <br className="hidden sm:block" /> In
            Just a Click!
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-3xl space-y-5">
            <CitySelector />

            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Need help finding the right service for you?{" "}
              <br className="md:hidden" />
              <Link href="" className="underline font-medium">
                Chat with us
              </Link>
            </p>
          </div>

          <Link href="/services">
            <motion.button
              onClick={() =>
                document
                  .getElementById("services-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-indigo-500 text-white font-semibold text-sm sm:text-base md:text-lg rounded-full hover:bg-blue-700 transition shadow-md"
            >
              View all services
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-0 w-full py-6 sm:py-8 md:py-10 bg-white/90 shadow-md"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-blue-600 text-sm sm:text-base md:text-lg px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center space-y-1">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl">
                <CountUp start={0} end={2400} duration={2.75} suffix=" +" />
              </span>

              <p className="text-xs sm:text-sm text-primary">JOBS COMPLETED</p>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl">
                <CountUp start={0} end={52} duration={3.75} suffix=" +" />
              </span>

              <p className="text-xs sm:text-sm text-primary">EXPERTS</p>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl">
                <CountUp start={0} end={96} duration={2.75} suffix=" %" />
              </span>

              <p className="text-xs sm:text-sm text-primary">
                RATED THEIR PRO PERFECT
              </p>
            </div>

            <div className="flex flex-col items-center space-y-1">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl">
                <CountUp start={0} end={32} duration={3.75} suffix=" +" />
              </span>

              <p className="text-xs sm:text-sm text-primary">
                SERVICE CATEGORIES
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Professionals Section */}
      <PageSection className="bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:flex-row gap-10 lg:gap-20"
        >
          <div className="w-full h-full lg:w-1/2">
            <Image
              src="/assets/images/roof_work.jpg"
              alt="Professional"
              priority
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-xl hover:scale-105 transition-all duration-300"
            />
          </div>

          <div className="w-full h-full lg:w-1/2 text-left">
            <SectionBadge>About Us</SectionBadge>

            <div className="space-y-7 mt-4">
              <h2 className="text-3xl md:text-4xl font-bold">
                Trusted Professionals for Your Home Services
              </h2>

              <p className="text-gray-600">
                Finding reliable professionals for your home services has never
                been easier. Our team of skilled experts is committed to
                delivering top-quality solutions tailored to your needs.
              </p>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-20 lg:pl-2 items-start">
                <div>
                  <ul className="list-inside space-y-4">
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      Trusted Professionals
                    </li>
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      Seamless Booking
                    </li>
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      Customizable Solutions
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className="list-inside space-y-4">
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      Experienced Experts
                    </li>
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      24/7 Availability
                    </li>
                    <li className="flex items-center gap-4 hover:text-[#5f60b9] transition-colors duration-300">
                      <CircleCheckBig className="text-[#5f60b9] size-4" />
                      Guaranteed Satisfaction
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/about" className="block mt-10 lg:mt-12">
              <AnimatedButton icon={ArrowRight} title="About us" />
            </Link>
          </div>
        </motion.div>
      </PageSection>

      {/* Services Section */}
      <section className="bg-gray-100 pt-20 pb-14 px-4 items-center justify-center">
        <div className="max-w-7xl mx-auto px-5 lg:px-0">
          {/* First Row: Display 3 cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SectionBadge>What We Do</SectionBadge>

            <div className="flex items-center justify-between mt-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>

              <Link href="/services">
                <AnimatedButton title="Explore More" />
              </Link>
            </div>

            <p className="text-gray-600 mt-2">
              We always deliver a wide range of high quality services at
              affordable prices.
            </p>

            <div className="mx-auto max-w-xs md:max-w-xl lg:max-w-5xl xl:max-w-7xl mt-8 md:mt-2">
              <Carousel>
                <CarouselContent>
                  {categories.slice(0, 10).map((serv, index) => (
                    <CarouselItem
                      key={index}
                      className="md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                    >
                      <ServiceCard
                        key={index}
                        name={serv.name}
                        icon={serv.icon_url}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <PageSection className="bg-gradient-to-b from-[#F6F7F9] to-[#F0F0FA] py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full text-center space-y-16"
        >
          <div className="space-y-5">
            <SectionBadge>How It Works</SectionBadge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              How does <span className="text-[#5f60b9]">QProz</span> work?
            </h2>
          </div>

          <div className="relative w-full px-4">
            <ul className="relative z-10 flex flex-col items-center lg:flex-row md:justify-center">
              {steps.map((step, idx) => (
                <React.Fragment key={idx}>
                  {/* Step item */}
                  <li className="flex-none flex flex-col items-center text-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.2 }}
                      className="p-4 bg-indigo-100 rounded-full"
                    >
                      {step.icon}
                    </motion.div>
                    <h3 className="font-bold text-xl text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 max-w-xs">{step.description}</p>
                  </li>

                  {/* Connector: vertical on mobile, horizontal on md+ */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-none border-dashed border-indigo-600/50 border-l-2 h-12 w-0 my-4 lg:border-l-0 lg:border-t-2 lg:h-0 lg:w-24 lg:mx-4 lg:my-0`}
                    />
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </motion.div>
      </PageSection>

      {/* CTA Section */}
      <motion.section className="text-center flex justify-center bg-gradient-to-b from-[#F0F0FA] to-[#e5e5fc] px-8 py-20 md:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center max-w-7xl">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <Image
              src="/assets/images/download-app.jpg"
              alt="Professional"
              width={666}
              height={455}
              className="w-full rounded-3xl shadow-xl transition-transform transform hover:scale-105 duration-500"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 lg:ml-24 -mr-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-left text-gray-900 leading-tight">
              Download the <br />
              mobile app today!
            </h2>

            <p className="text-left pr-10 tracking-tight text-gray-600 mb-6 leading-relaxed">
              Experience seamless services at your fingertips. Get instant
              access, connect with top professionals, and manage everything
              effortlessly—all in one place.
            </p>

            <div className="flex mt-10 gap-4 justify-center lg:justify-start -ml-10 sm:ml-0">
              <button className="bg-black text-white h-14 px-6 py-2 rounded-md flex items-center gap-3 transition-transform transform hover:scale-105 duration-300">
                <FaGooglePlay size={24} />
                Google Play
              </button>
              <button className="bg-black text-white h-14 px-6 py-2 rounded-md flex items-center gap-3 transition-transform transform hover:scale-105 duration-300">
                <FaAppStore size={24} />
                App Store
              </button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
