import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RemoveAccountModal = ({ isOpen, onOpenChange }: any) => {
  const [active, setActive] = useState<string>("");
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent style={{ border: "1px solid red" }} className="w-[380px]">
        <DialogHeader>
          <DialogDescription>
            <div className="flex w-[100%] flex-col items-center justify-center gap-2">
              <p className="text-[18px] font-semibold text-ac-8">
                Remove Account modal
              </p>
              <p className="text-[12px]">You Want to delete your account </p>
              <Button
                className={`w-[90%] bg-ac-1 text-ac-2 ${
                  active === "yes"
                    ? "bg-ac-1 text-ac-4"
                    : "border border-black bg-ac-4 text-ac-1"
                } `}
                onClick={() => setActive("yes")}
              >
                Yes Delete
              </Button>
              <Button
                className={`w-[90%] bg-ac-1 text-ac-2 ${
                  active === "no"
                    ? "bg-ac-1 text-ac-4"
                    : "border border-black bg-ac-4 text-ac-1"
                } `}
                style={{ border: "1px solid black" }}
                onClick={() => setActive("no")}
              >
                {" "}
                No
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveAccountModal;
