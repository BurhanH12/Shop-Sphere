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
import Loader from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const CongratsModal = ({ isOpen, onOpenChange, id, isPending }: any) => {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const handleSubmit = () => {
    setActive(true);
    onOpenChange(false);
    router.push({
      pathname: `/dashboard/analysis/${id}`,
      // query: { id }  // Sending navId as a query parameter
    });
  };
  // isPending
  const handleClose = () => {
    onOpenChange(false); // Close the dialog
    router.push("/dashboard"); // Navigate to the dashboard
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[380px] font-montserrat" is_close={false}>
        <DialogHeader>
          <div className="flex w-[100%] flex-col items-center justify-center gap-2">
            <p className="text-[18px] font-semibold text-ac-8">
              Congratulations!
            </p>
          </div>
        </DialogHeader>
        <DialogDescription>
          <p className="text-center text-[12px]">
            Your Assessment has been successfully completed. Click on the{" "}
            <span className="font-semibold">GAP Analysis</span> to view your
            Report.{" "}
          </p>
        </DialogDescription>
        <DialogFooter>
          <Button
            disabled={isPending}
            size={"lg"}
            className="w-full rounded-md bg-ac-1"
            onClick={handleSubmit}
          >
            {isPending ? (
              <Loader size={25} loaderText="Please wait" />
            ) : (
              "Gap Analysis"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CongratsModal;
