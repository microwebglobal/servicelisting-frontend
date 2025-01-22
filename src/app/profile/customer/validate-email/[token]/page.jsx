"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { profileAPI } from "@api/profile";
import { Button } from "@components/ui/button";
import { toast } from "@hooks/use-toast";
import { useRouter } from "next/navigation";

const page = ({ params }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState({
    user_id: "",
    name: "",
  });

  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      if (resolvedParams?.token) {
        setToken(resolvedParams.token);
      }
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setTokenData({
          user_id: decodedToken.uid,
          name: decodedToken.name,
        });
      } catch (error) {
        setError(
          "Invalid registration link. Please check your email for the correct link."
        );
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      await profileAPI.validateEmail(tokenData.user_id);
      toast({
        title: "Success!",
        description: "Your Email Sucessfully Validated!",
        variant: "default",
      });
      setTimeout(() => {
        router.push("/profile/customer");
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Email Validate",
        variant: "destructive",
      });
    }
  };
  return (
    <div>
      Hello {tokenData.name} Lets Verify Your Email <br />
      <Button onClick={verifyEmail}>Verify Email</Button>
    </div>
  );
};

export default page;
