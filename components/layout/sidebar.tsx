import React, { useEffect, useState } from "react";
// import { Box, Image, Text, VStack, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { userAuth } from "@/store/slices/authSlice";

export const sideNavButtons = [
  {
    label: "Home",
    path: "/dashboard",
    icon1: "/homeIcon.png", // Blank for now
    icon2: "/homeIcon2.png", // Blank for now
  },
  {
    label: "Settings",
    path: "/dashboard/setting",
    icon1: "/settingIcon.png", // Blank for now
    icon2: "/settingIcon2.png", // Blank for now
  },

  {
    label: "Help & Support",
    path: "/dashboard/support",
    icon1: "/helpIcon.png", // Blank for now
    icon2: "/helpIcon2.png", // Blank for now
  },
];

interface SidebarProps {
  setActiveRoute: React.Dispatch<React.SetStateAction<number | null>>;
  handleActiveRoute: (index: number) => void;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { user: admin } = useAppSelector((state) => state.adminAuth);
  // const sideButtonsData = user?.RoleType?.RolePermsions;
  const sideButtonsData = [
    ...(user?.RoleType?.RolePermsions || admin?.RoleType?.RolePermsions || []),
  ].sort((a: any, b: any) => {
    return a?.Resources?.priority - b?.Resources?.priority;
  });
  const pathName = usePathname();
  const [navList, setNavList] = useState(sideButtonsData);
  const [activeItem, setActiveItem] = useState<any>(pathName);

  const handleItemClick = (index: number, path: string) => {
    console.log(path, "pathCheck");
    // setActiveItem(pathName === path ? " " : index); // Toggle active item
    router.push(path); // Navigate to the clicked path
  };

  return (
    <div
      className="h-full w-full overflow-y-auto p-2 pt-4"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex w-full cursor-pointer items-center justify-center gap-3 pl-4">
        <Image
          src="/logo.png"
          width={180}
          height={130}
          className="h-[57px] w-[60%]"
          alt="logo"
        />
      </div>

      <div className="mt-10 flex flex-col space-y-3 pl-4">
        {sideButtonsData?.map((button: any, index: number) => (
          <div
            // style={{border:'1px solid red'}}
            key={index}
            className={`flex w-full cursor-pointer items-center rounded-md px-3 text-left ${
              button?.Resources?.path === activeItem ? "bg-ac-1" : "bg-ac-4"
            }`}
            onClick={() => handleItemClick(index, button?.Resources?.path)}
          >
            <Image
              src={
                button?.Resources?.path === activeItem
                  ? button?.Resources?.icon2
                  : button?.Resources?.icon1
              }
              alt="icon"
              width={20}
              height={20}
              className="mr-3"
            />
            <button
              // style={{border:'1px solid green'}}
              className={`flex w-full justify-start rounded-md p-2 pl-1 text-left text-sm font-medium 2xl:text-sm ${
                button?.Resources?.path === activeItem
                  ? "bg-primary-100 text-ac-3"
                  : "bg-primary-800 text-ac-5"
              }`}
            >
              {button?.Resources?.label}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
