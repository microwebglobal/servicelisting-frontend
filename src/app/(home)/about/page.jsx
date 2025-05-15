"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaUsers, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className="bg-gray-100 text-gray-900 overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative w-full pb-28 pt-24 lg:pb-32 lg:pt-[9.5rem] flex flex-col justify-center items-center text-center bg-cover"
        style={{ backgroundImage: "url('/assets/images/about-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-5xl space-y-6 px-5">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg text-white"
          >
            India’s Best{" "}
            <span className="text-blue-400">Home Service Marketplace</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
          >
            Find trusted professionals for home maintenance, beauty, appliance
            repairs, and more! We connect customers with skilled experts across
            major cities in India for hassle-free service.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            className="text-gray-200 text-sm sm:text-base md:text-lg max-w-2xl mx-auto"
          >
            Serving major cities: Mumbai, Delhi, Bangalore, Chennai, Hyderabad,
            Kolkata, Pune, and more!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              className="bg-indigo-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
              onClick={() => router.push("/services")}
            >
              Explore Services
            </button>
            <button
              className="bg-white text-indigo-500 hover:text-blue-700 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
              onClick={() => router.push("/registration/provider")}
            >
              Become a Service Partner
            </button>
          </motion.div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Our Mission & Vision
            </h2>

            <p className="mt-10 text-gray-600">
              Our mission is to revolutionize home services by seamlessly
              connecting skilled professionals with customers in need of
              reliable, high-quality assistance. We strive to eliminate the
              hassle of finding trustworthy service providers by offering a{" "}
              transparent, efficient, and technology-driven platform.
              <br />
              <br />
              Whether it's home maintenance, beauty services, appliance repairs,
              or deep cleaning, we ensure that every service is delivered with
              expertise, punctuality, and professionalism. By partnering with
              highly trained and verified professionals, we empower both service
              providers and homeowners, creating opportunities for skilled
              workers while enhancing customer convenience.
              <br />
              <br />
              Our vision is to bridge the service accessibility gap across major
              cities and rural areas, making top-tier home services available to
              everyone. Through our commitment to affordability, trust, and ease
              of booking, we aim to redefine how people experience home
              services—making it smoother, safer, and more reliable than ever
              before.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="lg:w-2/5"
          >
            <Image
              src="/assets/images/india_map.png"
              alt="Service Areas in India"
              width={300}
              height={250}
              className="rounded-3xl shadow-lg w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Why Choose Us?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 mt-10 max-w-7xl mx-auto">
          {[
            {
              icon: <FaUsers size={40} className="text-blue-500" />,
              title: "Expert Professionals",
              desc: "We connect you with verified, top-rated service providers to guarantee the best results.",
            },
            {
              icon: <FaMoneyBillWave size={40} className="text-green-500" />,
              title: "Affordable Prices",
              desc: "Transparent pricing with no hidden costs—premium service at the best price.",
            },
            {
              icon: <FaClock size={40} className="text-yellow-500" />,
              title: "Quick & Reliable",
              desc: "Book services in a few clicks and get them delivered on time, without hassle.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-6 bg-gray-100 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-10 mt-10 max-w-7xl mx-auto">
          {[
            {
              img: "/assets/images/choose-service.jpg",
              title: "Choose a Service",
              desc: "Browse an extensive range of services, from plumbing to salon treatments, **tailored to your needs.**",
            },
            {
              img: "/assets/images/book-appintment.jpg",
              title: "Book an Appointment",
              desc: "Schedule a service at your convenience and **get instant confirmation with secure payment options.**",
            },
            {
              img: "/assets/images/provider-arrive.jpg",
              title: "Provider Arrives & Completes Service",
              desc: "A verified professional arrives at your location **on time** and completes the service efficiently.",
            },
            {
              img: "/assets/images/relax-enjoy.jpg",
              title: "Relax & Enjoy",
              desc: "Sit back and enjoy hassle-free service, knowing everything is handled by experts.",
            },
          ].map((process, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative bg-cover bg-center rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{
                backgroundImage: `url(${process.img})`,
                height: "300px",
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center px-6">
                <h4 className="text-xl font-bold text-white">
                  {process.title}
                </h4>
                <p className="mt-2 text-white">{process.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="flex flex-col-reverse md:flex-row items-center gap-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="md:w-2/5"
          >
            <Image
              src="/assets/images/our-story.jpg"
              alt="Our Story"
              width={300}
              height={250}
              className="rounded-3xl shadow-lg w-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
            <p className="mt-6 text-gray-600">
              What started as a small initiative to connect skilled workers with
              customers has grown into India’s leading home service marketplace.
              We noticed the gap between professionals looking for work and
              homeowners struggling to find reliable services.
              <br />
              <br />
              With **passion and innovation**, we built a seamless, trusted, and
              technology-driven platform that empowers both service providers
              and customers alike. Every day, we bring convenience,
              affordability, and expertise to thousands of homes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-500 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Ready to Experience Hassle-Free Services?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mt-4 max-w-3xl mx-auto"
        >
          Whether you need a quick repair or a relaxing spa session at home, we
          have you covered. Find your service today or join us as a trusted
          service provider!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            className="bg-white text-black hover:text-indigo-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
            onClick={() => router.push("/services")}
          >
            Explore Services
          </button>
          <button
            className="bg-gray-100 text-black hover:text-indigo-500 px-6 py-3 rounded-lg text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
            onClick={() => router.push("/registration/provider")}
          >
            Become a Service Partner
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default Page;
