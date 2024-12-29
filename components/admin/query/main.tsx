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
import Loader from "@/components/ui/loader";
import Error from "@/pages/error";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/server/clientController/auth/auth";
import TopComponentWithHeading from "@/components/dashboard/reusableComponents/topComponentWithHeading";
import { formatDate } from "@/utils/helper";

const QueryComponent = () => {
  const {
    data: queryData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-query"],
    queryFn: () => GET("/admin/queries"),
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
          title="Support Queries"
          description="Here is the latest details...Check Now!"
        />
      </div>
      <div className="my-8 flex justify-between">
        <p className="mt-4 pl-4 text-[18px] font-semibold">
          Request Count {queryData?.data?.count}
        </p>
      </div>
      <div className="mt-5 px-4">
        <Table>
          <TableCaption>A list of support queries.</TableCaption>
          <TableHeader>
            <TableRow className="bg-ac-1 hover:bg-ac-1">
              <TableHead className="text-ac-2">Email</TableHead>
              <TableHead className="text-ac-2">Subject</TableHead>
              <TableHead className="text-ac-2">Body</TableHead>
              <TableHead className="text-ac-2">Created At</TableHead>
              <TableHead className="text-ac-2">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryData?.data?.data.map((requests: any, index: number) => {
              return (
                <TableRow key={index} className="capitalize">
                  <TableCell className="lowercase">{requests?.email}</TableCell>
                  <TableCell>{requests?.subject}</TableCell>
                  <TableCell>{requests?.body}</TableCell>
                  <TableCell>
                    {formatDate(String(requests?.created_at).split("T")[0])}
                  </TableCell>
                  <TableCell>{requests?.status}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QueryComponent;
