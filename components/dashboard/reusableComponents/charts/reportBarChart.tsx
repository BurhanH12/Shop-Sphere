import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ReportBarChart = ({ data }: any) => {
  const [chartOptions, setChartOptions] = useState<any>(null);
  const [chartHeight, setChartHeight] = useState(350);
  console.log({ data });
  useEffect(() => {
    // Adjust height based on the number of data points
    const heightPerItem = 10; // Height for each bar (in pixels)
    const calculatedHeight = data?.series?.length * heightPerItem;
    setChartHeight(Math.max(calculatedHeight, 350)); // Ensure a minimum height
  }, [data]);
  useEffect(() => {
    const options = {
      series: data?.series,
      chart: {
        floating: true,
        type: "bar",
        height: 600,
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false, // Disable animation
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "65%",
          horizontal: false, // Set to true for horizontal bars
          endingShape: "rounded",
          borderRadius: 5,
          distributed: false, // To evenly distribute bars
        },
      },
      colors: ["#ADDEEE", "#405664"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      xaxis: {
        categories: data?.categories || [],

        labels: {
          floating: true,
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#000"],
            "word-wrap": "break-word",
          },
          maxWidth: 150, // Ensure enough width for long labels
        },
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            colors: ["#000"],
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
          const data = {
            jsp: series[0][dataPointIndex],
            psp: series[1][dataPointIndex],
          };
          return `<div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li><b>Jsp</b>: ${data.jsp}</li>
            <li><b>Psp</b>: ${data.psp}</li>
          </ul>
        </div>`;
        },
      },
    };

    setChartOptions(options);
  }, [data]);

  if (!chartOptions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[100%] w-[100%]">
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        width={930}
        height={chartHeight}
      />
    </div>
  );
};

export default ReportBarChart;
