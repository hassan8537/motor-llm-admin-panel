import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

export default function EcommerceMetrics() {
  const options: ApexOptions = {
    chart: {
      sparkline: {
        enabled: true
      },
      height: 60,
      width: '100%',
      type: "area",
      toolbar: {
        show: false,
      },
    },
    colors: ["#465FFF", "#9CB9FF"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 180, 170, 160],
    },
  ];

  return (
    <div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

      {/* Target Achieved */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="mb-2">
          <img src="./images/user-png.png" alt="" />
        </div>

      </div>

      {/* Sales This Month */}
      <div className="p-5 bg-white border border-gray-200 rounded-lg">
        <div className="mb-1">
          <h3 className="text-xs font-medium text-gray-500">Sales This Month ($)</h3>
          <p className="mt-1 text-lg font-bold text-gray-800">$227,723.40</p>
        </div>
        <div className="flex items-center justify-between">
        </div>
        <div className="mt-2 h-[60px] w-full">
          <Chart
            options={options}
            series={series}
            type="area"
            height={60}
            width="100%"
          />
        </div>
      </div>

    


    </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">

      {/* Total Orders */}
      <div className="p-5 bg-white border border-gray-200 rounded-lg">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-center text-gray-500">Total Orders This Month</h3>
          <p className="mt-1 text-2xl font-bold text-center text-gray-800">57</p>
          <div className="text-center space-x-1">
            <span className="inline-flex items-center text-xs px-2 py-1 text-xs font-medium rounded-full bg-error-50 text-error-600">
              15%
            </span>
            <span className="text-[8px]">from last month</span>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
}