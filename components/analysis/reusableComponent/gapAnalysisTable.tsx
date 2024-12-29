import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import RowsBarChart from "./rowsBarChart";
import BarChart from "@/components/dashboard/reusableComponents/charts/barChart";

const GapAnalysisTable = ({ title, tableData }: any) => {
  console.log({ tableData });
  return (
    <div>
      {/* <p className="mt-4 pl-4 text-center text-[18px] font-semibold">{title}</p> */}
      <TableContainer w={"100%"} p={0} m={0}>
        <Table size={{ base: "md", "2xl": "lg" }} w="100%" p={0} m={0}>
          <Thead>
            <Tr>
              <Th
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                S.N.
              </Th>
              <Th
                textTransform={"none"}
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                {title &&
                  (title === "Leadership Competencies"
                    ? "Competency"
                    : title === "General Business Skills"
                      ? "Business Skill"
                      : title === "Functional / Technical Skills"
                        ? "Functional / Technical Skill"
                        : "")}
              </Th>
              <Th
                textTransform={"none"}
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                <div>
                  <p>Job Skill Profile (JSP)</p>
                  <p className="text-center text-[11px] font-bold">
                    Expected Level
                  </p>
                </div>
              </Th>
              <Th
                textTransform={"none"}
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                <div>
                  <p>Personal Skill Profile (PSP)</p>
                  <p className="text-center text-[11px] font-bold">
                    Current Actual Level
                  </p>
                </div>
              </Th>
              <Th
                textTransform={"none"}
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                Difference
              </Th>
              <Th
                textTransform={"none"}
                fontWeight="bold"
                textAlign={"center"}
                fontSize="15px"
                // borderBottom="1px solid #CCCCCC"
              >
                Bar Graph
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData?.PspSkill?.map((item: any, rowIndex: number) => (
              <Tr
                key={rowIndex}
                sx={{
                  fontWeight:
                    rowIndex === tableData?.PspSkill?.length - 1
                      ? "700"
                      : "500",
                  borderRadius: rowIndex % 2 === 0 ? " 50%" : "",
                  // border: rowIndex % 2 === 0 ? " 1px solid #CCCCCC" : "",
                  // boxShadow:
                  //   rowIndex % 2 === 0
                  //     ? "0px 2px 4px rgba(0, 0, 0, 0.1)"
                  //     : "none",
                  backgroundColor:
                    rowIndex % 2 === 0 ? "#F9F9F9" : "transparent", // Optional: for background color
                }}
              >
                <Td border="none" textAlign={"center"}>
                  {rowIndex !== tableData?.PspSkill?.length - 1
                    ? `${rowIndex + 1}`
                    : null}
                </Td>
                <Td
                  border="none"
                  // p={0}
                  textAlign={"center"}
                  fontSize={"14px"}
                  style={{
                    whiteSpace: "normal", // Allows text to wrap
                    wordWrap: "break-word", // Breaks long words
                  }}
                >
                  {item?.Skill?.name}
                </Td>
                <Td border="none" textAlign={"center"}>
                  {item?.expected}
                </Td>
                <Td border="none" textAlign={"center"}>
                  {item?.selected}
                </Td>
                <Td border="none" textAlign={"center"}>
                  {item?.difference}
                </Td>
                <Td border="none" textAlign={"center"}>
                  <div className="relative flex h-[40px] items-center justify-center">
                    {item?.row_graph ? (
                      <RowsBarChart data={item?.row_graph} />
                    ) : (
                      "N/A"
                    )}
                  </div>
                </Td>
                {/* FOR TESTING WILL CHECK BELOW */}
                {/* <Td border="none" textAlign={"center"}>
                  <div className="relative flex h-[40px] w-[200px] items-center justify-center">
                    <RowsBarChart data={item?.row_graph} />
                  </div>
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <div className="my-5 w-[100%] font-semibold 2xl:w-[70%]">
        <p>My Average Score</p>
        <BarChart data={tableData?.main_graph} />
      </div>
    </div>
  );
};

export default GapAnalysisTable;
