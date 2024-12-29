import React from "react";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import logoBanner from "../../../public/placeholders/logoBannerlast.png";

const LeftSide = () => {
  return (
    <div className="hidden bg-white lg:block overflow-hidden">
      <div className="mt-14 flex w-full flex-col gap-5">
        <div className="flex items-center justify-center">
          <Image src={Logo} alt="Logo Imgage" width={180} height={130} />
        </div>
        <div className="flex items-center justify-center font-montserrat">
          <div className="flex flex-col">
            <div className="flex">
              <div className="rounded-bl-lg rounded-tl-lg rounded-tr-lg bg-ac-1 px-6 py-2 text-white">
                Simple
              </div>
              <div className="flex items-center justify-center rounded-t-lg border border-black bg-white px-6 py-2 text-black">
                &
              </div>
              <div className="rounded-br-lg rounded-tl-lg rounded-tr-lg border border-black bg-white px-6 py-2 text-black">
                Powerful
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-l-lg border border-black bg-white px-6 py-2 text-black">
                Hire Faster
              </div>
              <div className="rounded-r-lg bg-ac-1 px-6 py-2 text-white">
                Powerful
              </div>
            </div>
          </div>
        </div>
        <div className="items-start pr-8 pt-10">
          <Image
            src={logoBanner}
            alt="Logo Banner"
            height={560}
            width={843} // Set the maximum width that the image could have
            priority={true}
            placeholder="blur"
            className="w-[430px] sm:w-[843px]"
          />
        </div>
      </div>
    </div>
  );
};

export default LeftSide;
