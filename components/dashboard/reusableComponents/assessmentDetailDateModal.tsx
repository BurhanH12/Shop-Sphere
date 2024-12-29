import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/helper";

const AssessmentDetailDateModal = ({
  openModal,
  setOpenModal,
  data,
  active,
}: any) => {
  console.log(data, "data on board");
  const router = useRouter();
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent className="w-[390px] font-montserrat">
        <DialogHeader>
          <DialogDescription>
            <div className="flex w-[100%] flex-col items-center justify-center gap-4">
              {/* <p className="text-[18px] font-semibold text-ac-8">Congrats</p> */}
              {data?.psp && (
                <p className="text-center text-[15px] font-semibold text-ac-8">
                  Your First Assessment Date:{" "}
                  {/* {data?.psp?.createdAt?.slice(0, 10)} */}
                  {formatDate(String(data?.psp?.createdAt).split("T")[0])}{" "}
                </p>
              )}
              <div className="flex flex-col gap-2">
                <p>
                  Access Valid Until:{" "}
                  {formatDate(String(data?.last_date).split("T")[0])}
                </p>
                <p> Access Days Left: {data?.daysLeft} Days Remaining</p>
              </div>
              {/* <p className="text-center">
                {data?.daysLeft} {"   "}days remaining to complete the
                assessment, access available till{" "}
                {formatDate(String(data?.last_date).split("T")[0])}{" "}
              </p> */}
              <button
                disabled={active ? false : true}
                onClick={() => router.push("/dashboard/assessment")}
                className={`w-[220px] rounded ${active ? "cursor-pointer bg-ac-1" : "cursor-not-allowed bg-ac-7"} px-4 py-2 text-[14px] font-semibold text-white`}
              >
                Start Assessment
              </button>
              {/* <Button className="bg-ac-1">Start Assessment</Button> */}
              {/* <Button
                // disabled={isPending}
                className={`w-[90%] bg-ac-1 text-ac-2 hover:bg-ac-1 hover:text-ac-4 ${
                  active
                    ? "bg-ac-1 text-ac-4"
                    : "border border-black bg-ac-4 text-ac-1"
                } `}
                onClick={handleSubmit}
              >
                {isPending ? (
                  <Loader size={20} loaderText="Please wait" />
                ) : (
                  " Gap Analysis"
                )}
              </Button> */}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentDetailDateModal;
