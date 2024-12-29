"use client";

import { useState } from "react";
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Link from "next/link";
import {
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET, POST } from "@/server/clientController/auth/auth";
import { Country, City } from "country-state-city";
import { Toaster, toast } from "sonner";
import OtpForm from "../otpForm";
import { useAppSelector } from "@/store/hooks";
import Error from "@/pages/error";
import Loader from "@/components/ui/loader";
import { useRouter } from "next/router";
import { formatNIC } from "@/utils/helper";

// Main form schema
const formSchema = z
  .object({
    full_name: z
      .string()
      .min(3, { message: "Name must contain atleast 3 letters." })
      .max(35),
    email: z.string().email(),
    number: z.string().min(3),
    gender: z.enum(["male", "female", "other"]),
    nic: z
      .string()
      .min(13, { message: "NIC must be 13 characters long" })
      .max(15),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
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
    confirm_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    country: z.string().min(1, { message: "Country is required" }),
    city: z.string().min(1, { message: "City is required" }),
    industry_id: z.string().min(1, { message: "Industry is required" }),
    department_id: z.string().min(1, { message: "Department is required" }),
    role_id: z.string().min(1, { message: "Role is required" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

const steps = [{ title: "Step 1" }, { title: "Step 2" }];

const SelfSignup = () => {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [showPass, setshowPass] = useState({
    passField: false,
    confirmPassField: false,
  });
  const [isOTPDialogOpen, setOTPDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      number: "",
      gender: "male",
      password: "",
      confirm_password: "",
      country: "",
      city: "",
      industry_id: "",
      department_id: "",
      role_id: "",
    },
  });

  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: rolesData,
    refetch,
  } = useQuery({
    queryKey: [`roles`],
    queryFn: () => GET("/users/roles"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });

  const countryData = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    displayValue: `${country.name} - ${country.isoCode}`,
  }));

  const cityData = form.watch("country")
    ? City.getCitiesOfCountry(form?.getValues("country")?.split("-")[1]?.trim())
        ?.filter(
          (city, index, self) =>
            self.findIndex((c) => c.name === city.name) === index &&
            city.name !== "Shorkot",
        )
        ?.map((city, index) => ({
          value: city.name,
          displayValue: city.name,
          uniqueKey: `${form.getValues("country")}-${city.name}-${index}`,
        }))
    : [];

  const departmentData = form.watch("industry_id")
    ? rolesData?.data?.department?.filter(
        (depart: any) => depart?.industry_id === form.getValues("industry_id"),
      )
    : [];

  const roleData = form.watch("department_id")
    ? rolesData?.data?.roles?.filter(
        (role: any) => role.department_id === form.getValues("department_id"),
      )
    : [];

  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const {
    mutate: signupMutate,
    data: signupData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST("/users/register", values),
    onError: (error: any) => {
      if (error?.message === "Please select a plan to proceed further") {
        console.log(error);
        toast.error(error?.message ?? "Network error. Please try again.");
        // Redirect to payment gateway
        router.push("/plans");
        return;
      }
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setOTPDialogOpen(true); // Open OTP dialog after successful submission
    },
  });

  // Main form submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Main Form Values: ");
    await form
      .trigger([
        "full_name",
        "email",
        "number",
        "gender",
        "password",
        "confirm_password",
        "nic",
      ])
      .then((isValid) => {
        if (isValid) {
          goToNext();
          form.clearErrors();
        }
      });
    // goToNext();
  }

  // Second step form submit handler
  function onSecondStepSubmit(values: z.infer<typeof formSchema>) {
    console.log("Second Step Form Values: ", values);
    if (form.formState.errors) {
      signupMutate(values);
    } else {
      toast.error("Form is not valid");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }
  if (isError) {
    <div>
      <Error error={error} reset={refetch} />
    </div>;
  }

  return (
    <div className="h-auto w-full overflow-y-auto bg-[#F3F3F3] pb-0 pl-20 pr-20 pt-20 font-montserrat">
      <Toaster richColors position="top-right" closeButton />
      <div className="higths max-h-[754px!important] 2xl:max-h-[830px!important]">
        <div
          className={`flex items-center ${
            activeStep === 1 ? "justify-between" : "justify-end"
          } mb-10`}
        >
          {activeStep === 1 && (
            <div className="flex flex-row">
              <Button
                variant="ghost"
                onClick={goToPrevious}
                className="flex items-center justify-center hover:bg-none"
              >
                <IoIosArrowRoundBack className="h-8 w-8" />
                <p className="text-lg font-normal">Back</p>
              </Button>
            </div>
          )}
          <p className="font-normal">
            Already have an account?{" "}
            <Link href="/login" className="text-ac-1">
              Log In
            </Link>
          </p>
        </div>
        <div className="flex h-fit w-full items-center justify-between bg-gray-100 p-4">
          <p className="font-normal text-ac-1">{steps[activeStep].title}</p>
          <div className="flex flex-row items-center space-x-4">
            <Stepper size="md" index={activeStep}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator
                    borderColor={"#96233C !important"}
                    bg={
                      index === activeStep
                        ? "#96233C !important"
                        : "transparent"
                    }
                    color={index === activeStep ? "#FFF" : "#96233C"}
                    borderWidth="2px" // Uniform border width
                    boxShadow="none" //
                  >
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  {index < steps.length - 1 && (
                    <StepSeparator
                      style={{
                        width: "100%",
                        margin: 0,
                        padding: 0,
                        backgroundColor: "#96233C",
                      }}
                    />
                  )}
                </Step>
              ))}
            </Stepper>
          </div>
        </div>
        <div className="flex h-fit w-full flex-col items-center justify-center lg:h-auto lg:w-[60%]">
          <div className="items-start!important mb-6 w-full space-y-5">
            <h1 className="text-3xl font-semibold text-[#000000]">
              Sign up to create an account
            </h1>
            <p className="text-sm text-ac-10">
              Please enter your details to create an account.
            </p>
          </div>
          {/* All Forms */}
          <div className="w-full">
            {/* Main Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  activeStep === 0 ? onSubmit : onSecondStepSubmit,
                )}
                className="w-full space-y-8"
              >
                {/* First Form */}
                {activeStep === 0 && (
                  <div>
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            Full Name
                          </FormLabel>
                          <Input
                            placeholder="Enter Full Name"
                            type="text"
                            {...form.register("full_name")}
                            className="rounded-lg border border-[#363636]"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            Email Address
                          </FormLabel>
                          <Input
                            placeholder="Enter Email Address"
                            type="email"
                            {...form.register("email")}
                            className="rounded-lg border border-[#363636]"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            Phone Number
                          </FormLabel>
                          <PhoneInput
                            className="sm rounded-md border border-[#363636]"
                            defaultCountry="pk"
                            inputStyle={{ width: "100%" }}
                            value={form.getValues("number")}
                            onChange={field.onChange}
                            inputClassName="custom-phone-input"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-md border border-[#363636]">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border border-[#363636]">
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">
                                Prefer not to disclose
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nic"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            National ID Card Number
                          </FormLabel>
                          <Input
                            name="nic"
                            placeholder="Enter NIC"
                            type="text"
                            onChange={(e) => formatNIC(e, form)}
                            value={form.getValues("nic")}
                            // {...form.register("nic")}
                            className="rounded-lg border border-[#363636]"
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
                          <FormItem className="space-y-1 pb-2">
                            <FormLabel className="text-ac-10">
                              Password
                            </FormLabel>
                            <div className="relative">
                              <Input
                                placeholder="Enter Password"
                                type={showPass.passField ? "text" : "password"}
                                {...form.register("password")}
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
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                          <FormItem className="space-y-1 pb-2">
                            <FormLabel className="text-ac-10">
                              Confirm Password
                            </FormLabel>
                            <div className="relative">
                              <Input
                                placeholder="Enter Password"
                                type={
                                  showPass.confirmPassField
                                    ? "text"
                                    : "password"
                                }
                                {...form.register("confirm_password")}
                                className="rounded-lg border border-[#363636] pr-10"
                              />
                              <Button
                                type="button"
                                onClick={() =>
                                  setshowPass({
                                    ...showPass,
                                    confirmPassField:
                                      !showPass.confirmPassField,
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
                        onClick={(event) => onSubmit(form.getValues())}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                {/* Second Form */}
                {activeStep === 1 && (
                  <div>
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryData.map((country, index) => (
                                <SelectItem
                                  key={index}
                                  value={country.displayValue}
                                >
                                  {country.displayValue}
                                </SelectItem>
                              ))}
                              {/* <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">
                              Prefered not to disclose
                            </SelectItem> */}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>City</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cityData &&
                                cityData.map((city) => (
                                  <SelectItem
                                    key={city.uniqueKey}
                                    value={city.value}
                                  >
                                    {city.displayValue}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error ? (
                      <div className="text-sm text-red-500">
                        {error.message}
                      </div>
                    ) : (
                      <>
                        <FormField
                          control={form.control}
                          name="industry_id"
                          render={({ field }) => (
                            <FormItem className="space-y-1 pb-2">
                              <FormLabel>Industry</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {rolesData?.data?.industry?.length > 0 &&
                                    rolesData?.data?.industry?.map(
                                      (industry: any) => (
                                        <SelectItem
                                          value={industry.id}
                                          key={industry.id}
                                        >
                                          {industry.name}
                                        </SelectItem>
                                      ),
                                    )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department_id"
                          render={({ field }) => (
                            <FormItem className="space-y-1 pb-2">
                              <FormLabel>My Department</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {departmentData?.length > 0 &&
                                    departmentData?.map((depart: any) => (
                                      <SelectItem
                                        value={depart.id}
                                        key={depart.id}
                                      >
                                        {depart.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role_id"
                          render={({ field }) => (
                            <FormItem className="space-y-1 pb-2">
                              <FormLabel>My Role</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roleData?.length > 0 &&
                                    roleData?.map((role: any) => (
                                      <SelectItem value={role.id} key={role.id}>
                                        {role.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    <div className="my-4">
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
                      {form.formState.errors && (
                        <div className="my-3 text-sm text-red-500">
                          {Object.keys(form.formState.errors).map(
                            (error: any, index: number) => (
                              <div key={index} className="">
                                {form?.formState?.errors &&
                                  form?.formState?.errors &&
                                  form?.formState?.errors[
                                    error as keyof typeof form.formState.errors
                                  ]?.message}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* OTP Dialog */}
      <OtpForm
        path={"signup"}
        isOTPDialogOpen={isOTPDialogOpen}
        setOTPDialogOpen={setOTPDialogOpen}
        email={form.getValues("email")}
      />
    </div>
  );
};

export default SelfSignup;
