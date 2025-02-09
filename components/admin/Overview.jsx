import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart, barElementClasses } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { FcBusinessman } from "react-icons/fc";
import { FcTodoList } from "react-icons/fc";
import { FcBriefcase } from "react-icons/fc";
import { FcSalesPerformance } from "react-icons/fc";

const Overview = () => {
  const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
  const xLabels = [
    "Page A",
    "Page B",
    "Page C",
    "Page D",
    "Page E",
    "Page F",
    "Page G",
  ];
  const stats = [
    { title: "Total Customers", value: "6,450,500", icon: <FcBusinessman /> },
    {
      title: "Total Service Providers",
      value: "100,500",
      icon: <FcTodoList />,
    },
    { title: "Total Bookings", value: "11,389,400", icon: <FcBriefcase /> },
    { title: "Total Revenue", value: "₹9.7 B", icon: <FcSalesPerformance /> },
  ];
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4" style={{ fontSize: "28px" }}>
        Overview
      </h1>
      <hr />
      <div className="grid grid-cols-4 gap-4 mb-6 mt-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 bg-white shadow rounded">
            <h2 className="text-gray-600 text-sm flex justify-between mb-5">
              {stat.title}{" "}
              <span className="bg-red-200 p-1 rounded-md text-xl">
                {stat.icon}
              </span>
            </h2>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex gap-4">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 font-semibold mb-4">
              Monthly Active Users
            </h2>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  curve: "linear",
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  color: "black",
                },
              ]}
              grid={{ horizontal: true, strokeDasharray: "4 4" }}
              leftAxis={{
                disableLine: true,
              }}
              bottomAxis={{
                disableLine: true,
              }}
              sx={{
                ".MuiMarkElement-root": {
                  scale: "1.5",
                  stroke: "black",
                },
              }}
              width={500}
              height={300}
            />
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 font-semibold mb-4">
              Monthly Revenue Trend
            </h2>

            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  curve: "linear",
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  color: "black",
                },
              ]}
              grid={{ horizontal: true }}
              leftAxis={{
                disableLine: true,
              }}
              bottomAxis={{
                disableLine: true,
              }}
              sx={{
                ".MuiMarkElement-root": {
                  scale: "1.5",
                  stroke: "black",
                },
              }}
              width={500}
              height={300}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-10">
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 font-semibold mb-4">
              Weekly Customer Acquisition
            </h2>
            <div>
              <BarChart
                width={500}
                height={300}
                series={[{ data: uData, id: "uvId", color: "black" }]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                leftAxis={{
                  disableLine: true,
                }}
                bottomAxis={{
                  disableLine: true,
                }}
                grid={{ horizontal: true, vertical: true }}
              />
            </div>
          </div>
          <div className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 font-semibold mb-4">
              Weekly Services Used
            </h2>
            <div>
              <BarChart
                width={500}
                height={300}
                series={[{ data: pData, id: "pvId", color: "black" }]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                leftAxis={{
                  disableLine: true,
                }}
                bottomAxis={{
                  disableLine: true,
                }}
                grid={{ horizontal: true, vertical: true }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
