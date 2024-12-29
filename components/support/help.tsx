// import React, { useState } from "react";
// import TopComponentWithHeading from "../dashboard/ReusableComponents/TopComponentWithHeading";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Separator } from "../ui/separator";
// import Image from "next/image";
// const Help = () => {
//     const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

//     const handleAccordionChange = (value: string) => {
//         // setActiveAccordion(activeAccordion === value ? null : value);
//         setActiveAccordion(value);

//     };
//   return (
//     // <div>
//     <div className="w-[100%] h-[100%] bg-ac-3">
//       {/* -------------HEADER WITH STEPPER START---------------------- */}
//       <div className="w-[100%] pr-2 flex justify-between items-center ">
//         <TopComponentWithHeading
//           title="Help & Support"
//           description="Here is the latest details...Check Now!
// "
//         />
//       </div>
//       <div className="flex flex-wrap gap-4 mt-16 px-5">
//       <Accordion type="single" collapsible className="w-[48%]" onValueChange={handleAccordionChange}>
//         <AccordionItem
//           value="item-1"
//           className={`border border-black text-ac-12 px-2 rounded-xl ${
//             activeAccordion === 'item-1' ? 'bg-ac-2 border-none' : ''
//           }`}
//         >
//           <AccordionTrigger className=" hover:no-underline" >
//             Q1. Lorem ipsum dolor sit amet, consectetur?
//           </AccordionTrigger>

//           <AccordionContent>
//           <Separator className="bg-black mb-5" />
//           Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
//             nisi ut aliquip ex ea commodo consequat.{" "}
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       <Accordion type="single" collapsible className="w-[48%]" onValueChange={handleAccordionChange}>
//         <AccordionItem
//           value="item-2"
//           className={`border border-black text-ac-12 px-2 rounded-xl ${
//             activeAccordion === 'item-2' ? 'bg-ac-2 border-none' : ''
//           }`}
//         >
//           <AccordionTrigger className=" hover:no-underline">
//             Q2. Duis aute irure dolor in reprehenderit?
//           </AccordionTrigger>
//           <AccordionContent>
//           <Separator className="bg-black mb-5" />

//             Yes. It comes with default styles that match the other components'
//             aesthetic.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       <Accordion type="single" collapsible className="w-[48%]" onValueChange={handleAccordionChange}>
//         <AccordionItem
//           value="item-3"
//           className={`border border-black text-ac-12 px-2 rounded-xl ${
//             activeAccordion === 'item-3' ? 'bg-ac-2 border-none' : ''
//           }`}
//         >
//           <AccordionTrigger className=" hover:no-underline">
//             Q3. Excepteur sint occaecat cupidatat?
//           </AccordionTrigger>
//           <AccordionContent>
//           <Separator className="bg-black mb-5" />

//             Yes. It's animated by default, but you can disable it if you
//             prefer.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       <Accordion type="single" collapsible className="w-[48%]" onValueChange={handleAccordionChange}>
//         <AccordionItem
//           value="item-4"
//           className={`border border-black text-ac-12 px-2 rounded-xl ${
//             activeAccordion === 'item-4' ? 'bg-ac-2 border-none' : ''
//           }`}
//         >
//           <AccordionTrigger className=" hover:no-underline">
//             Q4. Sunt in culpa qui officia deserunt?
//           </AccordionTrigger>
//           <AccordionContent>
//           <Separator className="bg-black mb-5" />

//             Yes. You can customize the styles and behaviors to fit your needs.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>

//       <Accordion type="single" collapsible className="w-[48%]" onValueChange={handleAccordionChange}>
//         <AccordionItem
//           value="item-5"
//           className={`border border-black text-ac-12 px-2 rounded-xl ${
//             activeAccordion === 'item-5' ? 'bg-ac-2 border-none' : ''
//           }`}
//         >
//           <AccordionTrigger className=" hover:no-underline">
//             Q5. Mollit anim id est laborum?
//           </AccordionTrigger>
//           <AccordionContent>
//           <Separator className="bg-black mb-5" />

