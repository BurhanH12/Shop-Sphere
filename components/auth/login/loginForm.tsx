"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Link from "next/link";
import { useQuery } from "@chakra-ui/react";
import { POST } from "@/server/clientController/auth/auth";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import OtpForm from "../otpForm";
import Loader from "@/components/ui/loader";
import { useAppDispatch } from "@/store/hooks";
import { userAuth, userIsLogin } from "@/store/slices/authSlice";
import { userAdminAuth, userAdminIsLogin } from "@/store/slices/adminAuthSlice";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";

const formSchema = z.object({
  user_name: z.string().email(),
  password: z.string().min(8),
});

const LoginForm = () => {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showpass, setShowpass] = useState(false);
  const [isOTPDialogOpen, setOTPDialogOpen] = useState(false);

  // Define the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: user?.email || "",
      password: "",
    },
  });

  const {
    mutate: loginMutate,
    data: loginData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST("/users/login", values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "Login successful");
      console.log("Login Data", data);
      if (data.type === "otp_verification") {
        setOTPDialogOpen(true);
        return;
      }
      if (data?.user?.Role?.name === "admin") {
        console.log("Admin Ki",data?.user);
        dispatch(userAdminAuth(data?.user));
        window.localStorage.setItem(
          "resource-admin",
          JSON.stringify(data?.user),
        );
        setCookie("admin-token", data.user.referesh_token, { maxAge: 604800 });
        dispatch(userAdminIsLogin(true));
        router.push("/admin");

        return;
      } else {
        if (data?.user?.is_verified) {
          console.log("We are registered");
          dispatch(userAuth(data.user));
          window.localStorage.setItem(
            "resource-user",
            JSON.stringify(data?.user),
          );
          setCookie("auth-token", data.user.referesh_token, { maxAge: 604800 });

          dispatch(userIsLogin(true));
          router.replace("/dashboard");
          return;
        } else if (!data?.user?.is_resgistered) {
          dispatch(userAuth({ email: data.user.email }));
          router.push("/signup");
          return;
        }
      }
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Submit form data
    console.log(form.getValues());
    loginMutate(values);
  }

  return (
    <>
      <Form {...form}>
        <Toaster richColors position="top-right" closeButton />
        <div className="h-[100vh] w-full bg-ac-3 p-20 font-montserrat">
          <div className="flex w-[75%] justify-between">
            <div className="flex flex-row">
              <Link href={"/"} className="flex items-center justify-center">
                <IoIosArrowRoundBack className="h-8 w-8" />
                <p className="font-normal">Back</p>
              </Link>
            </div>
            <p className="font-normal">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-ac-1">
                Sign Up
              </Link>
            </p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center lg:w-[60%]">
            <div className="items-start!important mb-6 w-full space-y-5">
              <h1 className="text-3xl font-semibold text-[#000000]">
                Log in to your account
              </h1>
              <p className="font-montserrat text-sm text-[#363636]">
                Enter your email and password to log in.
              </p>
            </div>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-8"
            >
              <FormField
                control={form.control}
                name="user_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ac-1">Email Address*</FormLabel>
                    <Input
                      placeholder="Enter Email Address"
                      type="email"
                      {...form.register("user_name")}
                      className="rounded-lg border border-ac-1"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
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
                <Link
                  href={"/forgot-password"}
                  className="flex items-end justify-end underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                size={"lg"}
                className="w-full rounded-xl bg-ac-1"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader size={25} loaderText="Please wait" />
                ) : (
                  " Log In"
                )}
              </Button>
            </form>
          </div>
        </div>
      </Form>
      <OtpForm
        path={"login"}
        isOTPDialogOpen={isOTPDialogOpen}
        setOTPDialogOpen={setOTPDialogOpen}
        email={form.getValues("user_name")}
      />
    </>
  );
};

export default LoginForm;
