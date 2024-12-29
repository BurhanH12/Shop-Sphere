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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import {
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { POST } from "@/server/clientController/auth/auth";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { userAuth } from "@/store/slices/authSlice";
import Loader from "@/components/ui/loader";

const formSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
});

interface payloadSchema {
  name: string;
  email: string;
  token: string;
  plan_id: number;
  type: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Monserrat", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      display: "flex !important",
      flexDirect: "column !important",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const PaymentModal = ({
  path,
  isDialogOpen,
  setDialogOpen,
  planId,
  planType,
  refetchDash,
}: any) => {
  console.log({planId, planType})
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.full_name ?? "",
      email: user?.email ?? "",
    },
  });

  // Payment Api
  const {
    mutate,
    data: paymentData,
    isPending,
  } = useMutation({
    mutationKey: ["payment"],
    mutationFn: async (values: payloadSchema) => POST(`/payment`, values),
    onSuccess: (data: any) => {
      toast.success(data.message ?? "Payment successful");
      console.log("Payment successful", data);
      setDialogOpen(false);
      dispatch(
        userAuth({
          email: form.getValues("email"),
          full_name: form.getValues("name"),
        }),
      );
      form.reset();
      router.push("/signup"); // Redirect to Signup after successful payment
    },
    onError: (error) => {
      console.error("Payment failed", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
  });

  // Renew API
  const {
    mutate: renewMutate,
    data: renewData,
    isPending: isRenewPending,
  } = useMutation({
    mutationKey: ["renew"],
    mutationFn: async (values: any) => POST(`/payment/renew`, values),
    onSuccess: (data: any) => {
      toast.success(data.message ?? "Payment successful");
      console.log("Payment successful", data);
      setDialogOpen(false);
      form.reset();
      refetchDash(); //Refetch new Data after successful payment
    },
    onError: (error) => {
      console.error("Payment failed", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      throw new Error("Stripe.js hasn't yet loaded");
    }
    const cardNumberElement: any = elements.getElement(CardNumberElement);
    const result: any = await stripe.createToken(cardNumberElement);
    console.log({ result });
    if (path === "renew") {
      const payload = {
        plan_id: planId,
        token: result.token.id,
      };
      renewMutate(payload);
      return;
    }
    const payload = {
      name: values.name,
      email: values.email,
      token: result.token.id,
      plan_id: planId,
      type: "self",
    };
    mutate(payload);
  }

  return (
    <div className="font-montserrat">
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle className="items-center">Payment</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1 pb-2">
                    <FormLabel className="text-ac-10">Full Name</FormLabel>
                    <Input
                      disabled={user?.full_name}
                      placeholder="Enter Full Name"
                      type="text"
                      {...form.register("name")}
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
                    <FormLabel className="text-ac-10">Email Address</FormLabel>
                    <Input
                      disabled={user?.email}
                      placeholder="Enter Email Address"
                      type="email"
                      {...form.register("email")}
                      className="rounded-lg border border-[#363636]"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardSection />
              <DialogFooter>
                <Button
                  size={"lg"}
                  className="w-full rounded-xl bg-ac-1"
                  type="submit"
                  disabled={isPending || !stripe || !elements || isRenewPending}
                >
                  {isPending || isRenewPending ? (
                    <Loader size={25} loaderText="Please wait" />
                  ) : (
                    "Pay Now"
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

export default PaymentModal;

const CardSection = ({}: any) => {
  return (
    <div>
      <CardInput
        label="Card Number"
        element={<CardNumberElement options={CARD_ELEMENT_OPTIONS} />}
      />
      <CardInput
        label="Expiration Date"
        element={<CardExpiryElement options={CARD_ELEMENT_OPTIONS} />}
      />
      <CardInput
        label="CVC"
        element={<CardCvcElement options={CARD_ELEMENT_OPTIONS} />}
      />
    </div>
  );
};

const CardInput = ({ label, element }: any) => {
  return (
    <div className="mb-4">
      <FormLabel>{label}</FormLabel>

      {/* <label className="block text-sm font-medium text-gray-700"></label> */}
      <div className="inline-block h-full w-full items-center justify-center rounded border border-gray-300 px-4 py-2 text-base">
        {element}
      </div>
    </div>
  );
};
