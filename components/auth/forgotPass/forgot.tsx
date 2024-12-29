"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Toaster, toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/server/clientController/auth/auth";
import OtpForm from "../otpForm";
import { useRouter } from "next/router";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const formSchema = z.object({
  email: z.string().email(),
});

const passFormSchema = z
  .object({
    password: z
      .string()
      .min(8)
      .refine((value) => /[A-Z]/.test(value), {
        // Contains at least one uppercase letter
        message: "Password must contain at least one uppercase letter",
      })
      .refine((value) => /[a-z]/.test(value), {
        // Contains at least one lowercase letter
        message: "Password must contain at least one lowercase letter",
      })
      .refine((value) => /\d/.test(value), {
        // Contains at least one number
        message: "Password must contain at least one number",
      })
      .refine(
        (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), // Contains at least one special character
        {
          message: "Password must contain at least one special character",
        },
      ),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Forgot = () => {
  const router = useRouter();
  const [verified, setVerified] = useState<Boolean>(false);
  const [accessToken, setAccessToken] = useState<String>("");
  const [isOTPDialogOpen, setOTPDialogOpen] = useState<Boolean>(false);
  const [showPass, setshowPass] = useState({
    passField: false,
    confirmPassField: false,
  });

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Define the change password form
  const passForm = useForm<z.infer<typeof passFormSchema>>({
    resolver: zodResolver(passFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Send OTP on email mutation
  const { mutate: otpMutate, isPending } = useMutation({
    mutationFn: (values: any) => POST("/users/send-otp", values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "OTP sent successfully");
      setOTPDialogOpen(true); // Open OTP dialog after successful submission
    },
  });

  // Change password
  const { mutate: changePasswordMutate, isPending: isPassPending } =
    useMutation({
      mutationFn: (values: any) => POST("/users/change-password", values),
      onError: (error: any) => {
        console.log("We Are in Error", error);
        return toast.error(
          error?.message ?? "Network error. Please try again.",
        );
      },
      onSuccess: (data: any) => {
        toast.success(data.message ?? "Password changed successfully");
        setVerified(true);
        window.localStorage.removeItem("access_token");
        router.replace("/login");
      },
    });

  // Send OTP submit
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit form data
    console.log(form.getValues());
    otpMutate(values);
  }

  // Change Pass Submit
  function onPassSubmit(values: z.infer<typeof passFormSchema>) {
    // Submit form data
    const payload = {
      password: values.password,
      confirm_password: values.confirmPassword,
      accessToken: accessToken,
    };
    console.log(passForm.getValues());
    changePasswordMutate(payload);
  }

  useEffect(() => {
    if (router.query.type === "changepassword") {
      setVerified(true);
      setAccessToken(
        JSON.parse(localStorage.getItem("access_token") as string),
      );
    }
  }, [router.query.type]);

  if (verified) {
    return (
      <>
        <Form {...passForm}>
          <Toaster richColors position="top-right" closeButton />
          <div className="h-[100vh] w-full bg-ac-3 p-20 font-montserrat">
            <div className="flex w-[75%] justify-between">
              <div className="flex flex-row">
                <Link
                  href={"/login"}
                  className="flex items-center justify-center"
                >
                  <IoIosArrowRoundBack className="h-8 w-8" />
                  <p className="font-normal">Back</p>
                </Link>
              </div>
            </div>
            <div className="flex h-full w-full flex-col items-center justify-center lg:w-[60%]">
              <div className="items-start!important mb-6 w-full space-y-5">
                <h1 className="text-3xl font-semibold text-[#000000]">
                  Set New Password
                </h1>
                <p className="font-montserrat text-sm text-[#363636]">
                  Set a unique password.
                </p>
              </div>
              <form
                onSubmit={passForm.handleSubmit(onPassSubmit)}
                className="w-full space-y-8"
              >
                <div className="flex flex-col gap-3">
                  <FormField
                    control={passForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1 pb-2">
                        <FormLabel className="text-ac-10">Password</FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Enter Password"
                            type={showPass.passField ? "text" : "password"}
                            {...passForm.register("password")}
                            className="rounded-lg border border-[#363636] pr-10"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setshowPass({
                                ...showPass,
                                passField: !showPass.passField,
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                          >
                            {showPass.passField ? (
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
                <div className="flex flex-col gap-3">
                  <FormField
                    control={passForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1 pb-2">
                        <FormLabel className="text-ac-10">
                          Confirm Password
                        </FormLabel>
                        <div className="relative">
                          <Input
                            placeholder="Enter Password"
                            type={
                              showPass.confirmPassField ? "text" : "password"
                            }
                            {...passForm.register("confirmPassword")}
                            className="rounded-lg border border-[#363636] pr-10"
                          />
                          <Button
                            type="button"
                            onClick={() =>
                              setshowPass({
                                ...showPass,
                                confirmPassField: !showPass.confirmPassField,
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 transform bg-transparent hover:bg-transparent"
                          >
                            {showPass.confirmPassField ? (
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
                <div className="my-4">
                  <Button
                    size={"lg"}
                    className="w-full rounded-xl bg-ac-1"
                    type="submit"
                    disabled={isPassPending}
                  >
                    {isPassPending ? (
                      <Loader size={25} loaderText="Please wait" />
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Form>
      </>
    );
  }

  return (
    <>
      <Form {...form}>
        <Toaster richColors position="top-right" closeButton />
        <div className="h-[100vh] w-full bg-ac-3 p-20 font-montserrat">
          <div className="flex w-[75%] justify-between">
            <div className="flex flex-row">
              <Link
                href={"/login"}
                className="flex items-center justify-center"
              >
                <IoIosArrowRoundBack className="h-8 w-8" />
                <p className="font-normal">Back</p>
              </Link>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center lg:w-[60%]">
            <div className="items-start!important mb-6 w-full space-y-5">
              <h1 className="text-3xl font-semibold text-[#000000]">
                Forgot Password?
              </h1>
              <p className="font-montserrat text-sm text-[#363636]">
                Please enter your email to receive a verification code
              </p>
            </div>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ac-1">Email Address*</FormLabel>
                    <Input
                      placeholder="Enter Email Address"
                      type="email"
                      {...form.register("email")}
                      className="rounded-lg border border-ac-1"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                size={"lg"}
                className="w-full rounded-xl bg-ac-1"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={25} loaderText="Please wait" />
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </div>
        </div>
      </Form>
      <OtpForm
        path={"changepassword"}
        isOTPDialogOpen={isOTPDialogOpen}
        setOTPDialogOpen={setOTPDialogOpen}
        email={form.getValues("email")}
      />
    </>
  );
};

export default Forgot;
