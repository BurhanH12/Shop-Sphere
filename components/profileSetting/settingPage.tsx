import React, { useState } from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAppSelector } from "@/store/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tab";
import ChangePasswordModal from "./reusableComponent/changePasswordModal";
import RemoveAccountModal from "./reusableComponent/removeAccountModal";
import { useRouter } from "next/router";
import { Divider } from "@chakra-ui/react";
import { GET } from "@/server/clientController/auth/auth";
import { useQuery } from "@tanstack/react-query";

const Setting = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("firstTab");
  const [openChangepassword, setOpenChangepassword] = useState(false);
  const [openRemoveAccount, setOpenRemoveAccount] = useState(false);

  const tabData = [
    { value: "firstTab", content: "HR(1)" },
    { value: "secondTab", content: "Sales(4)" },
    { value: "thirdTab", content: "Marketing(4)" },
    { value: "fourthTab", content: "Backhend Engineers(3)" },
  ];

  // const { data: userData, isFetched } = useQuery({
  //   queryKey: ["userData"],
  //   queryFn: () => GET(`/users/profile`),
  //   refetchInterval: 30000,
  //   refetchOnWindowFocus: false,
  //   staleTime: 1000 * 60 * 5, // 5 minutes
  // });
  // console.log({ userData: userData?.user_plan });
  return (
    <>
      <div className="bg-ac-3">
        {/* -------------HEADER WITH STEPPER START---------------------- */}
        <div className="flex w-[100%] items-center justify-between pr-2">
          <TopComponentWithHeading
            title="Settings"
            description="Here is the latest details...Check Now!
"
          />
          {/* <div className="flex gap-2">
            <Button
              variant={"outline"}
              className="bg-transparent text-ac-5 hover:bg-ac-1 hover:text-ac-4"
              style={{ border: "1px solid #75767A" }}
              onClick={() => setOpenChangepassword(!openChangepassword)}
            >
              {" "}
              Change Password{" "}
            </Button>
            <Button
              variant={"outline"}
              className="border border-[#75767A] bg-transparent text-ac-5 hover:bg-ac-1 hover:text-ac-4"
              // className="border border-[#75767A] bg-transparent text-ac-5"
              onClick={() => setOpenRemoveAccount(!openRemoveAccount)}
            >
              {" "}
              Delete Account{" "}
            </Button> */}
        </div>
      </div>
      {/* -------------HEADER WITH STEPPER End---------------------- */}
      {/* ---------IMAGE WITH  NAME */}
      <div className="mt-5 flex items-center gap-2 pl-3">
        {/* <Image src={'/profileImage.png'} alt='profile' height={90}  width={90} /> */}
      </div>
      {/* ---------IMAGE WITH  NAME */}
      {/* ---------PROFILE SECTION DATA--------------------- */}
      <div className="mt-5 grid grid-cols-1 gap-6 pl-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
        {/* ------first row */}
        <div className="text-ac-13">
          <p className="text-[14px]">Full Name</p>
          <p className="text-[14px] font-semibold capitalize">
            {user?.full_name}
          </p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Gender</p>
          <p className="text-[14px] font-semibold capitalize">{user?.gender}</p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Country</p>
          <p className="text-[14px] font-semibold capitalize">
            {user?.country}
          </p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">City</p>
          <p className="text-[14px] font-semibold capitalize">{user?.city}</p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">National Identity Card Number</p>
          <p className="text-[14px] font-semibold">{user?.nic}</p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Phone Number</p>
          <p className="text-[14px] font-semibold">{user?.number}</p>
        </div>

        {/* ------second row */}
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Email</p>
          <p className="text-[14px] font-semibold">{user?.email}</p>
        </div>
        {/* <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px] ">Address</p>
          <p className="text-[14px] font-semibold">King Fahd Rd, Al Bustan</p>
        </div> */}
        {/* <div className="flex flex-col items-start text-ac-13">
            <p className="text-[14px]">National Identity Card</p>
            <p className="text-[14px] font-semibold">{user?.nic}</p>
          </div> */}
      </div>
      <div className="mt-4">
        <Divider size={"xl"} color={"black"} />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-6 pl-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">My Role</p>
          <p className="text-[14px] font-semibold capitalize">
            {user?.Role?.name}
          </p>
        </div>
        {user?.RoleType?.name === "self" && (
          <div className="flex flex-col items-start text-ac-13">
            <p className="text-[14px]">My Department</p>
            <p className="text-[14px] font-semibold capitalize">
              {user?.Department?.name ?? "--"}
            </p>
          </div>
        )}
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Industry</p>
          <p className="text-[14px] font-semibold capitalize">
            {user?.Industry?.name}
          </p>
        </div>
        <div className="flex flex-col items-start text-ac-13">
          <p className="text-[14px]">Subscription</p>
          <p className="text-[14px] font-semibold capitalize">
            {user?.Organization !== null
              ? "Organizational Assessment (Hiring)"
              : "Self Assesment"}
          </p>
        </div>
      </div>
      {/* ---------PROFILE SECTION End--------------------- */}
      {/* -------------------TAB SECTION START-------------------------*/}

      {/* <div className="mt-5 h-[300px] pl-3 pt-2 2xl:pt-[100px]">
        <div className="flex h-[300px] flex-col items-center justify-center gap-6">
          <Image src={"/UpgradePlan.png"} alt="" height={100} width={100} />
          <div className="flex flex-col items-center justify-center gap-2 text-[12px]">
            <p className="text-[22px] font-bold text-ac-13">
              Renew your plan for 3 more attempts
            </p>
            <p>
                Currently you’re using the “Self Assessment” plan where you can
                only evaluate your
              </p>
              <p>skills, click on the below button to see more features</p>
          </div>

          <Button
            disabled={userData?.data?.user_plan?.is_active ? false : true}
            className="w-[200px] bg-ac-1 text-ac-4"
            onClick={() => router.push("/dashboard")}
          >
            Renew Plan
          </Button>
        </div>

        <Tabs defaultValue={activeTab} className="w-[100%]">
          <div className="py-2 text-ac-13  text-[17px] font-semibold">
            Team Members
          </div>
          <TabsList className="gap-3">
            {tabData.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className={`data-[state=active]:bg-ac-1 data-[state=active]:text-white`}
                onClick={() => setActiveTab(item.value)}
              >
                {item.content}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabData.map((item) => (
            <TabsContent key={item.value} value={item.value}>
              <TabData mainHeading={item.content} />
            </TabsContent>
          ))}
        
        </Tabs>
      </div> */}

      {/* -------------------TAB SECTION END-------------------------*/}
      <ChangePasswordModal
        isOpen={openChangepassword}
        onOpenChange={setOpenChangepassword}
      />
      <RemoveAccountModal
        isOpen={openRemoveAccount}
        onOpenChange={setOpenRemoveAccount}
      />
    </>
  );
};

export default Setting;
