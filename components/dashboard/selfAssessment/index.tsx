import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import PaymentModal from "@/components/website/plans/paymentModal";
import Error from "@/pages/error";
import { GET } from "@/server/clientController/auth/auth";
import { useAppSelector } from "@/store/hooks";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiGroupLine } from "react-icons/ri";
import { TbCertificate, TbFileCertificate } from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";
import CardComponent from "../reusableComponents/cardComponent";
import BarChart from "../reusableComponents/charts/barChart";
import TopComponentWithHeading from "../reusableComponents/topComponentWithHeading";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
const clientSecret = process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET;

const SelfAssessment = (props: any) => {
  const [selectedItem, setSelectedItem] = useState({
    id: "",
    name: "",
  });
  const [isDialogOpen, setDialogOpen] = useState<Boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>();
  const [authentic, setAuthentic] = useState(false);
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleMenuItemClick = (item: any, name: any) => {
    setSelectedItem((prevState) => ({
      ...prevState, // Keep the existing values (like `name`)
      id: item, // Update only the `id` with the new value
      name: name,
    }));

    console.log("Selected Item ID:", item.id); // Log the selected item ID
    // refetch();
  };
  useEffect(() => {
    console.log("Updated Selected Item:", selectedItem);
  }, [selectedItem]);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  // ----------------API CALL-------------------------------//
  const {
    isLoading,
    isFetching,
    isError,
    isSuccess,
    refetch,
    error,
    data: mainData,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () =>
      GET(
        selectedItem?.id !== ""
          ? `/dashboard?id=${selectedItem?.id}`
          : `/dashboard`,
      ),
    refetchOnWindowFocus: false,
    retry: 3,
    // staleTime: 1000 * 60 * 3, // 3 minutes
    // enabled: selectedItem.length > 0 ? true : false,
  });
  // ----------------API CALL-------------------------------//
  useEffect(() => {
    if (selectedItem) {
      refetch();
    }
  }, [refetch, selectedItem]);

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
    <>
      <div className="h-[100%] w-[100%]">
        <div>
          <TopComponentWithHeading
            title="My Dashboard"
            description="Here is the latest details...Check Now!
