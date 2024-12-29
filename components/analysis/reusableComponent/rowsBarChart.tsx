import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Chart component
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RowsBarChart = ({ data }: any) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: "bar" as "bar",
      height: 50,
      toolbar: {
        show: false,
      },

      // tooltip: {
      //   enabled: false, // Disable tooltips
      // },
    },
    plotOptions: {
      bar: {
        columnWidth: "95%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    legend: {
      show: false, // Hide the legend
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        console.log({ shehzad: series });
        // var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const data = {
          jsp: series[0][0],
          psp: series[0][1],
        };

        return (
          // "<ul>" +
          // "<li><b>Jsp</b>: " +
          // data.jsp +
          // "</li>" +
          // "<li><b>Psp</b>: " +
          // data.psp +
          // "</li>" +
          // "</ul>"
          `<div style="padding: 10px; background: #fff; border: 1px solid #ddd; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
            <li><b>JSP</b>: ${data.jsp}</li>
              <li><b>PSP</b>: ${data.psp}</li>
            </ul>
          </div>`
        );
      },
    },
    xaxis: {
      categories: ["PSP", "JSP"],
      labels: {
        show: false, // Hide x-axis labels
      },
      axisBorder: {
        show: false, // Hide the x-axis line
      },
      axisTicks: {
        show: false, // Hide the ticks on the x-axis
      },
    },
    yaxis: {
      show: false, // Hide y-axis
    },
    grid: {
      show: false, // Hide grid lines
    },
    // colors: ["#A1D1E0", "#80A4BC"], // Colors for the bars
    colors: ["#ADDEEE", "#405664"],
    series: [
      {
        data: data, // Data for the bars
      },
    ],
  });

  return (
    <div
      style={{ height: "100px", padding: "0", position: "relative" }}
      className="!z-0"
    >
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={"90%"}
        width={"40px"}
      />
    </div>
  );
};
export default RowsBarChart;
