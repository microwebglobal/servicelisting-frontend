"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import OTPVerification from "@components/CustomerReg";
import { useRouter } from "next/navigation";
import ProviderLocation from "@components/ProviderLocation";
import Image from "next/image";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../../utils/firebase.js";
import ProviderServices from "@components/ProviderServices.jsx";

const BusinessRegister = () => {
  const router = useRouter();
  const [step, setStep] = useState(0); // Track the current step
  const [userId, setUserId] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: "",
    user_name: "",
    email: "",
    mobile: "",
    photo: "path/to/photo.jpg",
    role: "service_provider",
  });
  const [providerProfile, setProviderProfile] = useState({
    u_id: "",
    business_type: "business",
    business_name: "",
    reg_number: "",
    gst_number: "",
    about: "",
  });

  const [providerLocation, setProviderLocation] = useState({
    address_type: "primary",
    street: "",
    city: "",
    state: "",
    postal_code: "",
    country: "india",
    long: "",
    lat: "",
  });

  const [documents, setDocuments] = useState({
    sp_id: "",
    doc_type: "",
    doc_url: "",
    verification_status: "pending", //set pending as initial
  });

  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // Handle user registration form submit
  const handleUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/otp/send-otp",
        {
          mobile: userDetails.mobile,
        }
      );

      setStep(2); // Go to OTP verification step
    } catch (err) {
      console.log(err);
    }
  };

  const handleProviderLocation = () => {};

  const handleLocationSubmit = (locationData) => {
    console.log("Received location data:", locationData);
    setProviderLocation({
      address_type: "primary",
      street: locationData.street,
      city: locationData.city,
      state: locationData.state,
      postal_code: locationData.postal_code,
      country: "india",
      long: locationData.long,
      lat: locationData.lat,
    });

    console.log(providerLocation);
    setStep(1);
  };

  useEffect(() => {
    console.log("Updated providerLocation:", providerLocation);
  }, [providerLocation]);

  // Handle OTP verification after sending OTP
  const handleVerification = async (otp) => {
    try {
      const response = await axios.post("http://localhost:8080/api/users/", {
        ...userDetails,
        otp,
      });
      console.log(response);
      localStorage.setItem("uId", response.data.u_id);

      const requestBody = {
        u_id: response.data.u_id,
        address_type: "primary",
        street: providerLocation.street,
        city: providerLocation.city,
        state: providerLocation.state,
        postal_code: providerLocation.postal_code,
        country: "india",
        long: providerLocation.long,
        lat: providerLocation.lat,
      };
      await axios.post("http://localhost:8080/api/adress/", requestBody);
      setProviderProfile({ ...providerProfile, u_id: response.data.u_id });
      setStep(3); // After successful verification, move to the next step
    } catch (err) {
      alert("Registration failed.");
    }
  };

  // Handle profile form submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // First request: create provider profile
      const response = await axios.post(
        "http://localhost:8080/api/providerpro/",
        providerProfile
      );

      console.log(response.data.sp_id);
      setUserId(response.data.sp_id);
      localStorage.setItem("spId", response.data.sp_id);

      // Prepare the documents data
      const newDocuments = {
        sp_id: response.data.sp_id,
        doc_type: "image",
        doc_url: imageURL,
        verification_status: "pending",
      };

      console.log(newDocuments);

      // Using setTimeout to simulate waiting for the response
      setTimeout(async () => {
        try {
          const response1 = await axios.post(
            "http://localhost:8080/api/doc",
            newDocuments
          );
          alert("Profile created");
          setStep(4);
        } catch (err) {
          console.log("An error occurred during document upload:", err);
        }
      }, 1000);
    } catch (err) {
      console.log("An error occurred during profile creation:", err);
    }
  };

  useEffect(() => {
    if (imageURL) {
      console.log("Updated Download URL:", imageURL);
    }
  }, [imageURL]);

  const handleUpload = () => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `user_images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    setLoading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (uploadError) => {
        console.error("Error uploading image:", uploadError);
        setLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          setImageURL(downloadURL);
          console.log("Download URL:", imageURL);
          setLoading(false);
        } catch (error) {
          console.error("Error getting download URL:", error);
          setLoading(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white flex gap-14 p-8 rounded-lg shadow-md w-3/4">
        <Image
          src="/assets/images/reg_img.png"
          alt="John Doe"
          width={500}
          height={100}
          className="border-solid border-2 border-gray-600 rounded-2xl border-opacity-25 p-5"
        />
        {step === 0 && (
          <ProviderLocation
            onLocSubmit={handleLocationSubmit}
            onLocation={handleProviderLocation}
          />
        )}

        {step === 1 && (
          <div className="flex-col w-96">
            <form onSubmit={handleUserSubmit} className="w-full max-w-lg ">
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                Step 1: Basic Details
              </h2>
              <div className="mb-4">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <input
                  name="user_name"
                  placeholder="User Name"
                  value={userDetails.user_name}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      user_name: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Mobile Number"
                  value={userDetails.mobile}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, mobile: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Next
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <OTPVerification
            mobile={userDetails.mobile}
            onVerify={handleVerification}
          />
        )}

        {step === 3 && (
          <form
            onSubmit={handleProfileSubmit}
            className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Step 3: Service Provider Profile
            </h2>
            <div className="mb-6">
              <input
                name="business_name"
                type="text"
                placeholder="Business Name"
                value={providerProfile.business_name}
                onChange={(e) =>
                  setProviderProfile({
                    ...providerProfile,
                    business_name: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <input
                name="reg_number"
                type="text"
                placeholder="REG Number"
                value={providerProfile.reg_number}
                onChange={(e) =>
                  setProviderProfile({
                    ...providerProfile,
                    reg_number: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <input
                name="gst_number"
                type="text"
                placeholder="GST Number"
                value={providerProfile.gst_number}
                onChange={(e) =>
                  setProviderProfile({
                    ...providerProfile,
                    gst_number: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-6">
              <textarea
                name="about"
                placeholder="About your business"
                value={providerProfile.about}
                onChange={(e) =>
                  setProviderProfile({
                    ...providerProfile,
                    about: e.target.value,
                  })
                }
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {imageURL == null ? (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">Upload NIC:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border border-none rounded-md p-2 "
                  />
                  {uploadProgress > 0 && (
                    <div className="w-full max-w-sm mt-4">
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            Upload Progress
                          </span>
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="relative flex items-center justify-center w-full">
                            <div className="w-full bg-gray-200 rounded">
                              <div
                                className="bg-teal-600 text-xs leading-none py-1 text-center text-white rounded"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">Upload File:</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="border border-none rounded-md p-2 "
                  />
                  {uploadProgress > 0 && (
                    <div className="w-full max-w-sm mt-4">
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            Upload Progress
                          </span>
                          <span className="text-xs font-semibold inline-block py-1 px-2 rounded text-teal-600 bg-teal-200">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="relative flex items-center justify-center w-full">
                            <div className="w-full bg-gray-200 rounded">
                              <div
                                className="bg-teal-600 text-xs leading-none py-1 text-center text-white rounded"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <button
                    onClick={handleUpload}
                    disabled={loading}
                    className="bg-black text-white text-xl px-4 py-2 rounded-md mt-5"
                  >
                    {loading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Finish
            </button>
          </form>
        )}

        {step === 4 && <ProviderServices />}
      </div>
    </div>
  );
};

export default BusinessRegister;
