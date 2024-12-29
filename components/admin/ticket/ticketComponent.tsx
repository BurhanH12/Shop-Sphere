import { useQuery } from "@tanstack/react-query";
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
import { GET } from "@/server/clientController/auth/auth";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";

const TicketComponent = () => {
  const router = useRouter();
  const {
    data: ticketData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-ticket"],
    queryFn: () => GET("/admin/organization-tickets"),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });

  if (isLoading || isFetching) {
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
      <div>
        <TopComponentWithHeading
          title="Organization Tickets"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="my-8 flex justify-between">
        <p className="mt-4 pl-4 text-[18px] font-semibold">
          Ticket Count {ticketData?.data?.count}
        </p>
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
              <TableHead className="text-ac-2">Open Query DetailsTickets</TableHead>
              <TableHead className="text-right text-ac-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ticketData?.data?.data.map((requests: any, index: number) => {
              return (
                <TableRow key={index} className="capitalize">
                  <TableCell>{requests?.Organization?.name}</TableCell>
                  <TableCell>{requests?.full_name}</TableCell>
                  <TableCell className="lowercase">{requests?.email}</TableCell>
                  <TableCell>{requests?.number}</TableCell>
                  <TableCell>{requests?.Role?.name}</TableCell>
                  <TableCell>{requests?.UserTickets?.length}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      disabled={requests?.status === "accepted"}
                      onClick={() =>
                        router.push(`/admin/query/${requests.Organization?.id}`)
                      }
                    >
                      View Requests
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TicketComponent;
