"use client";
import React, { useEffect, useState, useCallback } from "react";
import EmployeeSidebar from "@/components/business-employee/EmployeeSidebar";
import { useRouter } from "next/navigation";
import { providerAPI } from "@api/provider";

const layout = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchEmployeeData = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (!user?.uId) {
        router.push("/login/user");
        return;
      }

      const response = await providerAPI.getEmployeeByUserId();
      setProfileData(response.data);
      console.log("Employee Data:", response.data);
    } catch (error) {
      console.error("Error fetching provider data:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  return (
    <div>
      <div className="flex">
        <div className="fixed left-0 top-0 h-full w-64">
          <EmployeeSidebar profileData={profileData} />
        </div>

        <div className="flex-1 ml-72">{children}</div>
      </div>
    </div>
  );
};

export default layout;
