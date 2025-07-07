"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface EarningsChartProps {
  months: string[];
  earningsData: number[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({
  months,
  earningsData,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode using class on html or body
    const checkDark = () => {
      if (typeof window !== "undefined") {
        setIsDark(
          document.documentElement.classList.contains("dark") ||
            document.body.classList.contains("dark"),
        );
      }
    };
    checkDark();
    // Listen for class changes (for theme switchers)
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []); // Empty dependency array is correct here since we only want to set up the observer once

  const chartOptions = {
    chart: {
      id: "earnings-line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: isDark ? "#e7e5e4" : "#1c1917",
    },
    xaxis: {
      categories: months.map((m) =>
        new Date(m + "-01").toLocaleString("default", { month: "short" }),
      ),
      labels: { style: { colors: isDark ? "#e7e5e4" : "#6b7280" } },
    },
    yaxis: {
      labels: { style: { colors: isDark ? "#e7e5e4" : "#6b7280" } },
    },
    stroke: {
      curve: "smooth" as const,
      width: 3,
      colors: ["#6366f1"],
    },
    markers: {
      size: 5,
      colors: ["#6366f1"],
      strokeColors: isDark ? "#1c1917" : "#fff",
      strokeWidth: 2,
    },
    grid: {
      borderColor: isDark ? "#44403c" : "#e5e7eb",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDark ? "dark" : "light",
    },
    colors: ["#6366f1"],
  };

  const chartSeries = [
    {
      name: "Service Fee",
      data: earningsData,
    },
  ];

  return (
    <ApexChart
      options={chartOptions}
      series={chartSeries}
      type="line"
      height="100%"
      width="100%"
    />
  );
};

export default EarningsChart;
