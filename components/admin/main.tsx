import { useState } from "react";
import { GET } from "@/server/clientController/auth/auth";
import { useAppSelector } from "@/store/hooks";
import { useQuery } from "@tanstack/react-query";
import Loader from "../ui/loader";
import Error from "@/pages/error";
import TopComponentWithHeading from "../dashboard/reusableComponents/topComponentWithHeading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import InfoModal from "./infoModal";
import { Toaster } from "sonner";
import AddModal from "./addUserModal/addModal";
const Main = () => {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState<boolean>(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState<any>();
  const [isContactDialogOpen, setisContactDialogOpen] =
    useState<boolean>(false);

  const {
    data: requestData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminIndexPage"],
    queryFn: () => GET("/admin/requests"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  const {
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    isError: isPlansError,
    error: planError,
    data: plansData,
    refetch: planRefetch,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: () => GET("/home/plans"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });

  const {
    isLoading: rolesLoading,
    isError: rolesIsError,
    error: rolesError,
    data: rolesData,
    refetch: rolesRefetch,
  } = useQuery({
    queryKey: [`roles`],
    queryFn: () => GET("/users/roles"),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 3,
  });

  function onOpen(val: any) {
    setIsInfoDialogOpen(true);
    setSelectedInquiry(val);
  }

  if (isLoading || isPlansLoading || isFetching) {
    return (
      <div className="item-center flex h-[100%] w-[100%] justify-center">
        <Loader size={60} />
      </div>
    );
  }
  if (isError) {
    <div>
      <Error error={error} reset={refetch} />
    </div>;
  }

  return (
    <div className="h-[100%] w-[100%]">
      <Toaster richColors position="top-right" closeButton />
      <div>
        <TopComponentWithHeading
          title="Organization Requests"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="my-8 flex justify-between">
        <p className="mt-4 pl-4 text-[18px] font-semibold">
          Request Count {requestData?.data?.count}
        </p>
        <Button
          className="rounded-md bg-ac-1"
          onClick={() => setisContactDialogOpen(true)}
        >
          Add New
        </Button>
      </div>
      <div className="mt-5 px-4">
        <Table>
          <TableCaption>A list of organization requests.</TableCaption>
          <TableHeader>
            <TableRow className="bg-ac-1 hover:bg-ac-1">
              <TableHead className="text-ac-2">Organization Name</TableHead>
              <TableHead className="text-ac-2">User Name</TableHead>
              <TableHead className="text-ac-2">Email</TableHead>
              <TableHead className="text-ac-2">Phone Number</TableHead>
              <TableHead className="text-ac-2">Role</TableHead>
              <TableHead className="text-ac-2">Status</TableHead>
              <TableHead className="text-right text-ac-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestData?.data?.requests.map((requests: any, index: number) => {
              return (
                <TableRow key={index} className="capitalize">
                  <TableCell>{requests?.org_name}</TableCell>
                  <TableCell>{requests?.name}</TableCell>
                  <TableCell className="lowercase">{requests?.email}</TableCell>
                  <TableCell>{requests?.number}</TableCell>
                  <TableCell>{requests?.Role?.name}</TableCell>
                  <TableCell>{requests?.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={requests?.status === "accepted"}
                      onClick={() => onOpen(requests)}
                    >
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <InfoModal
        refetch={refetch}
        orgInfo={selectedInquiry}
        isInfoDialogOpen={isInfoDialogOpen}
        setIsInfoDialogOpen={setIsInfoDialogOpen}
      />
      <AddModal
        isContactDialogOpen={isContactDialogOpen}
        setisContactDialogOpen={setisContactDialogOpen}
        plans={plansData}
        rolesData={rolesData}
        refetch={refetch}
        path={"admin"}
      />
    </div>
  );
};

export default Main;
