import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function EcommerceMetrics() {
  // Options for Users Graph
  const graphOptions: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true
      },
      type: "line",
      toolbar: { show: false },
    },
    colors: ["#34D399"], // teal
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "solid",
      opacity: 0.3,
    },
    tooltip: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
  };

  const graphSeries = [
    {
      name: "Users",
      data: [120, 200, 150, 220, 180, 250, 210],
    },
  ];

  // Options for Users Usage
  const usageOptions: ApexOptions = {
    chart: {
      sparkline: { enabled: true },
      type: "area",
      toolbar: { show: false },
    },
    colors: ["#6366F1"], // indigo
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
      },
    },
    tooltip: { enabled: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
  };

  const usageSeries = [
    {
      name: "Usage",
      data: [80, 100, 90, 130, 120, 140, 160],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Users Graph */}
      <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Users Graph</h3>
        <Chart
          options={graphOptions}
          series={graphSeries}
          type="line"
          height={200}
          width="100%"
        />
      </div>

      {/* Users Usage */}
      <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm w-full">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Users Usage</h3>
        <Chart
          options={usageOptions}
          series={usageSeries}
          type="area"
          height={200}
          width="100%"
        />
      </div>
    </div>
  );
}
