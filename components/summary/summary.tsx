import React from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import TabData from "./reusableComponent/tabData";
import Image from "next/image";
import { useRouter } from "next/router";
import Loader from "../ui/loader";
import { useQuery } from "@tanstack/react-query";
import Error from "@/pages/error";
import { GET } from "@/server/clientController/auth/auth";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import Link from "next/link";

const Summary = () => {
  const router = useRouter();
  const { id } = router.query; // Accessing navId from query parameters

  // ----------------API CALL-------------------------------//
  const {
    isLoading,
    isFetching,
    isError,
    refetch,
    error,
    data: summaryData,
  } = useQuery({
    queryKey: ["summary"],
    queryFn: () => GET(`/psps/summary/${id}`),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: id ? true : false,
  });
  console.log({ summaryData });
  // ----------------API CALL-------------------------------//

  // PDF download ----------------------------------------------//
  const generatePDF = () => {
    const doc = new jsPDF() as jsPDF & {
      autoTable: (options: any) => void;
    };

    doc.setFontSize(16);
    doc.text("Summary Report", 10, 10);

    doc.setFontSize(12);
    doc.text("Average Scores:", 10, 20);
    summaryData?.data?.average?.forEach((item: any, index: number) => {
      doc.text(`${item?.name}: ${item?.percentage}%`, 20, 30 + index * 10);
    });

    const competenciesStartY =
      30 + summaryData?.data?.average?.length * 10 + 10;
    doc.text("Competencies:", 10, competenciesStartY);

    // Create a single table for competencies, strengths, and weaknesses
    const tableData = summaryData?.data?.summary?.PspCompetencies?.map(
      (item: any, index: number) => ({
        competency: item?.Competency?.name,
        score: summaryData?.data?.average[index]?.percentage || "N/A",
        strengths:
          item?.main_graph?.strength
            ?.map((strengthItem: any) => strengthItem?.name)
            .join(", ") || "No strengths",
        weaknesses:
          item?.main_graph?.weakness
            ?.map((weaknessItem: any) => weaknessItem?.name)
            .join(", ") || "No weaknesses",
      }),
    );

    doc.autoTable({
      startY: competenciesStartY + 10,
      head: [["Competency", "Score", "Strengths", "Weaknesses"]],
      body: tableData.map((row: any) => [
        row.competency,
        row.score,
        row.strengths,
        row.weaknesses,
      ]),
      theme: "grid",
      headStyles: { fillColor: "#96233C" }, // Set the heading color to red
    });

    // Recommendations
    // const recommendationsStartY = doc.autoTable.previous.finalY + 20;
    // doc.text("Recommendations:", 10, recommendationsStartY);

    // summaryData?.data?.summary?.PspCompetencies?.courses?.forEach((course, index) => {
    //   doc.text(
    //     `${course?.title} (${course?.platform})`,
    //     20,
    //     recommendationsStartY + 10 + index * 10,
    //   );
    // });

    doc.save("summary-report.pdf");
  };
  // --------------------noooo
  // const generatePDF = () => {
  //   const doc = new jsPDF() as jsPDF & {
  //     autoTable: (options: any) => void;
  //   };

  //   doc.setFontSize(16);
  //   doc.text("Summary Report", 10, 10);

  //   doc.setFontSize(12);
  //   doc.text("Average Scores:", 10, 20);
  //   summaryData?.average?.forEach((item: any, index: number) => {
  //     doc.text(`${item?.name}: ${item?.percentage}%`, 20, 30 + index * 10);
  //   });
  //   // leadership competency
  //   const tableData = summaryData?.data?.summary?.PspCompetencies?.map(
  //     (item: any, index: number) => ({
  //       competency: item?.Competency?.name,
  //       score: summaryData?.average[index]?.percentage || "N/A",
  //       strengths:
  //         item?.main_graph?.strength
  //           ?.map((strengthItem: any) => strengthItem?.name)
  //           .join(", ") || "No strengths",
  //       weaknesses:
  //         item?.main_graph?.weakness
  //           ?.map((weaknessItem: any) => weaknessItem?.name)
  //           .join(", ") || "No weaknesses",
  //     }),
  //   );
  //   // leadership competency end
  //   // Business skill
  //   const bData = summaryData?.data?.summary?.PspCompetencies?.map(
  //     (item: any, index: number) => ({
  //       competency: item?.Competency?.name,
  //       score: summaryData?.average[index]?.percentage || "N/A",
  //       strengths:
  //         item?.main_graph?.strength
  //           ?.map((strengthItem: any) => strengthItem?.name)
  //           .join(", ") || "No strengths",
  //       weaknesses:
  //         item?.main_graph?.weakness
  //           ?.map((weaknessItem: any) => weaknessItem?.name)
  //           .join(", ") || "No weaknesses",
  //     }),
  //   );
  //   // Business skill end
  //   const competenciesStartY = 30 + summaryData?.average?.length * 10 + 10;
  //   doc.text("Competencies:", 10, competenciesStartY);

  //   // Competencies Table
  //   doc.autoTable({
  //     startY: competenciesStartY + 10,
  //     head: [["Competency", "Score", "Strengths", "Weaknesses"]],
  //     body: tableData.map((row: any) => [
  //       row.competency,
  //       row.score,
  //       row.strengths,
  //       row.weaknesses,
  //     ]),
  //     theme: "grid",
  //     headStyles: { fillColor: "#96233C" }, // Red background for the header
  //   });

  //   // General Business Skill Table
  //   const generalBusinessSkillStartY = doc.lastAutoTable.finalY + 20;
  //   doc.text("General Business Skill:", 10, generalBusinessSkillStartY);

  //   doc.autoTable({
  //     startY: generalBusinessSkillStartY + 10,
  //     head: [["Competency", "Score", "Strengths", "Weaknesses"]],
  //     body: bData.map((row: any) => [
  //       row.competency,
  //       row.score,
  //       row.strengths,
  //       row.weaknesses,
  //     ]),
  //     theme: "grid",
  //     headStyles: { fillColor: "#96233C" }, // Red background for the header
  //   });

  //   // Functional and Technical Skills Table
  //   const functionalAndTechnicalSkillsStartY = doc.lastAutoTable.finalY + 20;
  //   doc.text(
  //     "Functional and Technical Skills:",
  //     10,
  //     functionalAndTechnicalSkillsStartY,
  //   );

  //   doc.autoTable({
  //     startY: functionalAndTechnicalSkillsStartY + 10,
  //     head: [["Competency", "Score", "Strengths", "Weaknesses"]],
  //     body: tableData.map((row: any) => [
  //       row.competency,
  //       row.score,
  //       row.strengths,
  //       row.weaknesses,
  //     ]),
  //     theme: "grid",
  //     headStyles: { fillColor: "#96233C" }, // Red background for the header
  //   });

  //   doc.save("summary-report.pdf");
  // };
  // ------------------------noooo
  // PDF download ----------------------------------------------//
  // const generatePDF = () => {
  //   const doc = new jsPDF() as jsPDF & {
  //     autoTable: (options: any) => void;
  //   };

  //   doc.setFontSize(16);
  //   doc.text("Summary Report", 10, 10);

  //   doc.setFontSize(12);
  //   doc.text("Average Scores:", 10, 20);
  //   summaryData?.average?.forEach((item: any, index: number) => {
  //     doc.text(`${item?.name}: ${item?.percentage}%`, 20, 30 + index * 10);
  //   });

  //   let startY = 30 + summaryData?.average?.length * 10 + 20;

  //   // Loop through each competency and create a table
  //   summaryData?.data?.summary?.PspCompetencies?.forEach((competency: any) => {
  //     doc.text(`${competency.Competency?.name}:`, 10, startY);

  //     const tableData = competency?.main_graph
  //       .map((skill: any) => ({
  //         pspSkill: skill?.name || "N/A",
  //         expected: competency?.averageExpected || "N/A",
  //         selected: competency?.averageSelected || "N/A",
  //       }));

  //     doc.autoTable({
  //       startY: startY + 10,
  //       head: [["PSP Skill", "Selected", "Expected", "Strength/Weakness"]],
  //       body: tableData.map((row: any, index: number) => [
  //         row.pspSkill,
  //         row.selected,
  //         row.expected,
  //         index < competency?.main_graph?.strength.length
  //           ? "Strength"
  //           : "Weakness",
  //       ]),
  //       theme: "grid",
  //       headStyles: { fillColor: [255, 0, 0] }, // Red background for the header
  //     });

  //     startY = doc.lastAutoTable.finalY + 20; // Update the startY for the next table
  //   });

  //   doc.save("summary-report.pdf");
  // };

  if (isLoading) {
    return (
      <div className="item-center flex h-[100%] w-[100%] justify-center">
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
    <div className="bg-ac-3">
      {/* -------------HEADER WITH STEPPER START---------------------- */}
      <div className="flex w-[100%] items-center justify-between pr-2">
        <TopComponentWithHeading
          title="Summary"
          description="Here is the latest details...Check Now!
"
        />
        <Link
          href={`/report/${id}`}
          target="_blank"
          // onClick={() => router.push(`/report/${id}`)}
          // onClick={generatePDF}

          // style={{ border: "1px solid #75767A" }}
        >
          <Button className="border border-black bg-transparent text-ac-5 hover:bg-ac-1 hover:text-ac-4">
            {" "}
            Download Report{" "}
          </Button>
        </Link>
      </div>
      {/* -------------HEADER WITH STEPPER END---------------------- */}
      <h6 className="ml-5 mt-5 font-semibold">My Average Score</h6>
      <div>
        <div className="container mx-auto p-4">
          <div className="flex flex-col items-center gap-4 text-[12px] font-semibold sm:grid sm:grid-cols-3">
            {summaryData?.data?.average?.map((item: any) => (
              <div key={item?.name} className="text-center">
                {item?.name}
              </div>
            ))}
            {/* <div className="text-center">General Business Skills</div>
            <div className="text-center">Specific Technical Skills</div> */}
          </div>

          <div className="mt-2 flex flex-col font-semibold sm:grid sm:grid-cols-3">
            {summaryData?.data?.average?.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-2 text-center ${index === 0 ? "rounded-l-lg bg-ac-11" : index === summaryData?.data?.average?.length - 1 ? "rounded-r-lg bg-ac-11" : "bg-ac-2"} lg:rounded-none`}

                // className={`rounded-none ${index === 0 || index === summaryData?.average?.length - 1 ? "bg-ac-11" : "bg-ac-2"} ${index === 0 ? "rounded-l-lg" : ""} ${index === summaryData?.average?.length - 1 ? "rounded-r-lg" : ""} p-4 text-center lg:rounded-none`}
              >
                {item?.percentage}
              </div>
            ))}
            {/* <div className="bg-ac-2 p-4 text-center">36.36%</div>
            <div className="rounded-r-lg bg-ac-11 p-4 text-center">36.36%</div> */}
          </div>
        </div>
      </div>
      {/* -------------------TAB SECTION START-------------------------*/}
      <div className="mt-3">
        <Tabs defaultValue="tab-0" className="w-[100%]">
          <TabsList className="gap-3">
            {summaryData?.data?.summary?.PspCompetencies?.map(
              (item: any, index: number) => (
                <TabsTrigger
                  key={index}
                  className="data-[state=active]:bg-ac-1 data-[state=active]:text-white"
                  value={`tab-${index}`}
                >
                  {item?.Competency?.name}
                </TabsTrigger>
              ),
            )}
            {/* <TabsTrigger
              className="data-[state=active]:bg-ac-1 data-[state=active]:text-white"
              value="secondTab"
            >
              General Business Skills
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:bg-ac-1 data-[state=active]:text-white"
              value="thirdTab"
            >
              Specific Technical Skills
            </TabsTrigger> */}
          </TabsList>
          {summaryData?.data?.summary?.PspCompetencies?.map(
            (item: any, index: number) => (
              <TabsContent
                key={index}
                value={`tab-${index}`} // Unique value for each tab
              >
                <TabData
                  data={item}
                  mainHeading={`My Average Score for ${summaryData?.data?.average[index]?.name} is: ${summaryData?.data?.average[index]?.percentage} `}
                />
              </TabsContent>
            ),
          )}

          {/* <TabsContent value="secondTab">
            <TabData
              mainHeading={" Your Average Score for Business Skills is: 54% "}
            />
          </TabsContent>
          <TabsContent value="thirdTab">
            <TabData
              mainHeading={" Your Average Score for Technical Skills is: 54% "}
            />
          </TabsContent> */}
        </Tabs>
      </div>
      {/* -------------------TAB SECTION END-------------------------*/}
    </div>
  );
};

export default Summary;
