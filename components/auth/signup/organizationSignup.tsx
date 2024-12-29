import Loader from "@/components/ui/loader";
import Error from "@/pages/error";
import { GET, POST } from "@/server/clientController/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { City, Country } from "country-state-city";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Button } from "@/components/ui/button";
import { formatNIC } from "@/utils/helper";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/router";
import OneModal from "../oneModal";
import { useState } from "react";

// Main form schema
const formSchema = z.object({
  org_name: z
    .string()
    .min(3, { message: "Organization name must contain atleast 3 letters." })
    .max(35),
  industry_id: z.string().min(1, { message: "Industry is required" }),
  full_name: z
    .string()
    .min(3, { message: "Name must contain atleast 3 letters." })
    .max(35),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City is required" }),
  role_id: z.string().min(1, { message: "Role is required" }),
  email: z.string().email(),
  nic: z
    .string()
    .min(13, { message: "NIC must be 13 characters long" })
    .max(15),
  number: z.string().min(3),
});

const OrganizationSignup = () => {
  const router = useRouter();
  const [path, setPath] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      org_name: "",
      industry_id: "",
      full_name: "",
      country: "",
      city: "",
      role_id: "",
      email: "",
      nic: "",
      number: "",
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

  const {
    mutate: signupMutate,
    data: signupData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST("/users/register-org", values),
    onError: (error: any) => {
      console.log("Org Errir", signupData);
      if (error?.message === "Please select a plan to proceed further") {
        console.log(error);
        toast.error(error?.message ?? "Network error. Please try again.");
        // Redirect to payment gateway
        // router.push("/plans");
        return;
      }
      if (error?.message === "You have reached your Attempt Limit") {
        setPath("error");
        console.log("We Are in Error", error);
        setDialogOpen(true);
      }
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message);
      if (data?.type === "password-change") {
        window.localStorage.setItem(
          "access_token",
          JSON.stringify(data?.token),
        );
        router.replace({
          pathname: "/forgot-password",
          query: { type: "changepassword" },
        });
        return;
      }
      // setOTPDialogOpen(true); // Open OTP dialog after successful submission
    },
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

  const roleData = form.watch("industry_id")
    ? rolesData?.data?.roles?.filter(
        (role: any) => role.industry_id === form.getValues("industry_id"),
      )
    : [];

  // Main form submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Main Form Values: ", values);
    signupMutate(values);
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
    <>
      <div className="h-auto w-full bg-[#F3F3F3] pb-5 pl-20 pr-20 pt-20 font-montserrat">
        <Toaster richColors position="top-right" closeButton />
        <div className="higths">
          <div className={`mb-10 flex items-center justify-end`}>
            <p className="font-normal">
              Already have an account?{" "}
              <Link href="/login" className="text-ac-1">
                Log In
              </Link>
            </p>
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
            <div className="w-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-8"
                >
                  <div>
                    <FormField
                      control={form.control}
                      name="org_name"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            Organization Name
                          </FormLabel>
                          <Input
                            placeholder="Enter Full Name"
                            type="text"
                            {...form.register("org_name")}
                            className="rounded-lg border border-[#363636]"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry_id"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>Organization Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-lg border border-[#363636]">
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
                      name="country"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="rounded-lg border border-[#363636]">
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
                              <SelectTrigger className="rounded-lg border border-[#363636]">
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
                              <SelectTrigger className="rounded-lg border border-[#363636]">
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
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1 pb-2">
                          <FormLabel className="text-ac-10">
                            Corporate Email ID*
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
                  </div>
                  <div className="my-8">
                    <Button
                      type="submit"
                      size={"lg"}
                      className="w-full rounded-xl bg-ac-1"
                    >
                      {isPending ? (
                        <Loader size={25} loaderText="Please wait" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <OneModal
        path={path}
        sethPath={setPath}
        isDialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
};

export default OrganizationSignup;
