import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { POST } from "@/server/clientController/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import CongratsModal from "./congratsModal";
import Loader from "@/components/ui/loader";

const SubmissionModal = ({
  isOpen,
  onOpenChange,
  dataAssessment,
  setIndexNumber,
  setFormState,
}: any) => {
  console.log({ dataAssessment });
  const [active, setActive] = useState();
  const [congratsSubmit, setCongratsSubmit] = useState(false);

  const router = useRouter();

  const handleEdit = (val: any) => {
    setActive(val);
    console.log(val, "value");
    setFormState(dataAssessment?.expected[0]?.PspSkill);
    setIndexNumber(0);
    onOpenChange(false);
    // window.location.reload();
  };

  // -----------------------------------
  const {
    mutate: assessmentMutate,
    data: assessmentData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST("/psps", values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      router.push("/dashboard");
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "Assement Submitted");
      console.log("Login Data", data);
      localStorage.removeItem("candidate-data");
    },
  });
  // -----------------------------------

  console.log({ assessmentData });

  const handleSubmit = (val: any) => {
    setActive(val);
    console.log({ dataAssessment });
    onOpenChange(false);
    setCongratsSubmit(true);
    assessmentMutate(dataAssessment);
    console.log(val, "value");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="w-[480px] font-montserrat" is_close={false}>
          <p className="text-center text-[18px] font-semibold text-ac-8">
            Are you sure you want to submit your Assessment?
          </p>
          <div className="flex w-[100%] items-center justify-center gap-2">
            <Button
              size={"lg"}
              className="w-full rounded-md bg-ac-1"
              onClick={() => handleSubmit("yes")}
            >
              {isPending ? (
                <Loader size={20} loaderText="Please wait" />
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              disabled={isPending}
              size={"lg"}
              className="w-full rounded-md border border-black bg-ac-1 bg-ac-4 text-ac-1 hover:border-none hover:bg-ac-1 hover:text-ac-4"
              onClick={() => handleEdit("no")}
            >
              {" "}
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <CongratsModal
        isPending={isPending}
        isOpen={congratsSubmit}
        id={assessmentData?.data?.id}
        onOpenChange={setCongratsSubmit}
      />
    </>
  );
};

export default SubmissionModal;
