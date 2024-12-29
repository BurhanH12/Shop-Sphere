import React, { useEffect, useState } from "react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tooltip,
  border,
} from "@chakra-ui/react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Box } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import { Button } from "../ui/button";
import AssementDataTable from "../common/table/assement";
import { useForm } from "react-hook-form";
import SubmissionModal from "./reusableComponents/submissionModal";
import CongratsModal from "./reusableComponents/congratsModal";
import Loader from "../ui/loader";
import Error from "@/pages/error";
import { Toaster, toast } from "sonner";

const MainAssessment = () => {
  const [indexNumber, setIndexNumber] = useState(0);
  const [finalData, setFinalData] = useState([]);
  const [formState, setFormState] = useState<any>([]);
  const { register, handleSubmit, setValue } = useForm();
  const [clickedItems, setClickedItems] = useState({});
  const [hoverTip, setHoverTip] = useState({
    one: "",
    two: "",
    three: "",
    four: "",
    five: "",
    six: "",
  });
  const [finalPayload, setFinalPayload] = useState<any>({
    jsp_id: "",
    expected: [], // Start with an empty array
  });
  const [openSubmit, setOpenSubmit] = useState(false);
  const steps = [
    { title: "First", description: "Contact Info" },
    { title: "Second", description: "Date & Time" },
    { title: "Third", description: "Select Rooms" },
  ];
  const { activeStep, setActiveStep } = useSteps({
    index: indexNumber + 1,
    count: steps.length,
  });

  const urlData: string | null =
    typeof window !== "undefined"
      ? window.localStorage.getItem("candidate-data") ||
        window.localStorage.getItem("candidate-data")
      : null;
  const parsedUser = JSON.parse(urlData!);
  console.log("roleIdCheck", parsedUser?.role_id);

  const {
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    isSuccess,
    data: jspData,
    refetch,
  } = useQuery({
    queryKey: [`jsp`],
    queryFn: () => {
      // Check if parsedUser exists and if it has role_id
      const url = parsedUser?.role_id
        ? `/jsps?role_id=${parsedUser.role_id}` // If role_id exists, append it to the URL
        : `/jsps`; // Otherwise, use the default URL

      return GET(url); // Make the API call with the determined URL
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });

  useEffect(() => {
    if (jspData?.data?.JspCompetencies[0]?.JspSkill[0]?.Skill?.SkillLevels) {
      const skillLevels =
        jspData.data.JspCompetencies[0].JspSkill[0].Skill.SkillLevels;

      // Ensure skillLevels has at least 5 values to avoid accessing undefined
      if (skillLevels.length >= 5) {
        setHoverTip({
          one: skillLevels[0].description,
          two: skillLevels[1].description,
          three: skillLevels[2].description,
          four: skillLevels[3].description,
          five: skillLevels[4].description,
          six: skillLevels[5].description,
        });
      }
    }
  }, [isSuccess]);

  const handleEdit = (val: any) => {
    // Update finalPayload dynamically
    setFinalPayload((prevPayload: any) => {
      // Extract the competency_id
      const competency_id =
        jspData?.data?.JspCompetencies[indexNumber]?.Competency?.id;

      // Create a new object for the current step
      const newExpected = {
        competency_id: competency_id,
        PspSkill: [...formState],
      };

      // Check if the competency_id already exists in the expected array
      const updatedExpectedArray = prevPayload.expected.some(
        (item: any) => item.competency_id === competency_id,
      )
        ? prevPayload.expected.map((item: any) =>
            item.competency_id === competency_id
              ? newExpected // Replace existing entry
              : item,
          )
        : [...prevPayload.expected, newExpected]; // Add new entry

      // Return the updated finalPayload object
      return {
        ...prevPayload,
        jsp_id: jspData?.data?.id, // Keep jsp_id the same
        expected: updatedExpectedArray,
      };
    });

    // setActive(val);
    console.log(val, "value");
    setFormState(finalPayload?.expected[0]?.PspSkill);
    setIndexNumber(0);
    // onOpenChange();
    // window.location.reload();
  };

  const handleItemClick = (
    parentName: any,
    childId: string,
    exp: string,
    jsp_skill_id: any,
  ) => {
    console.log({ jsp_skill_id });
    const skills = formState?.length > 0 ? [...formState] : [];
    const filterSkill = skills.find(
      (item) => item?.skill_id === parentName?.id,
    );
    console.log({ skills, parentName, filterSkill });
    if (filterSkill) {
      filterSkill.selected = childId;
    }
    if (!filterSkill) {
      {
        skills.push({
          skill_id: parentName?.id,
          selected: childId,
          expected: exp,
          jsp_skill_id,
        });
      }
    }
    console.log({ skills });
    setFormState(skills);
  };

  const getBackgroundColor = (itemId: string) => {
    const idCheck =
      jspData?.data?.JspCompetencies[indexNumber]?.JspSkill[0]?.Skill
        ?.SkillLevels;

    const isPresent = idCheck.some((val: any) => val.id === itemId);

    // Return the background color based on the presence check
    return isPresent ? "pink" : "transparent";
  };

  const handleIncreaseIndex = (e: any) => {
    console.log("This is formstatr", formState);
    e.preventDefault();

    // Check if formState is filled
    if (
      !formState ||
      formState.length !==
        jspData?.data?.JspCompetencies[indexNumber]?.JspSkill?.length ||
      formState.length === 0
    ) {
      toast.warning(
        "Please fill out the form before proceeding to the next step.",
      );
      return;
    }

    // Check if all values are 0 and if they are then return a warning message
    if (
      formState.every(
        (item: any, index: number) =>
          item.selected ===
          jspData?.data?.JspCompetencies[indexNumber]?.JspSkill[index]?.Skill
            ?.SkillLevels[5]?.id,
      )
    ) {
      toast.warning("You cannot proceed further, All values cannot be N/A.");
      return;
    }

    // Update finalPayload dynamically
    setFinalPayload((prevPayload: any) => {
      // Extract the competency_id
      const competency_id =
        jspData?.data?.JspCompetencies[indexNumber]?.Competency?.id;

      // Create a new object for the current step
      const newExpected = {
        competency_id: competency_id,
        PspSkill: [...formState],
      };

      // Check if the competency_id already exists in the expected array
      const updatedExpectedArray = prevPayload.expected.some(
        (item: any) => item.competency_id === competency_id,
      )
        ? prevPayload.expected.map((item: any) =>
            item.competency_id === competency_id
              ? newExpected // Replace existing entry
              : item,
          )
        : [...prevPayload.expected, newExpected]; // Add new entry
      if (parsedUser) prevPayload.pspUser = parsedUser;
      // Return the updated finalPayload object
      return {
        ...prevPayload,
        jsp_id: jspData?.data?.id, // Keep jsp_id the same
        expected: updatedExpectedArray,
      };
    });

    const findCom = finalPayload?.expected?.find(
      (child: any) =>
        child?.competency_id ===
        jspData?.data?.JspCompetencies[indexNumber + 1]?.Competency?.id,
    );
    if (findCom?.PspSkill) {
      setFormState(findCom?.PspSkill);
    } else {
      setFormState([]);
    }
    // Reset formState for the new step

    // Move to the next step if applicable
    if (indexNumber < (jspData?.data?.JspCompetencies.length ?? 0) - 1) {
      setIndexNumber((prev) => prev + 1);
      setActiveStep((prev) => prev + 1);
    } else {
      setOpenSubmit(true);
    }
  };
  // ------------------------------------------------OLD VERSION MINE------------------------------
  // const handleIncreaseIndex = () => {
  //   setFinalData((prevData) => {
  //     const newData = { ...formState };
  //     console.log({newData})

  //     // Create a new array to store updated data
  //     const updatedData = [...prevData];
  //     setFinalPayload({
  //       jsp_id: jspData?.data?.id,
  //       expected: [
  //         {
  //           competency_id:jspData?.data?.JspCompetencies[indexNumber]?.Competency?.id,
  //           PspSkill: [...formState],
  //         },
  //       ],
  //     });

  //     // Update existing entry or add a new one
  //     if (indexNumber < updatedData.length) {
  //       updatedData[indexNumber] = newData;
  //     } else {
  //       updatedData.push([...formState]);
  //     }

  //     return updatedData;
  //   });

  //   // Reset formState for new step
  //   setFormState({});

  //   if (indexNumber < jspData.data?.JspCompetencies.length - 1) {
  //     setIndexNumber((prev) => prev + 1);
  //     setActiveStep((prev) => prev + 1);
  //   }
  // };

  // ------------------------------------------------OLD VERSION MINE------------------------------

  // ---------------------checking console  console.log(finalData, "datatatata");
  // const finalPayloadColor = (competancy, item, itemv) => {
  //   console.log({ competancy, item, itemv });
  //   const findCom = finalPayload?.expected?.find(
  //     (child) => child?.competency_id === competancy?.id,
  //   );
  //   findCom?.PspSkill && setFormState(findCom?.PspSkill);

  //   // return findCom?.PspSkill?.find(
  //   //   (child) =>
  //   //     item?.Skill?.id === child?.skill_id && child?.selected === itemv?.id,
  //   // );
  //   console.log({
  //     findCom: findCom?.PspSkill?.find(
  //       (child) => child?.selected === itemv?.id,
  //     ),
  //   });
  // };
  // console.log(jspData?.data?.JspCompetencies[indexNumber]?.JspSkill, "debugg");
  // ---------------------checking console
  // console.log(finalPayload.expected.some(val=>val.PspSkill.skill_id===formState.selected),'XXXXXXXXXXXXXXXXXXXXXXXXXXX')

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
    <>
      <Toaster richColors position="top-right" closeButton />

      <div className="h-[100%] w-[100%] bg-ac-3 font-montserrat">
        {/* -------------HEADER WITH STEPPER START---------------------- */}
        <div className="flex w-[100%] items-center justify-between">
          <div className="w-[50%]">
            <TopComponentWithHeading
              title="My Assessment"
              description="Here is the latest details...Check Now!
"
            />
          </div>
          <div className="w-[20%]">
            <Stepper
              size="lg"
              index={activeStep}
              style={{ margin: 0, padding: 0 }}
            >
              {jspData?.data?.JspCompetencies?.map(
                (step: any, index: number) => (
                  <Step
                    key={index}
                    style={{ margin: 0, padding: 0 }}
                    // sx={{
                    //   ".chakra-step__indicator": {
                    //     border: index < activeStep ? "none" : "1px solid #96233C",
                    //     bg: index < activeStep ? "#96233C !important" : "none", // Complete steps color
                    //     color: index < activeStep ? "#FFF" : "#96233C", // Step number color
                    //   },
                    // }}
                  >
                    <StepIndicator
                      borderColor={
                        index < activeStep ? "none" : "#96233C !important"
                      }
                      bg={
                        index < activeStep
                          ? "#96233C !important"
                          : "transparent"
                      }
                      color={index < activeStep ? "#FFF" : "#96233C"}
                      borderWidth="2px" // Uniform border width
                      boxShadow="none" //
                    >
                      <StepStatus
                        complete={<StepNumber />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>

                    <StepSeparator
                      style={{
                        width: "100%",
                        margin: 0,
                        padding: 0,
                        backgroundColor: "#96233C",
                      }}
                    />
                  </Step>
                ),
              )}
            </Stepper>
          </div>
        </div>
        {/* -------------HEADER WITH STEPPER END---------------------- */}
        <div className="p-2 pt-6">
          <h4 className="mb-5 pl-[14px] text-[18px] font-semibold">
            {jspData?.data?.JspCompetencies[indexNumber]?.Competency
              ? jspData.data?.JspCompetencies[indexNumber]?.Competency?.name
              : "no data"}
          </h4>

          <div className="">
            <TableContainer p={0} m={0}>
              <form onSubmit={handleSubmit((data) => console.log(data))}>
                <Table
                  w={"100%"}
                  size={{ base: "xs", "2xl": "md" }}
                  p={0}
                  m={0}
                >
                  <Thead sx={{ border: "none" }}>
                    <Tr border={"none"}>
                      <Th
                        textTransform={"none"}
                        fontWeight="700"
                        fontSize={"15px"}
                        // borderBottom="1px solid #CCCCCC"
                        style={{ fontSize: "16px" }}
                      >
                        S.N.
                      </Th>
                      <Th
                        textTransform={"none"}
                        textAlign={"center"}
                        fontWeight="700"
                        fontSize={"15px"}
                        // borderBottom="1px solid #CCCCCC"
                        style={{ fontSize: "16px" }}
                      >
                        {jspData &&
                          (jspData.data?.JspCompetencies[indexNumber]
                            ?.Competency?.name === "Leadership Competencies"
                            ? "Competency"
                            : jspData.data?.JspCompetencies[indexNumber]
                                  ?.Competency?.name ===
                                "General Business Skills"
                              ? "Business Skill"
                              : jspData.data?.JspCompetencies[indexNumber]
                                    ?.Competency?.name ===
                                  "Functional / Technical Skills"
                                ? "Functional / Technical Skill"
                                : "")}
                      </Th>
                      <Th
                        textTransform={"none"}
                        fontWeight="700"
                        fontSize={"15px"}
                        colSpan={5}
                        textAlign="center"
                        // borderBottom="1px solid #CCCCCC"
                        style={{ fontSize: "16px" }}
                      >
                        Level
                      </Th>
                    </Tr>
                    <Tr>
                      <Th></Th>
                      <Th border={"none"}></Th>
                      <Th
                        textAlign={"center"}
                        textTransform={"none"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.one}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          Basic Awareness
                        </Tooltip>
                      </Th>
                      <Th
                        textTransform={"none"}
                        border={"none"}
                        // border={"1px solid red"}
                        textAlign={"center"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.two}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          Working Knowledge
                        </Tooltip>
                      </Th>
                      <Th
                        textTransform={"none"}
                        textAlign={"center"}
                        border={"none"}
                        // border={"1px solid red"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.three}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          Fully Operational
                        </Tooltip>
                      </Th>
                      <Th
                        textTransform={"none"}
                        textAlign={"center"}
                        // border={"1px solid red"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.four}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          Leading Edge
                        </Tooltip>
                      </Th>
                      <Th
                        textTransform={"none"}
                        textAlign={"center"}
                        border={"none"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.five}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          World Class
                        </Tooltip>
                      </Th>
                      <Th
                        textTransform={"none"}
                        textAlign={"center"}
                        border={"none"}
                        fontSize={"11px"}
                      >
                        <Tooltip
                          label={
                            <span style={{ fontSize: "12px" }}>
                              {hoverTip.six}
                            </span>
                          }
                          fontSize="md"
                          hasArrow
                          placement="left-start"
                          color="#000"
                          bg="#F9D2D5"
                        >
                          Not Applicable
                        </Tooltip>
                      </Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {jspData?.data?.JspCompetencies[indexNumber]?.JspSkill?.map(
                      (item: any, index: number) => (
                        <Tr
                          key={index}
                          justifyContent={"center"}
                          sx={{
                            // border:
                            //   index % 2 === 0 ? "1px solid #CCCC" : "none",
                            // boxShadow: index % 2 === 0 ? "lg" : "none",
                            bg: index % 2 === 0 ? "white" : "transparent",
                          }}
                        >
                          <Td border="none" textAlign={"center"}>
                            {index + 1}
                          </Td>
                          <Td
                            fontSize={{ base: "12px", "2xl": "15px" }}
                            textAlign={"center"}
                          >
                            <Tooltip
                              label={
                                <span style={{ fontSize: "12px" }}>
                                  {item.Skill.description}
                                </span>
                              }
                              fontSize="sm"
                              placement="right-start"
                              color="#000"
                              bg="#F9D2D5"
                              hasArrow
                            >
                              <span
                                style={{
                                  fontWeight: 600,
                                  whiteSpace: "normal", // Allows text to wrap
                                  wordWrap: "break-word", // Breaks long words
                                }}
                              >
                                {item.Skill.name}
                              </span>
                            </Tooltip>
                          </Td>
                          {item?.Skill?.SkillLevels?.map(
                            (itemv: any, indexv: number) => {
                              // console.log({ itemv, skill: item?.Skill });
                              const findSelectLevel = formState?.length
                                ? formState?.find(
                                    (child: any) =>
                                      child?.selected === itemv.id &&
                                      child.skill_id === item?.Skill?.id,
                                  )
                                : false;
                              return (
                                <Td
                                  border="none"
                                  // border={"1px solid red"}
                                  justifyContent={"center"}
                                  key={indexv}
                                  alignItems={"center"}
                                >
                                  {/* <Tooltip
                                    label={
                                      <span style={{ fontSize: "12px" }}>
                                        {itemv.description}
                                      </span>
                                    }
                                    fontSize="md"
                                    hasArrow
                                    placement="left-start"
                                    color="#000"
                                    bg="#F9D2D5"
                                  > */}
                                  <div
                                    className="!m-auto flex w-[100px] cursor-pointer items-center justify-center border p-2"
                                    style={{
                                      backgroundColor: findSelectLevel
                                        ? "pink"
                                        : "transparent",
                                      borderRadius: "10px",
                                    }}
                                    onClick={() =>
                                      handleItemClick(
                                        item.Skill,
                                        itemv.id,
                                        item?.ExpectedLevel?.id,
                                        item?.id,
                                      )
                                    }
                                  >
                                    {itemv.value === 0 ? "N/A" : itemv.value}
                                  </div>
                                  {/* </Tooltip> */}
                                </Td>
                              );
                            },
                          )}
                        </Tr>
                      ),
                    )}
                  </Tbody>
                </Table>
              </form>
            </TableContainer>
            {/* -----------TABEL END--------------------------- */}
          </div>
          {/* <Button
            className="my-8 bg-ac-1 text-ac-4"
            onClick={handleIncreaseIndex}
          >
            {" "}
            Continue
          </Button> */}
          {indexNumber === 2 ? (
            <div className="my-8 flex gap-4">
              <Button
                onClick={handleEdit}
                className="mx-2 bg-ac-2 text-ac-1 hover:bg-ac-2 hover:text-ac-1"
              >
                Review PSP
              </Button>
              <Button
                onClick={handleIncreaseIndex}
                className="bg-ac-1 text-ac-4 hover:bg-ac-1 hover:text-ac-4"
              >
                Lock PSP
              </Button>
            </div>
          ) : (
            <Button
              className="my-8 bg-ac-1 text-ac-4"
              onClick={handleIncreaseIndex}
            >
              {" "}
              Continue
            </Button>
          )}
        </div>
      </div>
      <SubmissionModal
        isOpen={openSubmit}
        onOpenChange={setOpenSubmit}
        dataAssessment={finalPayload}
        setFormState={setFormState}
        setIndexNumber={setIndexNumber}
      />
      {/* congratsSubmit,setCongratsSubmit */}
    </>
  );
};

export default MainAssessment;
