import {
  Form,
  FormControl,
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
import { Toaster, toast } from "sonner";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { Button, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
// import { useForm } from "react-hook-form";
import { CgSoftwareUpload } from "react-icons/cg";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
// import { Input } from "../ui/input";
import SubmitQueryModal from "./reusableComponent/submitQueryModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET, POST } from "@/server/clientController/auth/auth";
import { z } from "zod";
import Loader from "../ui/loader";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(3, "Title cannot be empty"),
  priority: z.string().min(1),
  description: z.string().min(1, "Description cannot be empty"),
  file: z.any(),
});
const QueryDetail = () => {
  const [openSubmit, setOpenSubmit] = useState(false);

  const [activeStep, setActiveStep] = useState(0); // Step tracking for multi-step form
  const [files, setFiles] = useState<File[]>([]); // State to manage uploaded files
  // const [file, setFile] = useState(null);
  // const handleFileChange = (event) => {
  //   setFile(event.target.files[0]);
  // };
  const {
    mutate: queryMutate,
    data: queryData,
    isPending,
  } = useMutation({
    mutationFn: (values: any) => POST("/tickets", values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      toast.success(data.message ?? "Query Submit Successfully");
      console.log("Login Data", data);
      setOpenSubmit(!openSubmit);
    },
  });

  // const form = useForm({
  //   defaultValues: {
  //     title: "",
  //     priority: "",
  //     description: "",
  //   },
  // });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      title: "",
      priority: "",
      description: "",
    },
  });

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setFiles(Array.from(event.target.files));
  //   }
  // };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log({ submitData: data });
    const { file, ...payload } = { ...data };
    // Create a FormData object to simulate what will be sent in a real API call
    const formData = new FormData();
    (Object.keys(payload) as (keyof typeof payload)[]).forEach((key) => {
      formData.append(key, payload[key]);
    });
    formData.append("status", "OPEN");
    formData.append("file", file[0]);
    // setOpenSubmit(!openSubmit);

    queryMutate(formData);
    // Log the entire form data object
    console.log("Form Data:", formData);
  };
  console.log({ formValues: form?.formState.errors });
  return (
    <>
      <div className="mb-[200px] h-[100%] w-[100%] bg-ac-3 2xl:mb-[0px]">
        <Toaster richColors position="top-right" closeButton />
        <div className="flex w-[100%] items-center justify-between pr-2 pt-3">
          <TopComponentWithHeading
            title="Submit Details / <span style='color:#8A8D98; font-size:15px'>Help & support</span>"
            description="Here is the latest details...Check Now!"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-2"
          >
            <div className="flex w-[100%] p-4 pt-10">
              {/* ----------------------LEFT ---------------------------------------- */}
              <div className="w-[40%]">
                {/* title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">Subject</FormLabel>
                      <Input
                        placeholder="Enter here"
                        type="text"
                        {...form.register("title")}
                        className="rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Priority Select */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange} // Use onValueChange for Select component
                        >
                          <SelectTrigger className="rounded-md border border-[#363636]">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-1 pb-2">
                      <FormLabel className="text-ac-10">Description</FormLabel>
                      {/* <Input
                      placeholder="Enter here"
                      type="text"
                      {...form.register("description")}
                      className="h-[110px] rounded-lg border border-[#363636]"
                    /> */}
                      <Textarea
                        placeholder="Enter here"
                        {...field}
                        fontSize={"13px"}
                        style={{ resize: "none" }}
                        bg={"#ffff"}
                        className="h-[110px] rounded-lg border border-[#363636]"
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  bg="#96233C"
                  color={"#ffff"}
                  size="md"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader size={20} loaderText="Please wait" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
              {/* ----------------------RIGHT ---------------------------------------- */}
              <div className="flex w-[50%] items-center justify-center">
                {/* <div className="flex w-[50%] flex-col space-y-2">
                <label className="text-[#8A8D98]">file</label>
                <div className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#8A8D98] p-4 text-center hover:border-[#B55079]">
                  <input
                    type="file"
                    {...form.register("file")}
                    className="hidden"
                    multiple
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-[#B55079]">
                      <CgSoftwareUpload />

                      <span className="text-sm underline">Upload File</span>
                    </div>
                  </label>
                </div>
              </div> */}
                <div className="flex w-[50%] flex-col space-y-2">
                  <label className="text-[#8A8D98]">Attachment</label>
                  {!form?.getValues("file") ||
                  form?.getValues("file")?.length === 0 ? (
                    <div className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#8A8D98] p-4 text-center hover:border-[#B55079]">
                      <input
                        type="file"
                        {...form.register("file")}
                        className="hidden"
                        // multiple
                        // onChange={handleFileChange} // Handle file input change
                        id="fileUpload"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        <div className="flex items-center gap-2 text-[#B55079]">
                          <CgSoftwareUpload />
                          <span className="text-sm underline">Upload File</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between rounded-lg border border-gray-300 p-2">
                          <span className="text-sm text-ac-1">
                            {form?.getValues("file")[0]?.name as string}
                          </span>
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => form.resetField("file")}
                            className="text-red-500"
                          >
                            &times;
                          </Button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <SubmitQueryModal isOpen={openSubmit} onOpenChange={setOpenSubmit} />
    </>
  );
};

export default QueryDetail;
