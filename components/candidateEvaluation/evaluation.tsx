import React, { useEffect, useState } from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import TabSection from "./tabSection";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import Loader from "../ui/loader";
import Error from "@/pages/error";

const Evaluation = () => {
  const [filters, setFilters] = useState<any>({
    first: 0,
    rows: 20,
  });
  console.log({ filters });
  const {
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    data: candidateEvaluationData,
  } = useQuery({
    queryKey: ["evaluation"],
    queryFn: () =>
      GET(
        `/psps/candidate-evaluation?${new URLSearchParams(filters).toString()}`,
      ),
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: true,
  });

  useEffect(() => {
    refetch();
  }, [filters?.id]);

  // if (isLoading || isFetching) {
  //   return (
  //     <div className="flex h-full w-full items-center justify-center">
  //       <Loader size={60} />
  //     </div>
  //   );
  // } else if (isError) {
  //   <div>
  //     <Error error={error} reset={refetch} />
  //   </div>;
  // }
  if (isError) {
    return (
      <div>
        <Error error={error} reset={refetch} />
      </div>
    );
  }

  return (
    <div className="mb-[200px] h-[100%] w-[100%] bg-ac-3 2xl:mb-[0px]">
      <div className="flex w-[100%] items-center justify-between pr-2 pt-3">
        <TopComponentWithHeading
          title="Candidate Evaluation"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="mt-4 w-[100%] pl-2">
        <Tabs defaultValue="tab-0" className="w-[100%]">
          <TabsList className="gap-3">
            {candidateEvaluationData?.data?.department?.map(
              (item: any, index: number) => (
                <TabsTrigger
                  key={index}
                  onClick={() => {
                    setFilters((prev: any) => ({ ...prev, id: item?.id }));
                  }}
                  className="w-[200px] rounded-lg border border-black data-[state=active]:border-none data-[state=active]:bg-ac-1 data-[state=active]:text-white"
                  value={`tab-${index}`}
                >
                  {item?.name}
                </TabsTrigger>
              ),
            )}
          </TabsList>

          {isFetching ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader size={60} />
            </div>
          ) : (
            <>
              {candidateEvaluationData?.data?.department?.map(
                (item: any, index: number) => (
                  <TabsContent
                    key={index}
                    value={`tab-${index}`}
                    className="w-[100%] pl-2"
                  >
                    <>
                      {candidateEvaluationData?.data?.findPspbyDepRole?.map(
                        (item: any, index: number) => (
                          <TabSection key={index} data={item} />
                        ),
                      )}
                    </>
                  </TabsContent>
                ),
              )}
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Evaluation;
