import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Loader from "@/components/ui/loader";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET, POST } from "@/server/clientController/auth/auth";
import { toast } from "sonner";
import { formatNIC } from "@/utils/helper";

const contactFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  org_name: z
    .string()
    .min(3, "Organization Name must be at least 3 characters long"),
  email: z.string().email(),
  industry_id: z.string().min(1, { message: "Industry is required" }),
  role_id: z.string().min(1, { message: "Role is required" }),
  nic: z.string().min(13, "NIC must be 13 characters long"),
  number: z.string().min(10, "Phone number must be 10 digits long"),
});

const ContactModal = ({
  path,
  isContactDialogOpen,
  setContactDialogOpen,
  type,
  plan_id,
}: any) => {
  console.log({ plan_id, type });
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      org_name: "",
      email: "",
      role_id: "",
      industry_id: "",
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

  const roleData = contactForm.watch("industry_id")
    ? rolesData?.data?.roles?.filter(
        (role: any) =>
          role.industry_id === contactForm.getValues("industry_id"),
      )
    : [];

  const {
    mutate: contactMutate,
    data: contactData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST(`/home/request`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "OTP verified successfully");
      setContactDialogOpen(false);
      contactForm.reset();
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    const payload = { ...values, plan_id: plan_id, type: "organization" };
    console.log("Values", payload);
    contactMutate(payload);
  }

  return (
    <div className="font-montserrat">
      <Dialog open={isContactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="max-h-[650px] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader className="items-center">
            <DialogTitle>Contact Inquiry</DialogTitle>
            <DialogDescription>
              Please fill out this form and we will contact you
            </DialogDescription>
          </DialogHeader>
          <div className="w-full">
            <Form {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(onSubmit)}
                className="w-full space-y-3"
              >
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">Full Name</FormLabel>
                      <Input
                        placeholder="Enter Full Name"
                        type="text"
                        {...contactForm.register("name")}
                        className="rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="org_name"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">
                        Organization Name
                      </FormLabel>
                      <Input
                        placeholder="Enter Full Name"
                        type="text"
                        {...contactForm.register("org_name")}
                        className="rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">
                        Email Address
                      </FormLabel>
                      <Input
                        placeholder="Enter Email Address"
                        type="email"
                        {...contactForm.register("email")}
                        className="rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
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
                        onChange={(e) => formatNIC(e, contactForm)}
                        value={contactForm.getValues("nic")}
                        // {...form.register("nic")}
                        className="rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
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
                            rolesData?.data?.industry?.map((industry: any) => (
                              <SelectItem value={industry.id} key={industry.id}>
                                {industry.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
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
                <FormField
                  control={contactForm.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">Phone Number</FormLabel>
                      <PhoneInput
                        className="sm rounded-md border border-[#363636]"
                        defaultCountry="pk"
                        inputStyle={{ width: "100%" }}
                        value={contactForm.getValues("number")}
                        onChange={field.onChange}
                        inputClassName="custom-phone-input"
                      />
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
                      "Submit"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactModal;
