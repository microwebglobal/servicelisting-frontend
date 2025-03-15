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

  const services = [
    "Plumbing",
    "Carpentry",
    "Saloon",
    "Home",
    "Service1",
    "Service2",
    "Service3",
    "Service4",
    "Service5",
    "Service6",
    "Service7",
  ];

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
      <section className="relative h-screen flex flex-col items-center text-center text-white pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10 h-4/6 mt-28 flex justify-center md:px-4 ">
          <div className="w-full h-full max-w-[1350px] mx-4 ">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop
              className="w-full h-full rounded-3xl shadow-lg overflow-hidden"
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/assets/images/herobg-5.jpg"
                    alt="Home Maintenance 1"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-3xl"
                    priority
                  />
                  <div className="absolute inset-0 bg-black opacity-30 rounded-3xl"></div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/assets/images/herobg-6.jpg"
                    alt="Home Maintenance 2"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-black opacity-30 rounded-3xl"></div>
                </div>
              </SwiperSlide>

              {/* Slide 3 */}
              <SwiperSlide>
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/assets/images/herobg-7.jpg"
                    alt="Home Maintenance 3"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-black opacity-30 rounded-3xl"></div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-20 md:mt-32 sm:mt-28 z-10 px-4 md:px-10 text-center flex flex-col items-center justify-center mx-auto my-auto w-full max-w-4xl"
        >
          <h1 className="text-3xl  sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-4 sm:mb-6 drop-shadow-lg">
            Book Trusted Professionals <br /> In Just a Click!
          </h1>
          <p className="mb-10 sm:mb-10 text-gray-200 text-sm sm:text-base md:text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque est
            ab impedit officiis autem aliquam quia suscipit laboriosam ipsam,
            quod nam quidem, dolorum sit minima accusamus debitis exercitationem
            quo quasi.
          </p>
          {/* Search Bar */}
          <CitySelector />
          <motion.button
            onClick={() =>
              document
                .getElementById("services-section")
                .scrollIntoView({ behavior: "smooth" })
            }
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 sm:mt-8 px-3 py-4 sm:px-3 sm:py-2 md:px-8 md:py-4 bg-indigo-500 text-white font-semibold text-sm sm:text-base md:text-lg rounded-full hover:bg-blue-700 transition shadow-md"
          >
            View all services
          </motion.button>
        </motion.div>

        {/* CTA Button */}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-0 w-full py-10 md:py-0 bg-white/90 backdrop-blur-md rounded-t-3xl shadow-md"
        >
          <div className="p-2 lg:flex grid grid-cols-2 sm:flex-row md:grid md:grid-cols-2 md:grid-rows-2 justify-center items-center py-4 gap-5 md:space-y-0 md:space-x-6 lg:space-x-10 xl:space-x-20 text-black text-sm sm:text-base md:text-lg">
            <div className="flex justify-center">
              <h3 className="text-center">
                <span className="block font-bold text-xl md:text-4xl text-blue-600 ">
                  <CountUp
                    start={0}
                    end={2400}
                    duration={2.75}
                    separator=" "
                    suffix=" +"
                  />
                </span>
                JOBS COMPLETED
              </h3>
            </div>

            <div className="flex justify-center">
              <h3 className="text-center">
                <span className="block font-bold text-xl md:text-4xl text-blue-600 mb-1 sm:mb-2">
                  <CountUp
                    start={0}
                    end={52}
                    duration={3.75}
                    separator=" "
                    suffix=" +"
                  />
                </span>
                EXPERTS
              </h3>
            </div>

            <div className="flex justify-center">
              <h3 className="text-center">
                <span className="block font-bold text-xl md:text-4xl text-blue-600 mb-1 ">
                  <CountUp
                    start={0}
                    end={96}
                    duration={2.75}
                    separator=" "
                    suffix=" %"
                  />
                </span>
                RATED THEIR PRO PERFECT
              </h3>
            </div>

            <div className="flex justify-center">
              <h3 className="text-center">
                <span className="block font-bold text-xl md:text-4xl text-blue-600 mb-1 sm:mb-2">
                  <CountUp
                    start={0}
                    end={32}
                    duration={3.75}
                    separator=" "
                    suffix=" +"
                  />
                </span>
                SERVICE CATEGORIES
              </h3>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between items-center py-16 bg-gradient-to-b from-gray-50 to-white px-4">
        {/* Left Side - Image */}
        <div className="lg:w-1/2">
          <Image
            src="/assets/images/how_app_work.jpg"
            alt="Professional"
            width={440}
            height={418}
            className="w-full drop-shadow-lg rounded-xl"
          />
        </div>

        {/* Right Side - Steps */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 lg:mr-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-gray-900 p-3">
            How does <span className="text-indigo-600">QProz</span> work?
          </h2>
          <ul className="list-decimal pl-8 marker:text-indigo-600 marker:font-bold marker:text-3xl lg:marker:text-4xl marker:relative marker:top-2">
            {steps.map((step, index) => (
              <li key={index} className="mb-10 list-item">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start"
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
                    <p className="text-gray-600 pr-5">{step.description}</p>
                  </div>
                </motion.div>
              </li>
            ))}
          </ul>
        </motion.div>
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
          className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-10"
        >
          Our Services
        </motion.h2>
        <div className="max-w-6xl mx-auto space-y-14">
          {/* First Row: Display 3 cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-3 md:grid-cols-5  gap-6"
          >
            {categories.slice(0, 10).map((serv, index) => (
              <ServiceCard key={index} name={serv.name} icon={serv.icon_url} />
            ))}
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 sm:mt-10 px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-3 bg-indigo-500 text-white font-semibold text-sm sm:text-base md:text-lg rounded-full hover:bg-blue-700 transition shadow-md"
          >
            View all services
          </motion.button>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16 items-center justify-center bg-gradient-to-b from-[#F6F7F9] to-[#F0F0FA] px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row gap-10 lg:gap-20 max-w-6xl mx-auto"
        >
          <div className="w-full lg:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mb-10"
            >
              Trusted Professionals for <br /> Your Home Services
            </motion.h2>
            <p className="text-gray-600 mb-8 text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae sunt, eligendi quam consequuntur voluptatibus minus
              voluptatem dolorum nemo aliquid reiciendis.
            </p>
            <div className="flex flex-col lg:flex-row gap-12">
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
          <div className="w-full lg:w-1/2">
            <Image
              src="/assets/images/roof_work.jpg"
              alt="Professional"
              width={600}
              height={600}
              className="w-full rounded-xl shadow-lg hover:scale-105 transition-all duration-300"
            />
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <motion.section className="text-center flex flex-col lg:flex-row justify-between items-center bg-gradient-to-b from-[#F0F0FA] to-[#e5e5fc] px-8 py-16 md:px-16">
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
          className="w-full lg:w-1/2 lg:ml-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-left text-gray-900 leading-tight">
            Download the <br />
            mobile app today!
          </h2>
          <p className="text-lg text-left pr-10 md:text-xl text-gray-600 mb-6 leading-relaxed">
            Experience seamless services at your fingertips. Get instant access,
            connect with top professionals, and manage everything
            effortlessly—all in one place.
          </p>

          <div className="flex mt-10 gap-4 justify-center lg:justify-start">
            <button className="bg-black text-white px-6 py-2 rounded-md flex items-center gap-3 transition-transform transform hover:scale-105 duration-300">
              <FaGooglePlay />
              Google Play
            </button>
            <button className="bg-black text-white px-6 py-2 rounded-md flex items-center gap-3 transition-transform transform hover:scale-105 duration-300">
              <FaAppStore />
              App Store
            </button>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
