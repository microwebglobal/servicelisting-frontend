"use client";
import React, { useState } from "react";
import Navbar from "@components/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaLocationCrosshairs } from "react-icons/fa6";
import Footer from "@components/Footer";

const Home = () => {
  const router = useRouter();
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

  const cities = ["Chennai", "Madurai", "Bangalore", "Mumbai", "Hyderabad"];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      setFilteredCities(
        cities.filter((city) =>
          city.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchTerm(city);
    router.push(`/services/${city.toLowerCase()}`);
  };

  return (
    <div className="">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="ml-20 py-12 justify-between flex">
        <div className="w-5/6">
          <h1 className="text-5xl font-bold leading-tight mt-20 tracking-wider">
            Your Home, Our Expertise <br />– Book{" "}
            <span className=" underline"> Trusted</span> Professionals in Just a
            Click!
          </h1>
          <p className="text-gray-600 mt-4 mb-10">
            Discover a world of trusted professionals ready to transform your
            home with top-notch services tailored to your needs. Simply search
            your city below to explore the services available in your area and
            start your hassle-free booking journey today!
          </p>
          <div className="relative">
            <input
              type="text"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              placeholder="Search for a location"
              style={{ width: "500px" }}
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="px-4 py-4 bg-indigo-500 text-white rounded-xl hover:bg-blue-600 transition ml-4">
              <FaLocationCrosshairs />
            </button>

            {filteredCities.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 mt-2 w-full rounded-md shadow-lg">
                {filteredCities.map((city, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* India map */}
        <div className="mt-6">
          <Image
            src="/assets/images/india_map.png"
            alt="India Map"
            width={1100}
            height={1100}
            className=" mx-auto"
          />
        </div>
      </section>

      {/* Steps Section */}
      <section
        className="flex gap-20 justify-between items-center py-16 bg-gray-50"
        style={{ height: "680px" }}
      >
        <Image
          src="/assets/images/home_worker.png"
          alt="Professional"
          width={640}
          height={618}
          className="w-1/2"
        />
        <div className="mr-20 w-1/2">
          <h2
            className="text-4xl font-bold mb-8"
            style={{ fontSize: "48px", lineHeight: "1.3" }}
          >
            How does [App Name] work?
          </h2>
          <ul className="list-decimal pl-8 marker:text-indigo-600 marker:font-bold marker:text-5xl marker:relative marker:top-2">
            <li className="mb-4 list-item">
              <div className="flex gap-10">
                <span className="font-bold text-xl">
                  Book your <br />
                  preferred service
                </span>
                <span className="text-gray-600">
                  Select from our wide catalogue of services that
                  <br /> are available in your city
                </span>
              </div>
            </li>
            <li className="mb-4 list-item">
              <div className="flex gap-10">
                <span className="font-bold text-xl">
                  Book your <br />
                  preferred service
                </span>
                <span className="text-gray-600">
                  After booking your services, we will put you in touch <br />
                  with our home service professionals immediately
                </span>
              </div>
            </li>
            <li className="mb-4 list-item">
              <div className="flex gap-10">
                <span className="font-bold text-xl">
                  Book your <br />
                  preferred service
                </span>
                <span className="text-gray-600">
                  Once your professional arrives, they will complete <br /> your
                  service with ease
                </span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-100 py-20">
        <h2
          className="text-center text-4xl font-bold mb-20"
          style={{ fontSize: "48px" }}
        >
          Our Services
        </h2>
        <div className="max-w-6xl mx-auto space-y-16">
          {/* First Row: Display 3 cards */}
          <div className="grid grid-cols-5 gap-6">
            {services.slice(0, 5).map((serv, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white shadow rounded-xl"
              >
                <div className=" text-white flex justify-center items-center rounded-xl mb-2">
                  <Image
                    src="/assets/images/plumbing_icon.png"
                    alt="Professional"
                    width={220}
                    height={100}
                    className="rounded-t-xl"
                  />
                </div>
                <p className="text-gray-700 p-3 font-semibold">{serv}</p>
              </div>
            ))}
          </div>
          {/* Subsequent Rows: Display 4 cards per row */}
          <div className="grid grid-cols-6 gap-6">
            {services.slice(5).map((serv, index) => (
              <div
                key={index + 3} // Adjust index to ensure unique keys
                className="flex flex-col items-center bg-white shadow rounded-xl"
              >
                <div className="  text-white flex justify-center items-center rounded-full mb-2">
                  <Image
                    src="/assets/images/plumbing_icon.png"
                    alt="Professional"
                    width={640}
                    height={618}
                    className="rounded-t-xl"
                  />
                </div>
                <p className="text-gray-700 p-3 font-semibold">{serv}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-16 items-center justify-center bg-gradient-to-b from-[#F6F7F9] to-[#F0F0FA]">
        <div className="flex ml-32 mb-32">
          <div className="w-1/2 mr-40">
            <h2
              className="text-4xl font-bold mb-10 tracking-wider"
              style={{ fontSize: "48px", lineHeight: "1.3" }}
            >
              Professionals for <br /> your home services
            </h2>
            <p className="text-justify mr-40">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae sunt, eligendi quam consequuntur voluptatibus minus
              voluptatem dolorum nemo aliquid reiciendis.
            </p>
            <div className="flex gap-10">
              <div>
                <ul className="list-inside pl-5 text-gray-600 space-y-2 mt-10">
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Trusted Professionals
                  </li>
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Seamless Booking
                  </li>
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Customizable Solutions
                  </li>
                </ul>
              </div>
              <div>
                <ul className="list-inside pl-5 text-gray-600 space-y-2 mt-10">
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Trusted Professionals
                  </li>
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Seamless Booking
                  </li>
                  <li className="before:content-['✔'] before:text-violet-500 before:mr-2">
                    Customizable Solutions
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <Image
            src="/assets/images/roofwork_home.png"
            alt="Professional"
            width={150}
            height={500}
            className="w-1/3"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center flex justify-between  bg-gradient-to-b from-[#F0F0FA] to-[#e5e5fc]">
        <div className="ml-32">
          <h2
            className="text-2xl text-left font-bold mb-4 mt-10"
            style={{
              fontSize: "48px",
              letterSpacing: "2px",
              lineHeight: "1.5",
            }}
          >
            Download the <br />
            mobile app today!
          </h2>
          <div className="flex gap-4 mt-5">
            <button className="bg-black text-white px-6 py-2 rounded">
              Google Play
            </button>
            <button className="bg-black text-white px-6 py-2 rounded">
              App Store
            </button>
          </div>
        </div>
        <Image
          src="/assets/images/homeowner_home.png"
          alt="Professional"
          width={666}
          height={455}
        />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
