import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/server/clientController/auth/auth";
import { Toaster, toast } from "sonner";
import Loader from "../ui/loader";

const supportSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
});

const OneModal = ({ path, setPath, isDialogOpen, setDialogOpen }: any) => {
  const router = useRouter();
  const [openError, setOpenError] = useState(false);
  const [openRequest, setopenRequest] = useState(false);
  const supportForm = useForm<z.infer<typeof supportSchema>>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  });

  const {
    mutate: feedbackMutate,
    data: feedbackData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST(`/home/query`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      if (error?.message === "Your Query is  already  Submitted!") {
        setopenRequest(true);
      }
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: () => {
      // setDialogOpen(false);
      setOpenError(true);
      // router.push("/login");
    },
  });

  function onSupportSubmit(values: z.infer<typeof supportSchema>) {
    console.log(values);
    feedbackMutate(values);
  }

  if (openError) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader className="items-center">
            <div className="flex w-[100%] flex-col items-center justify-center gap-2">
              <p className="text-[18px] font-semibold text-ac-8">Great!</p>
            </div>
            <DialogDescription>
              <p className="text-center text-[12px]">
                Your request has been sent to the administrator, we’ll review
                and get back to you.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size={"lg"}
              className="w-full rounded-md bg-ac-1"
              onClick={() => router.push("/")}
            >
              View Homepage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (openRequest) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="items-center">
            <div className="flex w-[100%] flex-col items-center justify-center gap-2">
              <p className="text-[18px] font-semibold text-ac-8">
                Error Found!
              </p>
            </div>
            <DialogDescription>
              <p className="text-center text-[12px]">
                You have already submitted your support ticket. We will review
                it and get back to you shortly.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              size={"lg"}
              className="w-full rounded-md bg-ac-1"
              onClick={() => router.push("/")}
            >
              View Homepage
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (path === "error") {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader className="items-center">
            <DialogTitle>Contact System Support</DialogTitle>
            <DialogDescription>
              Please explain your issue below
            </DialogDescription>
          </DialogHeader>
          <Form {...supportForm}>
            <form
              onSubmit={supportForm.handleSubmit(onSupportSubmit)}
              className="space-y-6"
            >
              <FormField
                control={supportForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1 pb-2">
                    <FormLabel className="text-ac-10">Email Address</FormLabel>
                    <Input
                      placeholder="Enter Email Address"
                      type="email"
                      {...supportForm.register("email")}
                      className="rounded-lg border border-[#363636]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={supportForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="space-y-1 pb-2">
                    <FormLabel className="text-ac-10">Subject</FormLabel>
                    <Input
                      placeholder="Enter Subject"
                      type="text"
                      {...supportForm.register("subject")}
                      className="rounded-lg border border-[#363636]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={supportForm.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="space-y-1 pb-2">
                    <FormLabel className="text-ac-10">
                      Describe your issue
                    </FormLabel>
                    {/* <Input
                      placeholder="Enter here"
                      type="text"
                      {...form.register("description")}
                      className="h-[110px] rounded-lg border border-[#363636]"
                    /> */}
                    <Textarea
                      _focusVisible={{ border: "2px solid black" }}
                      border={"1px solid #363636"}
                      rounded={"lg"}
                      height={"110px"}
                      placeholder="Enter here"
                      {...supportForm.register("body")}
                      fontSize={"13px"}
                      style={{ resize: "none" }}
                      bg={"#ffff"}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size={"lg"}
                className="w-full rounded-md bg-ac-1"
              >
                {isPending ? (
                  <Loader size={25} loaderText="Please wait" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center">
          <div className="flex w-[100%] flex-col items-center justify-center gap-2">
            <p className="text-[18px] font-semibold text-ac-8">
              Congratulations!
            </p>
          </div>
          <DialogDescription>
            <p className="text-center text-[12px]">
              Your verification has been done
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            size={"lg"}
            className="w-full rounded-md bg-ac-1"
            onClick={() => router.push("/login")}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OneModal;
