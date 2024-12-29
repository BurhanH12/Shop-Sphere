import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RxCross1 } from "react-icons/rx";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
const SubmitQueryModal = ({ isOpen, onOpenChange }: any) => {
  const router = useRouter();
  const handleClose = () => {
    onOpenChange(false); // Close the dialog
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[380px] font-montserrat" is_close={false}>
        <DialogHeader>
          {/* <div className="flex w-[100%] flex-col items-center justify-center gap-2"> */}
          {/* <p className=" text-center text-[18px] font-semibold text-ac-8">
            Done
          </p> */}
          {/* </div> */}
          <button onClick={handleClose} className="absolute right-2 top-2">
            <RxCross1 />
          </button>
        </DialogHeader>
        <DialogDescription>
          <p className="py-2 text-center text-[18px] font-semibold text-ac-8">
            Done
          </p>
          <p className="text-center text-[12px]">
            Your query has been successfully submitted.
          </p>
        </DialogDescription>
        <DialogFooter>
          <Button
            size={"sm"}
            bg={"#96233C"}
            color={"#fff"}
            width={"full"}
            onClick={() => router.back()}
          >
            View Query
          </Button>
          {/* <Button
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
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitQueryModal;
