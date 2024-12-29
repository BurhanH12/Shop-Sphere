import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import { FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { BiFile } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { BsFileEarmarkText } from "react-icons/bs";
import { Separator } from "../ui/separator";
import { ImAttachment } from "react-icons/im";

import {
  Box,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { TbSend, TbSend2 } from "react-icons/tb";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GET, POST, PUT } from "@/server/clientController/auth/auth";
import { useAppSelector } from "@/store/hooks";
import io from "socket.io-client";
import { Button } from "../ui/button";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import Image from "next/image";
import Link from "next/link";
import {
  customTruncateFileName,
  customTruncateHandler,
  formatDate,
  truncateString,
} from "@/utils/helper";
import { toast } from "sonner";
import Loader from "../ui/loader";

const QueryTicket = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [socket, setSocket] = useState<any>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { user: admin } = useAppSelector((state) => state.adminAuth);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [imageBase64, setImageBase64] = useState("");

  const router = useRouter();
  const { id } = router.query;

  const {
    isLoading,
    isFetching,
    error,
    isError,
    refetch,
    data: queryTicketData,
  } = useQuery({
    queryKey: ["queryTicket"],
    queryFn: () => GET(`/tickets/${id}`),
    refetchOnWindowFocus: false,
    // staleTime: 1000 * 60 * 3, // 3 minutes
    enabled: id && id !== undefined ? true : false,
  });

  const handleAddAttachment = (files: FileList | null) => {
    if (files) {
      // Convert FileList to array
      const fileArray = Array.from(files);

      // Map over files and convert each to base64
      Promise.all(
        fileArray.map(
          (file) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.onload = () => {
                if (reader.result) {
                  const base64Data = (reader.result as string).split(",")[1];
                  // console.log(base64Data, "base64Data");
                  resolve({
                    fileName: file.name,
                    fileData: base64Data,
                  });
                } else {
                  reject(new Error("FileReader did not return a result"));
                }
              };

              reader.onerror = () => reject(new Error("Failed to read file"));
              reader.readAsDataURL(file); // Convert file to base64
            }),
        ),
      )
        .then((results) => {
          // Update state with the new attachments
          setAttachments((prevAttachments: any) => [
            ...prevAttachments,
            ...results,
          ]);
        })
        .catch((error) => {
          console.error("Error converting files to base64:", error);
        });
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const { mutate: updateMutate, data: updateData } = useMutation({
    mutationFn: (values: any) =>
      PUT(`/admin/organization-tickets/${id}`, values),
    onError: (error: any) => {
      console.log("We Are in Error", error);
      return toast.error(error?.message ?? "Network error. Please try again.");
    },
    onSuccess: (data: any) => {
      handleSendMessage();
      refetch();
      toast.success("Request submitted successfully.");
    },
  });

  useEffect(() => {
    if (queryTicketData?.data?.messages?.length > 0) {
      setMessages(queryTicketData?.data?.messages);
    }
  }, [queryTicketData?.data?.messages]);
  useEffect(() => {
    if (id) {
      console.log({ id });
      const newSocket = io("https://resourcehub.thewebtestlink.xyz", {
        transports: ["websocket", "polling"], // Allow fallback to polling
        timeout: 20000, // Increase the timeout to handle slow responses
      });
      // const newSocket = io("http://localhost:3000/chat", {
      //   transports: ["polling", "websocket"],
      //   path: "/api/new/socket",
      // });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket server");
        newSocket.emit("joinRoom", { ticketId: id });
      });

      newSocket.on("connect_error", (err) => {
        console.error("Connection error:", err);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
      newSocket.on("receiveMessage", (message: any) => {
        if (message) {
          console.log({ message });
          setMessages((prevMessages) => [...prevMessages, message]);
          if (
            ["ON_HOLD", "OPEN"].includes(
              queryTicketData?.data?.ticket?.status,
            ) ||
            message?.content?.includes("Closed")
          ) {
            console.log("micCheck");
            refetch();
          }
        }
      });
      newSocket.emit("joinRoom", { ticketId: id });

      setSocket(newSocket);

      // Cleanup function
      return () => {
        newSocket.close(); // Close the socket connection
      };
    }
  }, [id, queryTicketData?.data]);

  const handleSendMessage = () => {
    if (socket) {
      console.log("inside socket message", socket);

      const payload: any = {
        ticketId: id,
        content: message,
        senderId: user?.id ?? admin?.id,
      };
      if (attachments?.length > 0) payload.files = attachments;
      console.log({ payload });
      if (message === "" && attachments.length === 0) {
        return alert("cannot send empty message");
      }
      socket.emit("sendMessage", { ...payload });
      setMessage("");
      setAttachments([]);
    }
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]); // Depend on queryTicketData to scroll to bottom when data changes
  // const downloadFiles = async (messageAttachment: any) => {

  if (isLoading || isFetching) {
    return (
      <div className="item-center flex h-[100%] w-[100%] justify-center">
        <Loader size={60} />
      </div>
    );
  }
  console.log({ queryTicketData: queryTicketData?.data, admin });

  return (
    <div className="h-[100%] w-[100%] bg-ac-3 2xl:mb-[0px]">
      <div className="flex w-[100%] items-center justify-between pr-2 pt-3">
        <TopComponentWithHeading
          title="Query Details / <span style='color:#8A8D98; font-size:15px'>Help & support</span>"
          description="Here is the latest details...Check Now!"
        />
        <div className="flex items-center justify-center gap-4 rounded-lg border border-black p-1 px-3">
          <p className="text-[13px] font-semibold">Priority:</p>
          <div className="flex items-center justify-center gap-1">
            <div className="h-2 w-2 rounded-full bg-ac-1" />
            <p className="text-[13px] font-semibold">
              {queryTicketData?.data?.ticket?.priority || ""}
            </p>
          </div>
          {queryTicketData?.data?.ticket?.status === "IN_PROGRESS" &&
            admin?.Role?.name === "admin" && (
              <Button
                size={"sm"}
                className="w-full rounded-xl bg-ac-1"
                onClick={() => {
                  setMessage("Ticket Closed by Admin");

                  updateMutate({
                    status: "CLOSED",
                  });
                }}
              >
                Close Ticket
              </Button>
            )}
        </div>
      </div>
      <div className="pt-5">
        {/* -----------------------FIRST SECTION DIV--------------------------- */}
        <div className="flex w-[100%] items-center justify-between">
          <div className="flex w-[50%] flex-col gap-4 2xl:w-[40%]">
            <div className="flex flex-col space-y-1 pb-2">
              <label className="text-[13px] text-ac-15">Subject</label>
              <input
                type="text"
                value={queryTicketData?.data?.ticket?.title || ""} // Yahan apna static data set karen
                disabled // Input field ko disable karne ke liye
                className="rounded-lg border border-ac-15 p-1 px-3 py-3 text-[13px] font-semibold" // Add padding for better appearance
              />
            </div>
            <div className="flex flex-col space-y-1 pb-2">
              <label className="text-[13px] text-ac-15">Description</label>
              <textarea
                aria-multiline
                style={{ resize: "none" }}
                value={queryTicketData?.data?.ticket?.description || ""}
                disabled // Input field ko disable karne ke liye
                className="w-full rounded-lg border border-ac-15 p-3 text-[13px] font-semibold" // Add padding and width for better appearance
                rows={4} // Adjust the number of rows as needed
              />
            </div>
          </div>

          <div className="w-[40%] pr-3">
            <label className="text-[#8A8D98]">Attachment</label>
            <div className="mt-4">
              <ul className="space-y-2">
                <li className="flex h-[130px] items-center justify-between rounded-xl border border-gray-300 p-2 pr-4">
                  {queryTicketData?.data?.ticket?.attachments?.length > 0 ? (
                    <>
                      <div className="flex items-center justify-center gap-2">
                        <FileRenderer
                          fileUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${
                            queryTicketData?.data?.ticket?.attachments[0]
                              ?.filePath
                          }`}
                          fileName={
                            queryTicketData?.data?.ticket?.attachments[0]
                              ?.fileName
                          }
                        ></FileRenderer>
                        {/* <BsFileEarmarkText className="h-24 w-16 text-ac-15" /> */}
                        {/* <span className="text-#CCCCCC text-sm font-semibold">
                          {
                            queryTicketData?.data?.ticket?.attachments[0]
                              ?.fileName
                          }
                        </span> */}
                      </div>
                      {/* <div className="flex items-center justify-center gap-2">
                      

                        <FiDownload className="h-5 w-5 text-ac-15" />
                      </div> */}
                    </>
                  ) : (
                    "No Attachement found"
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* -----------------------FIRST SECTION DIV--------------------------- */}
        <Separator className="my-4" />

        {/* -----------------------SECOND SECTION DIV--------------------------- */}
        <div className="">
          <div className="flex gap-2 text-[15px] font-semibold text-ac-9">
            <p> Response{"   "} - </p>
            <p> Operation Manager </p>
          </div>
          <div className="flex gap-2 pt-2 text-[15px] font-semibold text-ac-9">
            <Image src={"/avatar.png"} alt="support" height={40} width={40} />
            <div className="flex flex-col items-start justify-start text-[12px]">
              <p className="font-normal text-ac-13"> Production Head </p>
              <p className="font-semibold text-ac-13"> John Alison </p>
            </div>
          </div>
          {/* ================CHAT AREA=================== */}

          <div
            ref={scrollRef}
            className="mb-0.5 mt-1 flex h-[350px] flex-col gap-5 px-4 py-3 shadow-lg"
            style={{ overflowY: "scroll" }}
          >
            {/* <div>
              <div className="p flex w-[99%] justify-between">
                <p className="text-[12px] font-semibold text-ac-1">
                  Operational Manager | John Doe
                </p>
                <p className="text-[12px] text-ac-7">
                  Received Date : August 8th,2024, 3AM
                </p>
              </div>
              <div className="mt-2 h-[auto] w-[99%] rounded-xl border border-ac-8">
                <p className="p-3 text-[14px] font-semibold">
                  Sure, I’ll update shortly
                </p>
              </div>
            </div> */}
            {messages?.map((item: any) => (
              <div key={item}>
                <div className="p flex w-[99%] justify-between">
                  <p className="text-[12px] font-semibold capitalize text-ac-1">
                    {item?.sender?.id === user?.id ||
                    item?.sender?.id === admin?.id ? (
                      "My Response"
                    ) : (
                      <>
                        {item?.sender?.Role?.name} | {item?.sender?.full_name}
                      </>
                    )}
                  </p>
                  <p className="text-[12px] text-ac-7">
                    Received Date : {formatDate(item?.createdAt)}
                  </p>
                </div>
                <div className="mt-2 h-[auto] w-[99%] rounded-xl border border-ac-8">
                  <p className="p-3 text-[14px] font-semibold">
                    {item?.content}
                  </p>
                  <div className="flex gap-1 pb-1 pl-2">
                    {item?.attachments.length > 0 && (
                      <>
                        {item?.attachments.map(
                          (attachment: any, index: number) => (
                            <div key={index} className="group relative">
                              {/* <BsFileEarmarkText className="h-10 w-10 text-ac-15" /> */}
                              <FileRenderer
                                fileUrl={`${process.env.NEXT_PUBLIC_IMAGE_URL}${
                                  attachment?.filePath
                                }`}
                              />
                              {/* <Image
                              alt="file view"
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${attachment?.filePath}`}
                              height={20}
                              width={20}
                            /> */}
                              <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                {attachment?.fileName}
                              </div>
                            </div>
                          ),
                        )}

                        {/* Adjust spacing if needed */}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* ================CHAT AREA=================== */}

          {/* ..................MESSAGE AREA.................................... */}

          {/* <div className="flex h-[80px] w-[100%] items-center rounded-lg border border-red-600 bg-[#f6f6f6] px-2">
            <span className="w-[5%] pl-2">
              <ImAttachment size={22} />
            </span>
            <textarea
              style={{ resize: "none" }}
              multiple
              placeholder="Enter here"
              className="flex-grow border-none bg-transparent px-2 py-2 focus:outline-none focus:ring-0"
            />
            <span className="pr-2">
              <TbSend size={24} />
            </span>
          </div> */}
          {["CLOSED"].includes(queryTicketData?.data?.ticket?.status) ? (
            <div className="mt-2 flex h-[50px] items-center justify-center rounded-lg bg-ac-2 p-3 font-semibold text-ac-1">
              Note: Admin closed the ticket
            </div>
          ) : (
            <>
              {((user && user?.Role?.name !== "admin") ||
                (admin && admin?.Role?.name !== "admin")) &&
              ["ON_HOLD", "OPEN"].includes(
                queryTicketData?.data?.ticket?.status,
              ) ? (
                <>
                  <div className="mt-2 flex h-[50px] items-center justify-center rounded-lg bg-ac-2 p-3 font-semibold text-ac-1">
                    Note: Please wait for the admin response
                  </div>
                </>
              ) : (
                <div className="relative flex h-[auto] w-full flex-col items-start rounded-lg border border-red-600 bg-[#f6f6f6] px-2 py-2">
                  {/* Attachments Display */}
                  {attachments.length > 0 && (
                    <div className="relative mb-2 flex flex-wrap gap-1 rounded-md">
                      {attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="relative mx-1 flex items-center gap-2 bg-white p-1"
                        >
                          {/* Replace this with your attachment preview */}
                          <BsFileEarmarkText className="h-10 w-10 text-ac-15" />
                          <div
                            //   type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="absolute right-0 top-0 mr-1 mt-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-red-500 bg-white text-red-500"
                          >
                            x
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Main Input Area */}
                  <div className="flex w-full items-center">
                    <span className="w-[5%] pl-2">
                      <label htmlFor="fileInput" className="cursor-pointer">
                        <ImAttachment size={22} />
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        multiple
                        onChange={(e) => handleAddAttachment(e.target.files)}
                        className="hidden"
                      />
                    </span>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !(message === "" && attachments.length === 0)
                        ) {
                          handleSendMessage(); // Call the message send function when Enter is pressed
                        }
                      }}
                      style={{ resize: "none" }}
                      placeholder="Enter here"
                      className="flex-grow border-none bg-transparent px-2 py-2 focus:outline-none focus:ring-0"
                    />
                    <span className="pr-2">
                      <button
                        disabled={
                          message === "" && attachments.length === 0
                            ? true
                            : false
                        }
                        onClick={handleSendMessage}
                        className={`${message === "" && attachments.length === 0 ? "text-blue-500" : "text-ac-1"}`}
                      >
                        <TbSend size={24} />
                      </button>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ..................MESSAGE AREA.................................... */}
        </div>

        {/* -----------------------SECOND SECTION DIV--------------------------- */}
      </div>
    </div>
  );
};
const FileRenderer = (payload: any) => {
  console.log({ payload });
  // Function to extract the file extension
  const getFileExtension = (url: any) => {
    return url?.split(".").pop().toLowerCase();
  };

  // Function to determine if the file is an image
  const isImage = (extension: string) => {
    const imageExtensions = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "bmp",
      "svg",
      "webp",
      "ico",
    ];
    return imageExtensions.includes(extension);
  };

  // Function to handle the click and open in a new tab
  const handleClick = () => {
    window.open(payload?.fileUrl, "_blank");
  };

  const extension = getFileExtension(payload?.fileUrl);

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      {isImage(extension) ? (
        <div className="flex items-center gap-2 text-[14px]">
          <Image
            width={50}
            height={50}
            src={payload?.fileUrl}
            alt="file preview"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />
          {payload?.fileName && (
            <span>{customTruncateFileName(payload?.fileName, 8)}</span>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="flex items-center gap-2 text-[14px]"
        >
          <BsFileEarmarkText
            className="h-24 w-24 text-ac-15"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
          />
          {payload?.fileName && (
            <span>{customTruncateFileName(payload?.fileName, 8)}</span>
          )}
        </div>
      )}
    </div>
  );
};
export default QueryTicket;
