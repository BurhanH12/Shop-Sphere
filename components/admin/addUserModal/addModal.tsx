import { useSteps } from "@chakra-ui/react";
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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { formatNIC } from "@/utils/helper";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Loader from "@/components/ui/loader";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/server/clientController/auth/auth";
import { toast } from "sonner";
import { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

const steps = [{ title: "Step 1" }, { title: "Step 2" }];

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

const AddModal = ({
  isContactDialogOpen,
  setisContactDialogOpen,
  rolesData,
  plans,
  refetch,
}: any) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

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
      contactForm.reset();
      refetch();
      setisContactDialogOpen(false);
    },
  });

  function onSelectPlan(val: any) {
    if (val?.type === "org_assessment_hiring") {
      console.log("triggered");
      setSelectedPlan(val);
      goToNext();
    } else {
      // show toast
      return toast.info("Coming soon...");
    }
  }

  const roleData = contactForm.watch("industry_id")
    ? rolesData?.data?.roles?.filter(
        (role: any) =>
          role.industry_id === contactForm.getValues("industry_id"),
      )
    : [];

  function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(selectedPlan);
    const payload = {
      ...values,
      plan_id: selectedPlan?.id,
      type: "organization",
    };
    console.log(payload);
    contactMutate(payload);
  }

  return (
    <div className="font-montserrat">
      <Dialog open={isContactDialogOpen} onOpenChange={setisContactDialogOpen}>
        <DialogContent className="max-h-[650px] overflow-y-auto sm:max-w-[500px]">
          <DialogHeader className="items-center">
            <div className="flex items-center justify-between">
              {/* Back button, only visible on step 1 */}
              {activeStep === 1 && (
                <Button
                  variant="ghost"
                  onClick={goToPrevious}
                  className="flex items-center justify-center hover:bg-none"
                >
                  <IoIosArrowRoundBack className="h-8 w-8" />
                </Button>
              )}

              {/* Title is always centered */}
              <DialogTitle className={`${activeStep === 1 ? "mx-auto" : ""}`}>
                Add Organization
              </DialogTitle>

              {/* Spacer div to keep the title centered */}
              {activeStep === 1 && <div style={{ width: "44px" }} />}
            </div>
          </DialogHeader>
          <div className="w-full">
            {/* First Form */}
            {activeStep === 0 && (
              <>
                <div className="grid grid-cols-2 gap-5">
                  {plans?.data
                    ?.filter((plan: any) => plan.name !== "Self-Assessment")
                    ?.map((plan: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg border border-[#363636] p-4"
                      >
                        <div className="flex-grow">
                          <h3 className="mb-4 text-lg font-semibold">
                            {plan.name}
                          </h3>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => onSelectPlan(plan)}
                            className="w-full rounded-lg bg-ac-1 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-ac-2 hover:text-ac-5 focus:ring-4 focus:ring-blue-200 dark:text-white dark:focus:ring-blue-900"
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
            {/* Second Form */}
            {activeStep === 1 && (
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit(onContactSubmit)}
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
                        <FormLabel className="text-ac-10">
                          Phone Number
                        </FormLabel>
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
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddModal;
