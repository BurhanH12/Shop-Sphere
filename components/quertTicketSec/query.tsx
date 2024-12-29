import React, { useEffect, useState } from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import QueryCard from "./queryCard";
import { GET } from "@/server/clientController/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/utils/helper";
import Loader from "../ui/loader";
import Error from "@/pages/error";
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";

const Query = () => {
  const router = useRouter();
  const { user: admin } = useAppSelector((state) => state.adminAuth);
  console.log({ admin });

  const { id } = router.query;
  const [filters, setFilters] = useState<any>({
    first: 0,
    rows: 20,
    status: "OPEN",
    ...(id && { org_id: id }), // Add id to filters if it exists
  });

  const tabDataArr = [
    {
      id: "1",
      name: "Open Queries",
      count: "1",
      status: "OPEN",
    },
    {
      id: "2",
      name: "Pending Queries",
      count: "1",
      status: "ON_HOLD",
    },
    {
      id: "3",
      name: "In Progress Queries",
      count: "1",
      status: "IN_PROGRESS",
    },
    {
      id: "4",
      name: "Resolved Queries",
      count: "1",
      status: "CLOSED",
    },
  ];

  const {
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    data: queryData,
  } = useQuery({
    queryKey: ["evaluation"],
    queryFn: () => GET(`/tickets?${new URLSearchParams(filters).toString()}`),
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: true,
  });

  useEffect(() => {
    refetch();
  }, [filters?.status]);
  console.log({ queryData: queryData });

  return (
    <div className="h-[100%] w-[100%] bg-ac-3 2xl:mb-[0px]">
      <div className="flex w-[100%] items-center justify-between pr-2 pt-3">
        <TopComponentWithHeading
          title="Help & Support "
          description="Here is the latest details...Check Now!"
        />
        {admin && admin?.Role?.name === "admin" ? null : (
          <Button
            onClick={() => router.push("query-form")}
            className="border border-ac-1 bg-transparent text-ac-1 hover:bg-ac-2"
          >
            Submit New Query
          </Button>
        )}
      </div>
      <div className="pl-3 pt-5">
        <Tabs defaultValue="tab-0" className="w-[100%]">
          <TabsList className="gap-3 bg-transparent">
            {tabDataArr.map((item: any, index: number) => (
              <TabsTrigger
                key={index}
                className="rounded-lg border border-black px-9 data-[state=active]:bg-ac-1 data-[state=active]:text-white"
                // value="firstTab"
                onClick={() =>
                  setFilters((prev: any) => ({ ...prev, status: item?.status }))
                }
                value={`tab-${index}`} // Unique value for each tab
              >
                {`${item?.name} `}
                {/* `{{item?.name} + {item?.count}}` */}
              </TabsTrigger>
            ))}
          </TabsList>

          {isFetching ? (
            <div className="flex h-[500px] w-full items-center justify-center">
              <Loader size={60} />
            </div>
          ) : (
            <>
              {tabDataArr.map((item: any, index: number) => (
                <TabsContent
                  key={index}
                  value={`tab-${index}`} // Unique value for each tab
                  className="w-[100%] space-y-3"
                >
                  {queryData?.data?.data?.length > 0
                    ? queryData?.data?.data?.map((query: any) => (
                        <QueryCard
                          key={query.id}
                          query={query}
                          path={id ? "admin" : "user"}
                        />
                      ))
                    : "No Query Found"}
                  {/* {queryData?.data?.data?.map((query: any) => (
                    <QueryCard
                      key={query.id}
                      query={query}
                      path={id ? "admin" : "user"}
                    />
                  ))} */}
                </TabsContent>
              ))}
            </>
          )}

          {/* <TabsContent value="secondTab">
            <GapAnalysisTable title="General Business Skills" />
          </TabsContent>
          <TabsContent value="thirdTab">
            <GapAnalysisTable title="Specific Technical Skills" />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
};

export default Query;
