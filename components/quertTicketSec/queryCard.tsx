import { formatDate } from "@/utils/helper";
import { useRouter } from "next/router";
import React from "react";
import { LuTicket } from "react-icons/lu";

const QueryCard = ({ query, path }: any) => {
  const router = useRouter();
  // const { id } = router.query;
  console.log({ query });
  return (
    <div className="grid grid-cols-8 items-center justify-between rounded-lg border border-ac-14 bg-white p-4 shadow-sm">
      <div className="col-span-3 ml-4 flex items-center gap-5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-ac-1`}
        >
          <span>
            <LuTicket color="white" className="h-[25px] w-[25px]" />
          </span>
        </div>
        <div>
          <p className="text-[15px]">Subject</p>
          <p className="text-[16px] font-semibold text-gray-800">
            {query?.title}
          </p>
        </div>
      </div>
      <div className="col-span-3 text-gray-600">
        <p className="py-1 text-[14px]">Received Date </p>
        <p className="text-[13px]">
          {formatDate(String(query.createdAt).split("T")[0])}
          {/* // {query.receivedDate} - {query.receivedTime} */}
        </p>
      </div>
      <div className="flex flex-col text-[15px]">
        <p className="py-1 text-[14px]">Priority</p>

        <div className="flex items-center">
          <div className={`mr-2 h-3 w-3 rounded-full bg-[#800040]`} />
          <p className="font-bold text-gray-800">{query.priority}</p>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          // onClick={() => router.push("/dashboard/query-detail/" + query?.id)}
          onClick={() =>
            router.push(
              path === "admin"
                ? `/admin/query-detail/${query?.id}`
                : `/dashboard/query-detail/${query?.id}`,
            )
          }
          className="rounded-md border border-gray-300 px-4 py-2 text-[12px] font-medium text-gray-800 hover:bg-gray-100"
        >
          View Query
        </button>
      </div>
    </div>
  );
};

export default QueryCard;
