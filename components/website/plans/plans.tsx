import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import PaymentModal from "./paymentModal";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import Loader from "@/components/ui/loader";
import Error from "@/pages/error";
import ContactModal from "../contact/contactModal";

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
const clientSecret = process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET;

const Plans = () => {
  const [isDialogOpen, setDialogOpen] = useState<Boolean>(false);
  const [isContactDialogOpen, setisContactDialogOpen] =
    useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<any>();
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  const {
    isLoading,
    isFetching,
    isError,
    error,
    data: plansData,
    refetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: () => GET("/home/plans"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });

  function handlePayment(plan: any) {
    console.log(plan?.type);
    setSelectedPlan(plan);
    if (plan?.type === "self_assessment") {
      setDialogOpen(true);
    } else if (plan?.type === "org_assessment_hiring") {
      console.log("triggered");
      setisContactDialogOpen(true);
    } else {
      // show toast
      return toast.info("Coming soon...");
    }
  }

  if (!stripe) {
    window.location.reload();
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex h-[100vh] w-full items-center justify-center">
        <Loader size={60} />
      </div>
    );
  }
  if (isError) {
    return <Error error={error} reset={refetch} />;
  }

  return (
    <>
      <Toaster richColors position="top-right" closeButton />
      <section className="bg-white font-montserrat dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Designed for business teams like yours
            </h2>
            <p className="mb-5 font-light text-gray-500 dark:text-gray-400 sm:text-xl">
              Here at Flowbite we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
          </div>
          <div className="space-y-8 sm:grid-cols-1 sm:gap-6 md:grid-cols-2 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
            {plansData?.data &&
              plansData?.data?.map((plan: any, index: number) => (
                <div
                  key={index}
                  className={`${selectedPlan?.id === plan?.id ? "bg-ac-2" : "bg-none"} [&amp;_p]:delay-200 [&amp;_p]:transition-all relative z-20 mx-auto flex w-[330px] max-w-lg cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow-lg transition-all duration-300 after:absolute after:inset-0 after:-z-20 after:h-full after:w-full after:-translate-y-full after:rounded-lg after:bg-ac-2 after:transition-all after:duration-500 hover:transition-all hover:duration-300 after:hover:translate-y-0 after:hover:transition-all after:hover:duration-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8`}
                >
                  <div className="flex-grow">
                    <h3 className="mb-4 text-2xl font-semibold">{plan.name}</h3>
                    <p className="text-xl font-light tracking-wider text-gray-500 group-hover:text-gray-700 dark:text-gray-400 sm:text-lg">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex flex-grow flex-col justify-center">
                    {plan.type === "self_assessment" && (
                      <div className="my-8 flex items-baseline justify-center">
                        <span className="mr-2 text-5xl font-extrabold">
                          ${plan.charges}
                        </span>
                      </div>
                    )}
                    <ul role="list" className="mb-8 space-y-4 text-left">
                      {plan.PlansFeatures.map((feature: any, index: number) => (
                        <li key={index} className="flex items-center space-x-3">
                          <svg
                            className="h-5 w-5 flex-shrink-0 text-green-500 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                          <span>{feature.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-auto">
                    <Button
                      className="w-full rounded-lg bg-ac-1 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-ac-2 hover:text-ac-5 focus:ring-4 focus:ring-blue-200 dark:text-white dark:focus:ring-blue-900"
                      onClick={() => handlePayment(plan)}
                    >
                      {plan.type === "self_assessment"
                        ? "Get Started"
                        : "Contact Us"}
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      <Elements
        stripe={stripe}
        options={{ ...options, appearance: { theme: "stripe" } }}
      >
        <PaymentModal
          isDialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          planId={selectedPlan?.id}
          planType={selectedPlan?.type}
        />
      </Elements>
      <ContactModal
        isContactDialogOpen={isContactDialogOpen}
        setContactDialogOpen={setisContactDialogOpen}
        type={selectedPlan?.type}
        plan_id={selectedPlan?.id}
        path={"plans"}
      />
    </>
  );
};

export default Plans;
