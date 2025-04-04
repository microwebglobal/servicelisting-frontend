"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import Footer from "@components/Footer";
import CitySelector from "@components/home/CitySelector";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Calendar, ListChecks, ShieldCheck } from "lucide-react";
import ServiceCard from "@/components/home/ServiceCard";
import CountUp from "react-countup";
import { useToast } from "@/hooks/use-toast";
import { FaAppStore, FaGooglePay, FaGooglePlay } from "react-icons/fa";
import { serviceAPI } from "@/api/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SparklesIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative mt-10 py-24 flex flex-col justify-center items-center text-white overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={10}
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
                  layout="fill"
                  objectFit="cover"
                  priority
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
                  layout="fill"
                  objectFit="cover"
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
                  layout="fill"
                  objectFit="cover"
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
          className="z-10 px-4 sm:px-6 md:px-8 lg:px-10 text-center flex flex-col items-center justify-center w-full max-w-6xl pb-28 sm:pb-32 md:pb-40 space-y-8 sm:space-y-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
            Find Trusted Professionals <br className="hidden sm:block" /> In
            Just a Click!
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-3xl space-y-5">
            <CitySelector />

            <p className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Need help finding the right service for you?{" "}
              <Link href="" className="underline font-medium">
                Chat with us
              </Link>
            </p>
          </div>

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
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-0 w-full py-6 sm:py-8 md:py-10 bg-white bg-opacity-90 shadow-md"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-black text-sm sm:text-base md:text-lg px-4 sm:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-blue-600">
                <CountUp start={0} end={2400} duration={2.75} suffix=" +" />
              </span>
              <p className="text-xs sm:text-sm">JOBS COMPLETED</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-blue-600">
                <CountUp start={0} end={52} duration={3.75} suffix=" +" />
              </span>
              <p className="text-xs sm:text-sm">EXPERTS</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-blue-600">
                <CountUp start={0} end={96} duration={2.75} suffix=" %" />
              </span>
              <p className="text-xs sm:text-sm">RATED THEIR PRO PERFECT</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-bold text-2xl sm:text-3xl md:text-4xl text-blue-600">
                <CountUp start={0} end={32} duration={3.75} suffix=" +" />
              </span>
              <p className="text-xs sm:text-sm">SERVICE CATEGORIES</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white px-4 flex justify-center">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between items-center max-w-7xl py-2">
          {/* Left Side - Image */}
          <div className="lg:w-1/2 h-full">
            <Image
              src="/assets/images/how_app_work.jpg"
              alt="Professional"
              width={440}
              height={418}
              className="w-full h-full object-cover drop-shadow-lg rounded-xl"
            />
          </div>

          {/* Right Side - Steps */}
          <motion.div
            initial={{ opacity: 0, x: 30, transform: "none" }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-center lg:text-left font-bold mb-10 text-gray-900 p-3">
              How does <span className="text-indigo-600">QProz</span> work?
            </h2>

            <ul className="text-lg">
              {steps.map((step, index) => (
                <li key={index} className="mb-10 list-item">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.3 }}
                    className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center text-center lg:text-left"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full">
                      {step.icon}
                    </div>

                    {/* Text Content */}
                    <div>
                      <span className="font-bold text-xl text-gray-900">
                        {step.title}
                      </span>
                      <p className="text-gray-600 lg:pr-16">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services-section"
        className="bg-gray-100 py-20 px-4 items-center justify-center text-center"
      >
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-5"
        >
          Our Services
        </motion.h2>
        <div className="max-w-6xl mx-auto space-y-2">
          {/* First Row: Display 3 cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-xs md:max-w-xl lg:max-w-5xl xl:max-w-7xl"
          >
            <Carousel>
              <CarouselContent>
                {categories.slice(0, 10).map((serv, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
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
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="mt-10 sm:mt-10 px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-3 bg-indigo-500 text-white font-semibold text-sm sm:text-base md:text-lg rounded-full hover:bg-blue-700 transition shadow-md"
          >
            View all services
          </motion.button>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16 bg-gradient-to-b from-[#F6F7F9] to-[#F0F0FA] px-4 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center lg:flex-row gap-10 lg:gap-20 max-w-7xl"
        >
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10"
            >
              Trusted Professionals for Your Home Services
            </motion.h2>

            <p className="text-gray-600 mb-8 text-lg">
              Finding reliable professionals for your home services has never
              been easier. Our team of skilled experts is committed to
              delivering top-quality solutions tailored to your needs. Whether
              you require repairs, installations, or maintenance, we ensure a
              seamless and stress-free experience.
            </p>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-center -ml-8 lg:items-start textl-lg">
              <div>
                <ul className="list-inside pl-5 text-gray-600 space-y-4">
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    Trusted Professionals
                  </li>
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    Seamless Booking
                  </li>
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    Customizable Solutions
                  </li>
                </ul>
              </div>
              <div>
                <ul className="list-inside pl-5 text-gray-600 space-y-4">
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    Experienced Experts
                  </li>
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    24/7 Availability
                  </li>
                  <li className="flex items-center before:content-['✔'] before:text-violet-500 before:mr-4 before:text-xl hover:text-violet-500 transition-colors duration-300">
                    Guaranteed Satisfaction
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="w-full h-full lg:w-1/2">
            <Image
              src="/assets/images/roof_work.jpg"
              alt="Professional"
              width={600}
              height={600}
              className="w-full h-full object-cover rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section className="text-center flex justify-center  bg-gradient-to-b from-[#F0F0FA] to-[#e5e5fc] px-8 py-16 md:px-16">
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-left text-gray-900 leading-tight">
              Download the <br />
              mobile app today!
            </h2>
            <p className="text-lg text-left pr-10 md:text-xl tracking-tight text-gray-600 mb-6 leading-relaxed">
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="min-w-[300px] max-w-md text-center bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="bg-indigo-500 p-3 rounded-full shadow-md">
              <SparklesIcon className="text-white w-8 h-8" />
            </div>

            <DialogHeader className="mt-4">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Coming Soon...
              </DialogTitle>
            </DialogHeader>

            <p className="text-gray-600 mt-2 text-lg">
              We're working hard to bring you great services. Stay tuned for
              updates!
            </p>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 px-5 py-2 text-white bg-indigo-500 hover:bg-indigo-600 rounded-full shadow-md transition"
            >
              Got it!
            </button>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
