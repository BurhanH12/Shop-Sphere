"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { POST } from "@/server/clientController/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import Loader from "../ui/loader";
import { setCookie } from "cookies-next";
import { useAppDispatch } from "@/store/hooks";
import { userAuth, userIsLogin } from "@/store/slices/authSlice";

const otpFormSchema = z.object({
  otp: z.string().min(4).max(4),
});

const OtpForm = ({ path, isOTPDialogOpen, setOTPDialogOpen, email }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const watchedOtp = otpForm.watch("otp");

  const {
    mutate: otpMutate,
    data: otpData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST(`/users/verify`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "OTP verified successfully");
      otpForm.reset();
      if (data?.type === "password-change") {
        window.localStorage.setItem(
          "access_token",
          JSON.stringify(data?.token),
        );
        setOTPDialogOpen(false);
        router.replace({
          pathname: "/forgot-password",
          query: { type: "changepassword" },
        });
        return;
      } else if (data.type === "login") {
        window.localStorage.setItem(
          "resource-user",
          JSON.stringify(data?.user),
        );
        setCookie("auth-token", data.user.referesh_token, { maxAge: 604800 });
        dispatch(userAuth(data.user));
        dispatch(userIsLogin(true));
        setOTPDialogOpen(false);
        router.push("/dashboard");
      }
    },
  });

  // OTP form submit handler
  function onOTPSubmit(values: z.infer<typeof otpFormSchema>) {
    console.log("OTP Form Values: ", values);
    let payload = {
      type: "registration",
      otp: values.otp,
      email: email,
    };
    if (path === "changepassword") {
      payload.type = "pass-change";
    }
    otpMutate(payload);
  }

  function handleClose() {
    if (path === "signUp") {
      setOTPDialogOpen(false);
      router.push("/login");
    } else {
      setOTPDialogOpen(false);
    }
  }

  useEffect(() => {
    if (watchedOtp.length === 4) {
      otpForm.handleSubmit(onOTPSubmit)();
    }
  }, [watchedOtp]);

  return (
    <div>
      {/* OTP Dialog */}
      <Dialog open={isOTPDialogOpen} onOpenChange={setOTPDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="items-center">
            <DialogTitle>Verification</DialogTitle>
            <DialogDescription>
              Please enter the one-time password sent to your email.
            </DialogDescription>
          </DialogHeader>
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
              className="space-y-6"
            >
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center gap-4">
                    <FormLabel>One-Time Password</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={4} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    {/* <FormDescription>
                      Please enter the one-time password sent to your email.
                    </FormDescription> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  size={"sm"}
                  className="w-full rounded-xl bg-ac-1"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader size={20} loaderText="Please wait" />
                  ) : (
                    " Verify"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OtpForm;
