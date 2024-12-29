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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { POST } from "@/server/clientController/auth/auth";
import { toast } from "sonner";
import Loader from "../ui/loader";

const infoSchema = z.object({
  department: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      value: z.number(),
    }),
  ),
});

const InfoModal = ({
  path,
  orgInfo,
  isInfoDialogOpen,
  setIsInfoDialogOpen,
  refetch,
}: any) => {
  const approvalForm = useForm<z.infer<typeof infoSchema>>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      department: [],
    },
  });

  const {
    mutate: contactMutate,
    data: contactData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST(`/admin/requests`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      refetch();
      setIsInfoDialogOpen(false);
      approvalForm.reset();
      toast.success("Request submitted successfully.");
    },
  });

  const {
    mutate: attemptsMutate,
    data: attemptData,
    isPending: attemptPending,
  } = useMutation({
    mutationFn: (values: any) =>
      POST(`/admin/user-plans/update-attempts`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      refetch();
      setIsInfoDialogOpen(false);
      approvalForm.reset();
      toast.success("Request submitted successfully.");
    },
  });

  function onSubmit(values: z.infer<typeof infoSchema>) {
    const payload = {
      ...values,
      request_id: orgInfo?.id,
      plan_id: orgInfo?.plan_id,
    };
    console.log("Values", payload);
    if (path === "attempt") {
      attemptsMutate(payload);
    } else {
      contactMutate(payload);
    }
  }

  console.log("Val", approvalForm.getValues());
  return (
    <div className="font-montserrat">
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="items-center">
            <DialogTitle>Organization Inquiry</DialogTitle>
            {/* <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription> */}
          </DialogHeader>
          <Form {...approvalForm}>
            <form
              onSubmit={approvalForm.handleSubmit(onSubmit)}
              className="w-full space-y-3"
            >
              {orgInfo?.Industry?.Department?.map(
                (plan: any, index: number) => (
                  <div key={index} className="flex flex-wrap gap-3">
                    <FormField
                      control={approvalForm.control}
                      defaultValue={plan?.id}
                      name={`department.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="items-center justify-center align-middle">
                          <Input
                            {...field}
                            defaultValue={plan?.id}
                            placeholder="Plan Feature"
                            type="text"
                            hidden={true}
                            className="rounded-lg border border-[#363636]"
                          />

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={approvalForm.control}
                      defaultValue={plan?.name}
                      name={`department.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="items-center justify-center align-middle">
                          <div>
                            <FormLabel className="text-ac-10">
                              Department Name
                            </FormLabel>
                            <Input
                              {...field}
                              disabled
                              defaultValue={plan?.name}
                              placeholder="Department Name"
                              type="text"
                              className="rounded-lg border border-[#363636]"
                            />
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={approvalForm.control}
                      defaultValue={plan?.value}
                      name={`department.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="items-center justify-center align-middle">
                          <div>
                            <FormLabel className="text-ac-10">
                              Evaluation per Department
                            </FormLabel>
                            <Input
                              {...field}
                              defaultValue={plan?.value}
                              placeholder="eg: 1"
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              className="rounded-lg border border-[#363636]"
                            />
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ),
              )}
              <Button
                size={"lg"}
                className="w-full rounded-xl bg-ac-1"
                type="submit"
              >
                {isPending ? (
                  <Loader size={20} loaderText="Please wait" />
                ) : path === "attempt" ? (
                  "Update"
                ) : (
                  "Approve"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InfoModal;