"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4">
          {/*-------------- Grid 1 -------------------------- */}

          <div className="grid grid-cols-1 gap-4 capitalize md:grid-cols-2 lg:grid-cols-4">
            <div
              className="col-span-1 rounded-lg shadow-md"
              style={{ height: "180px" }}
            >
              <CardComponent
                title={mainData?.data?.dashboardData?.attempts?.name}
                counts={mainData?.data?.dashboardData?.attempts?.value}
                countText=""
                buttonText=""
                selfOrgButtonText={
                  mainData?.data?.is_ogranization ? "View Details" : ""
                }
                asisData=""
                validityActive=""
              />
            </div>
            <div
              className="col-span-1 flex flex-col gap-4 rounded-lg py-1 lg:col-span-2"
              // style={{ border: "1px solid red" }}
            >
              {/* ---------------1 step ---------------- */}
              <div className="col-span-1 flex h-[45%] items-center justify-start gap-4 rounded-lg bg-ac-4 p-2 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ac-1">
                  <TbFileCertificate color="#fff" size={25} />
                </div>
                <div className="flex gap-2 font-semibold text-ac-9">
                  <p>
                    {mainData?.data?.dashboardData?.industry?.name}
                    {"  "}:
                  </p>
                  <p>{mainData?.data?.dashboardData?.industry?.value}</p>
                </div>
              </div>
              {/* ---------------2 step ---------------- */}
              <div className="col-span-1 flex h-[45%] items-center justify-start gap-4 rounded-lg bg-ac-4 p-2 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ac-1">
                  <RiGroupLine color="#fff" size={22} />
                </div>
                <div className="flex gap-2 font-semibold text-ac-9">
                  <p>
                    {mainData?.data?.dashboardData?.role?.name} {"  "}:
                  </p>
                  <p>{mainData?.data?.dashboardData?.role?.value}</p>
                </div>
              </div>
            </div>
            <div className="col-span-1 rounded-lg shadow-md">
              <CardComponent
                title={mainData?.data?.dashboardData?.validity?.name}
                counts={mainData?.data?.dashboardData?.validity?.value}
                countText="Days Left"
                buttonText="View Details"
                selfOrgButtonText=""
                asisData={mainData?.data?.dashboardData?.validity?.child}
                validityActive={
                  mainData?.data?.dashboardData?.assement?.is_active
                }
              />
            </div>
          </div>
          {/* </div> */}
          {/* ------------- Grid 2 -------------------------- */}
          <div
            className="rounded-lg"
            // style={{ border: "1px solid red" }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {/*----------- medium section Grid 1 ----------------*/}
              <div
                // className={`col-span-1 h-[auto] rounded-lg bg-ac-4 p-4 shadow-md ${mainData?.data?.is_organization ? "sm:col-span-4 md:col-span-4 2xl:col-span-4" : "sm:col-span-2 md:col-span-2 2xl:col-span-3"}`}
                className={`col-span-1 h-auto rounded-lg bg-ac-4 p-4 shadow-md ${
                  mainData?.data?.is_ogranization
                    ? "py-7 sm:col-span-4 md:col-span-4 2xl:col-span-4" // Full width if is_organization is true
                    : "sm:col-span-2 md:col-span-2 2xl:col-span-3"
                }`}
              >
                <div
                  className={`flex h-full ${mainData?.data?.is_ogranization ? "flex-row" : "flex-col"} items-center justify-between gap-2 px-2 2xl:flex-row`}
                  // style={{ border: "1px solid red" }}
                >
                  <div className="flex items-center gap-3">
                    <TbCertificate color="#96233C" size={79} />
                    <div className="flex flex-col gap-1">
                      <p className="text-[16px] font-semibold 2xl:text-[20px]">
                        {mainData?.data?.dashboardData?.assement?.name}
                      </p>
                      <p className="text-[12px] font-semibold text-ac-7 2xl:w-[380px] 2xl:text-[13px]">
                        {mainData?.data?.dashboardData?.assement?.description}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={
                      mainData?.data?.dashboardData?.assement?.is_active
                        ? false
                        : true
                    }
                    onClick={() =>
                      router.push(
                        `${mainData?.data?.dashboardData?.assement?.path}`,
                      )
                    }
                    className={`w-[220px] rounded ${mainData?.data?.dashboardData?.assement?.is_active ? "cursor-pointer bg-ac-1" : "cursor-not-allowed bg-ac-7"} px-4 py-2 text-[14px] font-semibold text-white`}
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
              {/*---------------- medium section Grid 2 -----------------*/}
              {mainData?.data?.is_ogranization === false && (
                <div className="col-span-1 rounded-lg shadow-md sm:col-span-2 md:col-span-2 2xl:col-span-1">
                  <div
                    className="flex flex-col items-center justify-start gap-8 rounded-lg bg-white p-5 shadow-md"
                    style={{ height: "100%" }}
                  >
                    <span className="text-center text-[15px] font-semibold">
                      Renew your Plan
                      {/* {mainData?.data?.dashboardData?.renew_plan?.description} */}
                    </span>
                    <button
                      disabled={
                        mainData?.data?.dashboardData?.renew_plan?.is_active
                          ? false
                          : true
                      }
                      onClick={() => setDialogOpen(true)}
                      className={`w-[100%] rounded-md text-[14px] ${mainData?.data?.dashboardData?.renew_plan?.is_active ? "bg-ac-1" : "cursor-not-allowed bg-ac-7"} p-2 font-semibold text-ac-4`}
                    >
                      Click Here
                      {/* {mainData?.data?.dashboardData?.renew_plan?.name} */}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ------------- Grid 3 -------------------------- */}
          <div
            className="rounded-lg"
            // style={{ border: "1px solid green" }}
          >
            {mainData?.data?.is_ogranization === false ? (
              <>
                <div className="flex w-[100%] items-center justify-between bg-none p-2">
                  <h3 className="font-semibold">My Average Score</h3>

                  <Menu>
                    <MenuButton
                      as={Button}
                      disabled={
                        mainData?.data?.sortBy?.length > 0 ? false : true
                      }
                      variant="outline"
                      className="bg-ac-3 text-ac-7"
                      style={{
                        border: "1px solid #75767A",
                        display: "flex",
                      }}
                    >
                      <div className="flex">
                        <VscSettings
                          size={20}
                          style={{ marginRight: "10px" }}
                        />
                        Sort By
                      </div>
                    </MenuButton>
                    <MenuList px={2} overflowY="auto" maxH="200px">
                      {mainData?.data?.sortBy?.map(
                        (item: any, index: number) => (
                          <MenuItem
                            key={index}
                            _hover={{ bg: "#96233C", color: "#FFFF" }}
                            _active={{ bg: "#96233C", color: "#FFFF" }}
                            bg={
                              selectedItem?.id === item.id ||
                              (selectedItem?.id === "" && index === 0)
                                ? "#96233C"
                                : "none"
                            }
                            color={
                              selectedItem?.id === item.id ||
                              (selectedItem?.id === "" && index === 0)
                                ? "#FFFF"
                                : "#75767A"
                            }
                            borderRadius={"8px"}
                            fontWeight={"600"}
                            fontSize={"13px"}
                            onClick={() =>
                              handleMenuItemClick(item?.id, item?.name)
                            }
                          >
                            {item?.name}
                          </MenuItem>
                        ),
                      )}
                    </MenuList>
                  </Menu>
                  {mainData?.data?.chartData?.data?.PspCompetencies.length >
                    0 && (
                    <Link
                      href={`/report/${selectedItem?.id ? selectedItem?.id : mainData?.data?.chartData?.data?.id}`}
                      target="_blank"
                      // onClick={() => router.push(`/report/${id}`)}
                      // onClick={generatePDF}

                      // style={{ border: "1px solid #75767A" }}
                    >
                      <Button
                        size={"sm"}
                        className="border border-black bg-transparent text-[#000] hover:bg-ac-1 hover:text-ac-4"
                      >
                        {" "}
                        Download Report{" "}
                      </Button>
                    </Link>
                  )}
                </div>
                <div className="grid w-[100%] grid-cols-1 gap-4">
                  <div className="rounded-lg bg-none p-4">
                    {mainData?.data?.chartData?.data?.PspCompetencies.length >
                    0 ? (
                      <Tabs variant="unstyled">
                        <TabList gap={3}>
                          {mainData?.data?.chartData?.data?.PspCompetencies?.map(
                            (tab: any, index: number) => (
                              <Tab
                                key={tab?.Competency?.name}
                                bg={"none"}
                                border={"1px solid #75767A"}
                                borderRadius={"10px"}
                                color={"#75767A"}
                                p={2}
                                px={7}
                                fontSize={"13px"}
                                // isDisabled={
                                //   mainData?.chartData?.data?.PspCompetencies?.length >
                                //   0
                                //     ? false
                                //     : true
                                // }
                                _selected={{ color: "white", bg: "#96233C" }}
                              >
                                {tab?.Competency?.name}
                              </Tab>
                            ),
                          )}
                        </TabList>
                        <TabPanels>
                          {mainData?.data?.chartData?.data?.PspCompetencies.map(
                            (item: any, index: number) => (
                              <TabPanel key={item?.Competency?.name}>
                                <div className="flex w-[100%] justify-between">
                                  <div className="border-blackc w-[70%]">
                                    {/* <p>Content for! {item?.Competency?.name}</p> */}
                                    {!isFetching ? (
                                      <BarChart
                                        // title={item?.Competency?.name}
                                        data={item?.main_graph}
                                      />
                                    ) : (
                                      <div className="flex h-[400px] items-center justify-center">
                                        <Loader size={60} />
                                      </div>
                                    )}
                                  </div>
                                  {/* <Button
                                size={"sm"}
                                className="border border-black bg-transparent text-[#000] hover:bg-ac-1 hover:text-ac-4"
                              >
                                {" "}
                                Download Report{" "}
                              </Button> */}
                                </div>
                              </TabPanel>
                            ),
                          )}
                        </TabPanels>
                      </Tabs>
                    ) : (
                      <div
                        className="flex h-[250px] w-[100%] flex-col items-center justify-center"
                        // style={{ border: "1px solid red" }}
                      >
                        <Image
                          src={"/esclaimationMark.png"}
                          alt="No Results Found"
                          width={85}
                          height={85}
                        />
                        <div className="mt-2 flex flex-col items-center justify-center gap-2">
                          <h5>No Results Found</h5>
                          <p className="text-[12px] text-ac-7">
                            Note: Once you start the assessment, then you will
                            see the data.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-[100%] rounded-lg border border-ac-7 p-2">
                {/* ----------------top title filter section -------------------- */}
                <div className="flex w-[100%] items-center justify-between px-2">
                  <div className="flex gap-2 text-[16px] font-semibold">
                    <p>Department {"  "}:</p>
                    <p>{selectedItem?.name || ""}</p>
                  </div>
                  <p className="text-[16px] font-semibold">Average Score</p>
                  <Menu>
                    <MenuButton
                      as={Button}
                      disabled={
                        mainData?.data?.sortBy?.length > 0 ? false : true
                      }
                      variant="outline"
                      className="bg-ac-3 text-ac-7"
                      style={{
                        border: "1px solid #75767A",
                        display: "flex",
                      }}
                    >
                      <div className="flex">
                        <VscSettings
                          size={20}
                          style={{ marginRight: "10px" }}
                        />
                        Sort By
                      </div>
                    </MenuButton>
                    <MenuList px={2} overflowY="auto" maxH="200px">
                      {mainData?.data?.sortBy?.map(
                        (item: any, index: number) => (
                          <MenuItem
                            key={index}
                            _hover={{ bg: "#96233C", color: "#FFFF" }}
                            _active={{ bg: "#96233C", color: "#FFFF" }}
                            bg={
                              selectedItem?.id === item.id ||
                              (selectedItem?.id === "" && index === 0)
                                ? "#96233C"
                                : "none"
                            }
                            color={
                              selectedItem?.id === item.id ||
                              (selectedItem?.id === "" && index === 0)
                                ? "#FFFF"
                                : "#75767A"
                            }
                            borderRadius={"8px"}
                            fontWeight={"600"}
                            fontSize={"13px"}
                            onClick={() =>
                              handleMenuItemClick(item?.id, item?.name)
                            }
                          >
                            {item?.name}
                          </MenuItem>
                        ),
                      )}
                    </MenuList>
                  </Menu>
                </div>
                {/* -----------------TABLE SECTION--------------------------------------- */}
                {!isFetching ? (
                  <TableContainer mt={4} height="auto">
                    <Table
                      variant="striped"
                      w={"100%"}
                      maxWidth="100%"
                      size={{ base: "xs", "2xl": "md" }}
                      colorScheme="red"
                    >
                      <Thead>
                        <Tr>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            S.N.
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            Candidate
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            Assessed By
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            Leadership Competences
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            General Business Skills
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          >
                            Functional/Technical Skills
                          </Th>
                          <Th
                            fontSize={"13px"}
                            textAlign="center"
                            verticalAlign="middle"
                            textTransform={"none"}
                          ></Th>
                        </Tr>
                      </Thead>

                      <Tbody>
                        {mainData?.data?.tableData?.data?.map(
                          (item: any, index: number) => (
                            <Tr key={index} py={0} borderRadius={"20px"}>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {index + 1}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {item?.pspUser?.full_name}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {item?.User?.full_name}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {item?.average[0]?.percentage}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {item?.average[1]?.percentage}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                {item?.average[2]?.percentage}
                              </Td>
                              <Td
                                fontSize={"13px"}
                                textAlign="center"
                                verticalAlign="middle"
                              >
                                <div
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/analysis/${item?.id}`,
                                    )
                                  }
                                  className="cursor-pointer rounded-lg border border-ac-10 bg-transparent"
                                >
                                  <p className="p-1 text-[10px] font-semibold">
                                    {" "}
                                    More Details
                                  </p>
                                </div>
                              </Td>
                            </Tr>
                          ),
                        )}
                      </Tbody>
                    </Table>
                  </TableContainer>
                ) : (
                  <div className="flex h-[400px] items-center justify-center">
                    <Loader size={60} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Elements
        stripe={stripe}
        options={{ ...options, appearance: { theme: "stripe" } }}
      >
        <PaymentModal
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          planId={mainData?.data?.plan?.id}
          planType={mainData?.data?.plan?.type}
          path={"renew"}
          refetchDash={refetch}
        />
      </Elements>
    </>
  );
};

export default SelfAssessment;