//             Yes. It adjusts to different screen sizes and orientations.
//           </AccordionContent>
//         </AccordionItem>
//       </Accordion>
//     </div>
//     <div className="px-6 mt-7 flex flex-col gap-8 w-[400px] relative" >
//         <p className="text-ac-12 font-semibold">
//         Didn’t find what you’re looking?
//         </p>
//         <div>
//             <p className="text-[13px] font-semibold">Feel free tot reach out us:</p>
//             <p className="text-[16px] text-ac-1 font-semibold">resourcehub@gmail.com</p>
//         </div>
//         <Image src={'/roundedArrow.png'}  alt='arrow' className="absolute right-[114px] top-6" width={50} height={20}/>
//     </div>
//     </div>
//   );
// };

// export default Help;
// ------------------------------------------------------------------------------
import React, { useState } from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "../ui/separator";
import Image from "next/image";

const Help = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(
    "",
  );

  const handleAccordionChange = (value: string) => {
    console.log(value);
    setActiveAccordion(value);
  };

  return (
    <div className="mb-[200px] h-[100%] w-[100%] bg-ac-3 2xl:mb-[0px]">
      <div className="flex w-[100%] items-center justify-between pr-2">
        <TopComponentWithHeading
          title="Help & Support"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="mt-16 flex flex-wrap gap-1 px-5">
        {/* First Row */}
        <div className="flex w-full gap-4">
          <Accordion
            type="single"
            collapsible
            className="w-[48%]"
            value={activeAccordion}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem
              value="item-1"
              className={`rounded-xl border border-black px-5 text-ac-12 ${
                activeAccordion === "item-1" ? "border-none bg-ac-2" : ""
              }`}
            >
              <AccordionTrigger className="hover:no-underline">
                Q1. Lorem ipsum dolor sit amet, consectetur?
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-5 bg-black" />
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            className="w-[48%]"
            value={activeAccordion}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem
              value="item-2"
              className={`rounded-xl border border-black px-5 text-ac-12 ${
                activeAccordion === "item-2" ? "border-none bg-ac-2" : ""
              }`}
            >
              <AccordionTrigger className="hover:no-underline">
                Q2. Duis aute irure dolor in reprehenderit?
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-5 bg-black" />
                Yes. It comes with default styles that match the other
                components`&apos;` aesthetic.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Second Row */}
        <div className="mt-4 flex w-full gap-4">
          <Accordion
            type="single"
            collapsible
            className="w-[48%]"
            value={activeAccordion}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem
              value="item-3"
              className={`rounded-xl border border-black px-5 text-ac-12 ${
                activeAccordion === "item-3" ? "border-none bg-ac-2" : ""
              }`}
            >
              <AccordionTrigger className="hover:no-underline">
                Q3. Excepteur sint occaecat cupidatat?
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-5 bg-black" />
                Yes. It`&apos;`s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion
            type="single"
            collapsible
            className="w-[48%]"
            value={activeAccordion}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem
              value="item-4"
              className={`rounded-xl border border-black px-5 text-ac-12 ${
                activeAccordion === "item-4" ? "border-none bg-ac-2" : ""
              }`}
            >
              <AccordionTrigger className="hover:no-underline">
                Q4. Sunt in culpa qui officia deserunt?
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-5 bg-black" />
                Yes. You can customize the styles and behaviors to fit your
                needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Third Row */}
        <div className="mt-4 flex w-full gap-4">
          <Accordion
            type="single"
            collapsible
            className="w-[48%]"
            value={activeAccordion}
            onValueChange={handleAccordionChange}
          >
            <AccordionItem
              value="item-5"
              className={`rounded-xl border border-black px-5 text-ac-12 ${
                activeAccordion === "item-5" ? "border-none bg-ac-2" : ""
              }`}
            >
              <AccordionTrigger className="hover:no-underline">
                Q5. Mollit anim id est laborum?
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-5 bg-black" />
                Yes. It adjusts to different screen sizes and orientations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="relative mt-7 flex w-[400px] flex-col gap-8 px-6">
        <p className="font-semibold text-ac-12">
          Didn’t find what you’re looking?
        </p>
        <div>
          <p className="text-[13px] font-semibold">
            Feel free to reach out to us:
          </p>
          <p className="text-[16px] font-semibold text-ac-1">
            resourcehub@gmail.com
          </p>
        </div>
        <Image
          src={"/roundedArrow.png"}
          alt="arrow"
          className="absolute right-[114px] top-6"
          width={50}
          height={20}
        />
      </div>
    </div>
  );
};

export default Help;
