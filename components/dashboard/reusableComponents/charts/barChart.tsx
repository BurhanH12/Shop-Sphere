// ------------------------------------------------------------------------------------------------//
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BarChart = ({ data }: any) => {
  const [chartOptions, setChartOptions] = useState<any>(null);

  useEffect(() => {
    const options = {
      series: data?.series,
      // [
      //   {
      //     data: [3, 4, 2, 5, 3, 4, 2, 5, 3,4,4],
      //   },
      //   {
      //     data: [2, 3, 4, 2, 5, 3, 4, 2, 5,3,5],
      //   },
      // ]
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      // tooltip: {
      //   enabled: true, // Enable tooltips
      // },
      plotOptions: {
        bar: {
          columnWidth: "45%",

          horizontal: false,
          endingShape: "rounded",
          borderRadius: 5,
          distributed: false, // To evenly distribute bars
        },
      },
      // colors: ["#A1D1E0", "#80A4BC"],
      colors: ["#ADDEEE", "#405664"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: false,
      },
      xaxis: {
        categories: data?.categories,

        labels: {
          rotate: -65, // Rotate the labels by 45 degrees
          rotateAlways: true,

          style: {
            fontSize: "10px",
            fontWeight: "bold",
            colors: "#000",
          },
          offsetX: 2, // Move the labels slightly to the left
        },
      },
      yaxis: {
        min: 0,
        max: 5,
        tickAmount: 5,
        labels: {
          formatter: function (value: any) {
            return Math.floor(value);
          },
          style: {
            fontSize: "12px",
            fontWeight: "bold",
            colors: ["#CCCCCC"],
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
          console.log({ shehzad: series[0][dataPointIndex] });
          // var data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const data = {
            jsp: series[0][dataPointIndex],
            psp: series[1][dataPointIndex],
            category: w.globals.labels[dataPointIndex],
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
            `<div style="padding: 10px;  border: 1px solid #ddd;font-size:12px; border-radius: 5px;">
            <ul style="list-style: none; padding: 0; margin: 0;">
            <textarea disable="true" cols="40" style="resize:none; font-weight:bold">${data.category}</textarea>
              <hr/>
              <li><b>JSP</b>: ${data.jsp}</li>
              <li><b>PSP</b>: ${data.psp}</li>
            </ul>
          </div>`
          );
        },
      },
      // tooltip: {
      //   enabled: true,
      //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //     return (
      //       '<div class="arrow_box">' +
      //       "<span>" +
      //       series[seriesIndex][dataPointIndex] +
      //       "</span>" +
      //       "</div>"
      //     );
      //   },
      // },
    };

    setChartOptions(options);
  }, [data]);

  if (!chartOptions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[100%]">
      <Chart
        options={chartOptions}
        series={chartOptions.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
