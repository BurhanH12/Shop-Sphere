import { useState } from "react";
import { GET } from "@/server/clientController/auth/auth";
import Loader from "@/components/ui/loader";
import Error from "@/pages/error";
import TopComponentWithHeading from "@/components/dashboard/reusableComponents/topComponentWithHeading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import InfoModal from "../infoModal";

const UpdateAttempts = () => {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const {
    data: orgData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminRequestPage"],
    queryFn: () => GET("/admin/user-plans/organization"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  function onOpen(val: any) {
    setIsInfoDialogOpen(true);
    setSelectedInquiry(val);
  }

  return (
    <div>
      <Toaster richColors position="top-right" closeButton />
      <div>
        <TopComponentWithHeading
          title="Organization Requests"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="my-8 flex justify-between">
        <p className="mt-4 pl-4 text-[18px] font-semibold">
          Request Count {orgData?.data?.count}
        </p>
      </div>
      <div className="mt-5 px-4">
        <Table>
          <TableCaption>A list of organizations attempts.</TableCaption>
          <TableHeader>
            <TableRow className="bg-ac-1 hover:bg-ac-1">
              <TableHead className="text-ac-2">Organization Name</TableHead>
              <TableHead className="text-ac-2">User Name</TableHead>
              <TableHead className="text-ac-2">Email</TableHead>
              <TableHead className="text-ac-2">Phone Number</TableHead>
              <TableHead className="text-ac-2">Status</TableHead>
              <TableHead className="text-right text-ac-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgData?.data?.userPlans.map((orgs: any, index: number) => {
              return (
                <TableRow key={index} className="capitalize">
                  <TableCell>{orgs?.User?.Organization?.name}</TableCell>
                  <TableCell>{orgs?.User?.name}</TableCell>
                  <TableCell className="lowercase">
                    {orgs?.User?.email}
                  </TableCell>
                  <TableCell>{orgs?.User?.number}</TableCell>
                  <TableCell>{orgs?.Role?.name}</TableCell>
                  <TableCell>{orgs?.status}</TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => onOpen(orgs)}>Update</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <InfoModal
        path={"attempt"}
        refetch={refetch}
        orgInfo={selectedInquiry}
        isInfoDialogOpen={isInfoDialogOpen}
        setIsInfoDialogOpen={setIsInfoDialogOpen}
      />
    </div>
  );
};

export default UpdateAttempts;
