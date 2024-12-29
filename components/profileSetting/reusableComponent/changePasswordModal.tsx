import React, { useState } from "react";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../../ui/input";
import { Toaster, toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { POST, PUT } from "@/server/clientController/auth/auth";
import { useRouter } from "next/router";
import Loader from "@/components/ui/loader";
// import { Input } from '@chakra-ui/react';

const formSchema = z.object({
  old_password: z.string().min(8),
  password: z.string().min(8),
  confirm_password: z.string().min(8),
});

const ChangePasswordModal = ({ isOpen, onOpenChange }: any) => {
  const router = useRouter();
  const [showpass, setShowpass] = useState(false);
  const [showpass3, setShowpass3] = useState(false);
  const [showpass2, setShowpass2] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      password: "",
      confirm_password: "",
    },
  });

  // --------------------------MUTATION FUNCTION-----------------------------------//
  const { mutate: changePasswordMutate, isPending: isPassPending } =
    useMutation({
      mutationFn: (values: any) => PUT("/users/update", values),
      onError: (error: any) => {
        console.log("We Are in Error", error);
        onOpenChange();
        return toast.error(
          error?.message ?? "Network error. Please try again.",
        );
      },
      onSuccess: (data: any) => {
        toast.success(data.message ?? "Password changed successfully");
        // setVerified(true);
        window.localStorage.removeItem("access_token");
        form.reset();
        onOpenChange();
        // router.replace("/login");
      },
    });
  // --------------------------MUTATION FUNCTION-----------------------------------//

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      new_password: values.password,
      confirm_password: values.confirm_password,
      old_password: values.old_password,
      type: "password",
    };
    changePasswordMutate(payload);
    // console.log(form.getValues());
    // console.log(values,'values')
    // loginMutate(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <Form {...form}>
              <div className="flex w-[100%] flex-col items-center justify-center gap-2">
                <p className="text-[18px] font-semibold text-ac-8">
                  Change Password
                </p>
                <p className="text-[12px]">Set a Unique password to login</p>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-8"
                >
                  <div className="flex flex-col gap-3">
                    {/* ---------------------------- */}
                    <FormField
                      control={form.control}
                      name="old_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#363636]">
                            Old Password*
                          </FormLabel>
                          <div className="relative">
                            <Input
                              placeholder="Enter Password"
                              type={showpass3 ? "text" : "password"}
                              {...form.register("old_password")}
                              className="rounded-lg border border-ac-1 pr-10"
                            />
                            <Button
                              type="button"
                              onClick={() => setShowpass3(!showpass3)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                            >
                              {showpass3 ? (
                                <BsEyeSlash color={"#363636"} />
                              ) : (
                                <BsEye color={"#363636"} />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* ---------------------------- */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#363636]">
                            Password*
                          </FormLabel>
                          <div className="relative">
                            <Input
                              placeholder="Enter Password"
                              type={showpass ? "text" : "password"}
                              {...form.register("password")}
                              className="rounded-lg border border-ac-1 pr-10"
                            />
                            <Button
                              type="button"
                              onClick={() => setShowpass(!showpass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                            >
                              {showpass ? (
                                <BsEyeSlash color={"#363636"} />
                              ) : (
                                <BsEye color={"#363636"} />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[#363636]">
                            Confirm Password*
                          </FormLabel>
                          <div className="relative">
                            <Input
                              placeholder="Enter Password"
                              type={showpass2 ? "text" : "password"}
                              {...form.register("confirm_password")}
                              className="rounded-lg border border-ac-1 pr-10"
                            />
                            <Button
                              type="button"
                              onClick={() => setShowpass2(!showpass2)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                            >
                              {showpass2 ? (
                                <BsEyeSlash color={"#363636"} />
                              ) : (
                                <BsEye color={"#363636"} />
                              )}
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className={`w-[100%] bg-ac-1 text-ac-2`}
                  >
                    {isPassPending ? (
                      <Loader size={25} loaderText="Please wait" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </form>
              </div>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
