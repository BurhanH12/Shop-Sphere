import React, { ReactNode, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getCookie } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import { userAuth } from "@/store/slices/authSlice";
import { userAdminAuth } from "@/store/slices/adminAuthSlice";
import { usePathname } from "next/navigation";
import SeoHead from "./seoHead";

export default function Layout({
  children,
  page,
}: {
  children: React.ReactNode;
  page: string;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { user: admin } = useAppSelector((state) => state.adminAuth);
  const token = getCookie("auth-token");
  const adminToken = getCookie("admin-token");
  const currentPath = usePathname();
  const locationUser: string | null =
    typeof window !== "undefined"
      ? window.localStorage.getItem("resource-user") ||
        window.localStorage.getItem("resource-admin")
      : null;

  const { data: userData, isFetched } = useQuery({
    queryKey: ["userData"],
    queryFn: () => GET(`/users/profile`),
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !locationUser && !(user || admin) && Boolean(token || adminToken),
  });

  useEffect(() => {
    if (currentPath?.startsWith("/admin")) {
      console.log("Condition true", admin);
      if (!admin && !locationUser && isFetched && userData) {
        dispatch(userAdminAuth(userData?.data?.user));
      } else if (!admin && locationUser) {
        const parsedUser = JSON.parse(locationUser);
        dispatch(userAdminAuth(parsedUser));
        return;
      } else if (!admin && !locationUser && adminToken) {
        console.log("profile again", adminToken);
        const fetchUserData = async () => {
          const response = await GET(`/users/profile`);
          dispatch(userAdminAuth(response.data?.user));
        };
        fetchUserData();
        return;
      }
    } else {
      if (!user && !locationUser && isFetched && userData) {
        dispatch(userAuth(userData?.data?.user));
      } else if (!user && locationUser) {
        const parsedUser = JSON.parse(locationUser);
        dispatch(userAuth(parsedUser));
        return;
      } else if (!user && !locationUser && token) {
        console.log("profile again", token);
        const fetchUserData = async () => {
          const response = await GET(`/users/profile`);
          dispatch(userAuth(response.data?.user));
        };
        fetchUserData();
        return;
      }
    }
  }, [
    admin,
    adminToken,
    currentPath,
    dispatch,
    isFetched,
    locationUser,
    token,
    user,
    userData,
  ]);

  return (
    <>
      <SeoHead
        title={page}
        domain_name={"resourcehub"}
        cononcial_url={"resourcehub.com"}
      />
      <Box w="100%" h="100vh" display="flex" className="font-montserrat">
        <Box w="320px" h="100%">
          <Sidebar />
        </Box>
        <Box w="100%">
          <Topbar />
          <div
            className="w-full rounded-tl-2xl bg-ac-3 p-3 shadow-md"
            style={{
              height: "calc(100% - 78px)",
              overflowY: "auto",
            }}
          >
            {/* <Box
            // borderTopLeftRadius="25px"
            h="100%"
            w="100%"
            // border={"1px solid green"}
            display="flex"
            justifyContent="center"
            alignItems="center"
          > */}
            {children}
            {/* </Box> */}
          </div>
        </Box>
      </Box>
    </>
  );
}
