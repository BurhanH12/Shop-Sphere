"use client";

import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useForm, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { GET } from "@/server/clientController/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import Loader from "../ui/loader";
import Error from "@/pages/error";
import { useState } from "react";
import { formatNIC } from "@/utils/helper";

const formSchema = z.object({
  department_id: z.string().min(1, { message: "Department is required" }),
  role_id: z.string().min(1, { message: "Role is required" }),
  full_name: z
    .string()
    .min(3, { message: "Name must contain atleast 3 letters." })
    .max(35),
  age: z
    .number()
    .min(16, { message: "Candidate must be older than 16." })
    .max(80, "Candidate must be younger than 80"),
  experience: z.string().min(1, { message: "Experince is required" }),
  // number: z.string().min(10, { message: "Phone Number is required" }),
  nic: z
    .string()
    .min(13, { message: "NIC must be 13 characters long" })
    .max(15),
  assessmentAt: z.date(),
  gender: z.enum(["male", "female", "other"]),
});

const CandidateAssessment = () => {
  const router = useRouter();
  const [department, setDepartment] = useState<any>();

  const {
    isLoading,
    error,
    isError,
    refetch,
    data: candidateDepartmentData,
  } = useQuery({
    queryKey: ["analysis"],
    queryFn: () => GET(`/jsps/department`),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department_id: "",
      role_id: "",
      full_name: "",
      age: 0,
      experience: "",
      nic: "",
      assessmentAt: new Date(),
      gender: "male",
    },
  });

  const choosedDepartment = candidateDepartmentData?.data?.plans?.find(
    (item: any) => item?.id === department,
  );

  const selectedDepartment = useWatch({
    control: form.control,
    name: "department_id",
  });

  const roleData = candidateDepartmentData?.data?.roles?.filter(
    (item: any) => item.department_id === selectedDepartment,
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    localStorage.setItem("candidate-data", JSON.stringify(values));
    router.push("/dashboard/assessment");
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }
  if (isError) {
    return <Error error={error} reset={refetch} />;
  }

  return (
    <div className="mb-[200px] h-[100%] w-[100%] bg-ac-3">
      {/* Top Section */}
      <div className="flex w-[100%] items-center justify-between pr-2 pt-3">
        <div>
          <TopComponentWithHeading
            title="Candidate Assessment"
            description="Here is the latest details...Check Now!"
          />
        </div>
        <div>
          {candidateDepartmentData?.data?.is_attempt_left === false ? (
            <p className="fade-in-show bounce-animation text-[13px] font-semibold text-red-700">
              no attempts for now
            </p>
          ) : choosedDepartment?.is_attempt_left === false ? (
            <p className="fade-in-show bounce-animation text-[13px] font-semibold text-red-700">
              You reached the limit for {choosedDepartment?.name} Department!
            </p>
          ) : null}
        </div>
        {/* {candidateDepartmentData?.data?.is_attempt_left === false && (
          <p>no attempts for now </p>
        )} */}
      </div>

      {/* Form Section */}
      <div className="mx-auto mt-9 flex w-[100%] flex-col justify-center px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Department */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="department_id"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Department
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setDepartment(value); // Save the selected value to state
                        }}
                        // onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[90%] rounded-lg border border-[#363636] py-7">
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {candidateDepartmentData?.data?.plans?.map(
                            (item: any) => (
                              <SelectItem key={item.id} value={item?.id}>
                                {item?.name}
                              </SelectItem>
                            ),
                          )}
                          {/* <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="role_id"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[90%] rounded-lg border border-[#363636] py-7">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roleData?.map((item: any) => (
                            <SelectItem key={item?.id} value={item?.id}>
                              {item?.name}
                            </SelectItem>
                          ))}
                          {/* <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="designer">Designer</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">Full Name</FormLabel>
                      <Input
                        placeholder="Enter Full Name"
                        type="text"
                        {...form.register("full_name")}
                        className="w-[90%] rounded-lg border border-[#363636] py-7"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Age */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Age
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="Enter Age"
                        type="number"
                        // {...form.register("age")}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className="w-[90%] rounded-lg border border-[#363636] py-7"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Experience */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Experience
                      </FormLabel>
                      <Input
                        placeholder="Enter Experience"
                        type="text"
                        {...form.register("experience")}
                        className="w-[90%] rounded-lg border border-[#363636] py-7"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* NIC */}
              <div className="space-y-1 pb-2">
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
                        className="w-[90%] rounded-lg border border-[#363636] py-7"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assessment Date */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="assessmentAt"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Assesment Date
                      </FormLabel>
                      <Input
                        name="assessmentDate"
                        placeholder="Select Date"
                        className="w-[90%] rounded-lg border border-[#363636] py-7"
                        type="date"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1 pb-2">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-[15px] text-ac-10">
                        Gender
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[90%] rounded-lg border border-[#363636] py-7">
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
              </div>
            </div>
            <div className="flex justify-start pt-7">
              <Button
                disabled={
                  choosedDepartment?.is_attempt_left === false ? true : false
                }
                size={"lg"}
                className="rounded-lg bg-ac-1 px-8 py-2 text-white hover:bg-ac-2 hover:text-ac-1"
                type="submit"
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CandidateAssessment;
