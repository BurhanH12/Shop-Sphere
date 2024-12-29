"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { TbCertificate } from "react-icons/tb";
import { RiGroupLine } from "react-icons/ri";
import AssessmentDetailDateModal from "./assessmentDetailDateModal";
import { useRouter } from "next/router";

const CardComponent = ({
  title,
  counts,
  countText,
  buttonText,
  asisData,
  validityActive,
  selfOrgButtonText,
}: any) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter();

  return (
    <>
      <div
        className="align-start flex flex-col justify-evenly rounded-lg bg-white p-5 hover:shadow-lg"
        style={{
          height: "100%",
        }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-ac-1">
            {buttonText ? (
              <RiGroupLine color="#fff" size={25} />
            ) : (
              <TbCertificate color="#fff" size={25} />
            )}
          </div>
          <span className="sm: text-md text-sm font-semibold 2xl:text-[17px]">
            {title ? title : ""}
          </span>
        </div>
        <div className="mt-4 flex flex-col items-center justify-between 2xl:flex-row">
          <div className="flex items-center gap-2">
            <p className="text-2xl text-ac-8 2xl:text-3xl">
              {counts ? counts : "0"}
            </p>
            <p className="text-xs font-semibold 2xl:text-[15px]">
              {" "}
              {countText ? countText : ""}
            </p>
          </div>
          {buttonText !== "" && (
            <Button
              // disabled
              variant="link"
              className="bg-transparent text-ac-8"
              onClick={() => setOpenModal(!openModal)}
            >
              {buttonText}
            </Button>
          )}
          {selfOrgButtonText !== "" && (
            <Button
              // disabled
              variant="link"
              className="bg-transparent text-ac-8"
              onClick={() => router.push("/dashboard/candidate-evaluation")}
            >
              {selfOrgButtonText}
            </Button>
          )}
        </div>
      </div>
      <AssessmentDetailDateModal
        setOpenModal={setOpenModal}
        openModal={openModal}
        data={asisData}
        active={validityActive}
      />
    </>
  );
};

export default CardComponent;
