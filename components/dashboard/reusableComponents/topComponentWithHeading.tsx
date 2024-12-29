import React from "react";

const TopComponentWithHeading = ({ title, description }: any) => {
  return (
    <div className="flex w-full items-center justify-between pl-[20px]">
      <div className="flex flex-col items-start gap-1">
        <div className="flex w-full items-center justify-start gap-2">
          {/* <img
        src="/Dashboard/BackArrow.png"
        alt="logo"
        className="w-[35px] h-[20px] cursor-pointer"
      /> */}
          {/* --------------------------------------old title handling---------------------------------------------------- */}
          {/* <span className="mb-[-0.25rem] text-[25px] font-medium text-ac-5">
            {title ? title : "My Dashboard"}
          </span> */}
          {/* -------------------------------old title handling---------------------------------------------------- */}
          <span
            className="mb-[-0.25rem] text-[25px] font-medium text-ac-5"
            dangerouslySetInnerHTML={{ __html: title ? title : "My Dashboard" }}
          ></span>
        </div>
        {/* --------heading description----------- */}
        {/* <span className=" text-primary-400 font-normal text-[13px]">
          {description
            ? description
            : "Here is the latest details...Check Now!"}
        </span> */}
        {/* --------heading description----------- */}
      </div>
      <div className="flex justify-end gap-2">
        {/* <button className="border border-primary-1000 w-[100px] text-primary-400 bg-transparent py-1 px-2">
          Edit
        </button>
        <button className="border border-primary-1000 text-primary-400 bg-transparent py-1 px-2">
          Button Text Placeholder
        </button> */}
      </div>
    </div>
  );
};

export default TopComponentWithHeading;
