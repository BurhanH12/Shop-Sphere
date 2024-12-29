import React from "react";
import { Separator } from "../ui/separator";
import { formatDate } from "@/utils/helper";

import Link from "next/link";
import { useRouter } from "next/router";

const TabSection = ({ data }: any) => {
  const router = useRouter();
  return (
    <div className="w-[100%] pt-6">
      {/* ------------entire  role sections start-------------------- */}
      <div
        // key={index}
        className="flex flex-col items-center justify-between gap-7 rounded-md bg-transparent p-2"
      >
        {/* ----------------------heading section with button -------------- */}
        <div className="flex w-[100%] items-center justify-between">
          <p className="text-lg font-semibold">
            {data?.roleName}
            <span className="text-sm text-gray-500">
              {" "}
              ( {data?.count} {data?.count < 1 ? "Assessment" : "Assessments"} )
            </span>
          </p>
          <div className="gap 2 flex items-center gap-4">
            {/* <p className="text-sm text-gray-500">(5 Assessment left)</p> */}

            <button
              onClick={() => router.push("/dashboard/candidate-assessment")}
              className="rounded-lg bg-[#8A1538] px-4 py-[8px] text-sm font-medium text-white"
            >
              New Assessment
            </button>
          </div>
        </div>
        {/* ----------------------heading section with button -------------- */}

        <div className="w-[100%] pt-3">
          {data?.children?.map((item: any, index: number) => (
            <div key={index} className="w-[100%]">
              <div className="grid w-[100%] grid-cols-5 justify-between">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{item?.PspUser[0]?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-medium">
                    {item?.PspUser[0]?.experience} Years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{item?.PspUser[0]?.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assessment Date</p>
                  {/* <p className="font-medium">August 8th, 2024</p> */}
                  <p className="font-medium">
                    {" "}
                    {formatDate(
                      String(item?.PspUser[0]?.assessmentAt).split("T")[0],
                    )}{" "}
                  </p>
                </div>
                <Link href={`/dashboard/analysis/${item?.id}`}>
                  <button className="rounded-lg border border-black bg-transparent px-4 py-[8px] text-sm font-medium text-black">
                    View Assessment Report
                  </button>
                </Link>
              </div>
              <Separator className="my-3" />
            </div>
          ))}
        </div>
      </div>
      {/* ------------entire  role sections End-------------------- */}
    </div>
  );
};

export default TabSection;
