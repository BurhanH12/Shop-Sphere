import { Button } from "@/components/ui/button";
import { Divider } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TabData = ({ mainHeading, data }: any) => {
  return (
    <div className="pt-2">
      <p className="ml-5 text-[18px] font-semibold">
        {mainHeading}
        {/* Your Average Score for Leadership Competency is : 54% */}
      </p>
      <div
        className="mt-4 grid grid-cols-1 sm:grid-cols-2"
        // style={{ border: "1px solid black" }}
      >
        <div className="pl-1">
          {data?.main_graph?.strength?.length > 0 ? (
            <>
              <div className="flex flex-col items-start justify-start pl-6">
                <p className="text-[19px] font-semibold">
                  Strength{data.main_graph.strength.length > 1 ? "s" : ""}:
                </p>
                <p className="text-[14px] text-ac-7">
                  {`My top ${
                    data.main_graph.strength.length === 1
                      ? "Strength is"
                      : `${data.main_graph.strength.length} Strengths are:`
                  }`}
                </p>
              </div>
              {data.main_graph.strength.map((strength: any, index: number) => (
                // <div
                //   key={index}
                //   className="my-1 flex items-center justify-start rounded-l-lg bg-ac-2 p-3 pl-6"
                // >
                <div
                  key={index}
                  className={`my-1 flex items-center justify-start rounded-l-lg p-3 pl-6 ${
                    index % 2 === 0 ? "bg-ac-2" : "bg-transparent"
                  }`}
                >
                  <p className="text-[15px] font-semibold text-ac-12">
                    {strength?.name}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-start justify-start pl-6">
              <p className="text-[19px] font-semibold">Strengths:</p>{" "}
              <p className="h-5 text-[14px] leading-10 text-ac-7">
                {/* {`   Your strength count is ${data?.main_graph?.strength?.length} `} */}
                No Strengths.
              </p>
              {/* <div className="my-1 flex w-[100%] items-center justify-start rounded-l-lg bg-ac-2 p-[10.9px] pl-6">
                <p className="text-[17px] font-semibold text-ac-12">
                  No Strength
                </p>
              </div> */}
              {/* <h2 className="mt-2">No Strength</h2> */}
            </div>
          )}

          {/* <div className="my-1 flex items-center justify-start rounded-l-lg bg-ac-2 p-3 pl-6">
            <p className="text-[17px] font-semibold text-ac-12">
              Openniness & Honesty
            </p>
          </div>
          <div className="my-1 flex items-center justify-start rounded-l-lg p-3 pl-6">
            <p className="text-[17px] font-semibold text-ac-12">
              Synergized Collaboration
            </p>
          </div>
          <div className="my-1 flex items-center justify-start rounded-l-lg bg-ac-2 p-3 pl-6">
            <p className="text-[17px] font-semibold text-ac-12">
              Customer Focus
            </p>
          </div> */}
        </div>
        {/* ----------------------- */}
        <div className="pr-1">
          {data?.main_graph?.weakness?.length > 0 ? (
            <>
              <div className="flex flex-col items-start justify-start pl-6">
                <p className="text-[19px] font-semibold">Improvement Areas:</p>
                <p className="text-[14px] text-ac-7">
                  {`My top ${data.main_graph.weakness.length} ${
                    data.main_graph.weakness.length === 1
                      ? "Improvement Area is"
                      : "Improvement Areas are:"
                  }`}
                </p>
              </div>
              {data.main_graph.weakness.map((weakness: any, index: number) => (
                <div
                  key={index}
                  className={`my-1 flex items-center justify-start rounded-r-lg p-3 pl-6 ${
                    index % 2 === 0 ? "bg-ac-2" : "bg-transparent"
                  }`}
                >
                  <p className="line-clamp-1 text-[15px] font-semibold text-ac-12">
                    {weakness?.name}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-start justify-start pl-6">
              <p className="text-[19px] font-semibold">Improvement Areas:</p>
              <p className="h-5 text-[14px] text-ac-7">
                No Areas of Improvement.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* -------------------------------------------- */}
      {data?.courses.length > 0 && (
        <div className="ml-5 mt-5">
          <p className="text-[20px] font-semibold">Recommendations:</p>
          <div className="mb-5 w-[925px]">
            <p className="line-clamp-2 text-[12px] font-semibold text-ac-7">
              My recommended Online Trainings are:
            </p>
          </div>
          {/* -----------------RECOMMENDATIONS Post START-------------------------- */}
          <div className="mt-2 flex gap-3">
            {data?.courses.map((item: any, index: number) => (
              <div
                key={index}
                className="relative flex w-[300px] flex-col space-y-2"
              >
                <div className="line-clamp-1 w-[300px] text-[11px] font-semibold text-ac-1">
                  {`Course For ${item?.skill_name}`}
                </div>
                <Divider />
                {/* <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.thumb}`}
                  // src="/summary/post1.png"
                  alt="s"
                  height={300}
                  width={300}
                  className="w-full object-cover"
                /> */}
                <div className="p-2">
                  <p className="text-[14px] font-semibold">
                    {item?.provider}
                    {"  "}:
                  </p>

                  <p className="text-[14px] font-semibold">{item?.name} </p>
                </div>
                <Link href={item?.url} target="_blank">
                  <Button className="border border-ac-1 bg-transparent text-ac-1 hover:bg-ac-1 hover:text-ac-4">
                    View Course
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* -----------------RECOMMENDATIONS Post END-------------------------- */}
        </div>
      )}
    </div>
  );
};

export default TabData;
