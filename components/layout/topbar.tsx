import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteCookie } from "cookies-next";
import { FaRegBell, FaUser } from "react-icons/fa";
import Image from "next/image";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { userAuth, userIsLogin } from "@/store/slices/authSlice";
import { userAdminAuth, userAdminIsLogin } from "@/store/slices/adminAuthSlice";
import { initialState } from "@/store/slices/authSlice";
import { initialState as adminInitial } from "@/store/slices/adminAuthSlice";

const Topbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { user: admin } = useAppSelector((state) => state.adminAuth);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [openNotification, setOpenNotification] = useState(false);

  const notificationArray = [
    {
      id: 1,
      title: "New Message",
      description: "“John Doe” posted a new event, please review.",
      icon: null,
      buttonText: "Review",
    },
    {
      id: 2,
      title: null,
      description: "“John Doe” posted a new event, please review.",
      icon: null,
    },
  ];
  const handleNotificationClick = () => {
    setOpenNotification(!openNotification);
  };
  const handleMenuItemClick = (item: string) => {
    setClickedItem(item);
    switch (item) {
      case "Profile Settings":
        router.push("/dashboard/setting");
        break;
      case "Account Settings":
        router.push("/dashboard/setting");
        break;
      case "Logout":
        // Remove user-related data from local storage
        localStorage.removeItem("resource-user");
        localStorage.removeItem("resource-admin");
        localStorage.removeItem("candidate-data");

        // Delete both auth-token and admin-token cookies
        deleteCookie("auth-token");
        deleteCookie("admin-token");

        // Empty the user and admin data from Redux
        dispatch(userAuth(null));
        dispatch(userIsLogin(false));
        dispatch(userAdminAuth(null));
        dispatch(userAdminIsLogin(false));

        // Redirect to the login page
        router.replace("/login");
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex h-[78px] w-full justify-between p-4">
      <div className="flex h-full w-1/2 items-center px-4 2xl:w-3/5"></div>
      <div className="flex h-[50px] w-1/2 items-center justify-end 2xl:w-2/5">
        <div className="flex h-full w-1/5 items-center justify-end gap-5 px-1">
          {/* Notification Menu */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-ac-1 p-3"
            >
              <FaRegBell size={"sm"} color="#FFFF" style={{ padding: 2 }} />

              <div className="absolute bottom-0 right-0 h-[15px] w-[15px] rounded-full bg-ac-6"></div>
            </button>
            {/* {clickedItem && ( */}
            <div
              className={`scrollbar-hide absolute right-0 mt-2 flex h-[400px] w-[400px] flex-col items-center justify-start overflow-y-auto border-none bg-ac-4 p-2 text-center text-ac-5 shadow-2xl ${
                openNotification ? "block" : "hidden"
              }`}
            >
              <div className="mb-4 flex w-full items-center justify-start gap-2">
                <span className="text-primary-600 text-2xl font-semibold">
                  Notifications
                </span>
              </div>
              hello
            </div>
            {/* )} */}
          </div>
        </div>
        <div className="h-full w-2/6">
          <Menu>
            <MenuButton
              as={Button}
              //   size={"lg"}
              w={"100%"}
              h="50px"
              fontFamily={"body"}
              _hover={{
                bg: "none",
              }}
              //   border={"1px solid red"}
              //   h={"100%"}
              color={"primary.600"}
              bg={"none"}
              rightIcon={<ChevronDownIcon color="ac-5" />}
            >
              <Box
                display="flex"
                justifyContent={"space-around"}
                alignItems="center"
              >
                <FaUser size={22} />

                <Text className="capitalize">
                  {user ? user?.full_name : admin?.full_name}
                </Text>
              </Box>
            </MenuButton>
            <MenuList
              boxShadow={"2xl"}
              pos="relative"
              // bg={"ac-2"}
              color={"primary.600"}
              border={"none"}
              display={"flex"}
              flexDirection={"column"}
              // gap={2}
              px={2}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
              className="bg-ac-4"
            >
              <Heading
                fontSize={"18px"}
                fontWeight={600}
                alignItems={"flex-start"}
                color={"primary.600"}
                my={4}
              >
                Profile Settings
              </Heading>
              {["Account Settings", "Logout"]?.map((item) => (
                <MenuItem
                  borderRadius={"10px"}
                  key={item}
                  bg={clickedItem === item ? "primary.100" : "primary.700"}
                  color={clickedItem === item ? "primary.200" : "primary.600"}
                  onClick={() => handleMenuItemClick(item)}
                  _hover={{ bg: "#96233C", color: "white" }}
                >
                  {item}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
