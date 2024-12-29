import React from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import GapAnalysisTable from "./reusableComponent/gapAnalysisTable";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import Loader from "../ui/loader";
import Error from "@/pages/error";

const GapAnalysis = () => {
  const router = useRouter();
  const { id } = router.query; // Accessing navId from query parameters

  const {
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    data: analysisData,
  } = useQuery({
    queryKey: ["analysis"],
    queryFn: () => GET(`/psps/analysis/${id}`),
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: id && id !== undefined ? true : false,
  });


  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }
  if (isError) {
    <div>
      <Error error={error} reset={refetch} />
    </div>;
  }
  return (
    <div className="h-[100%] w-[100%] bg-ac-3">
      {/* -------------HEADER WITH STEPPER START---------------------- */}
      <div className="flex w-[100%] items-center justify-between pr-2">
        <TopComponentWithHeading
          title="Gap Analysis"
          description="Here is the latest details...Check Now!
"
        />
        <Button
          className="bg-ac-1"
          onClick={() => router.push(`/dashboard/summary/${id}`)}
        >
          {" "}
          Review Summary
        </Button>
      </div>
      {/* -------------HEADER WITH STEPPER END---------------------- */}
      {/* -------------------TAB SECTION START-------------------------*/}
      <div className="mt-7 w-[100%]">
        <Tabs defaultValue="tab-0" className="w-[100%]">
          <TabsList className="gap-3">
            {analysisData?.data?.PspCompetencies?.map(
              (item: any, index: number) => (
                <TabsTrigger
                  key={index}
                  className="data-[state=active]:bg-ac-1 data-[state=active]:text-white"
                  // value="firstTab"
                  value={`tab-${index}`} // Unique value for each tab
                >
                  {item?.Competency?.name}
                </TabsTrigger>
              ),
            )}
          </TabsList>
          {analysisData?.data?.PspCompetencies?.map(
            (item: any, index: number) => (
              <TabsContent
                key={index}
                value={`tab-${index}`} // Unique value for each tab
                className="w-[100%]"
              >
                <GapAnalysisTable
                  title={item?.Competency?.name}
                  tableData={item}
                />
              </TabsContent>
            ),
          )}
          {/* <TabsContent value="secondTab">
            <GapAnalysisTable title="General Business Skills" />
          </TabsContent>
          <TabsContent value="thirdTab">
            <GapAnalysisTable title="Specific Technical Skills" />
          </TabsContent> */}
        </Tabs>
      </div>
      {/* -------------------TAB SECTION END-------------------------*/}
    </div>
  );
};

export default GapAnalysis;
