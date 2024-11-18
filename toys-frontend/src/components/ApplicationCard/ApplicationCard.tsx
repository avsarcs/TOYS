import { SimpleToysApplication } from "../../types/designed";
import { Button } from "@mantine/core";

interface ApplicationCardProps {
  application: SimpleToysApplication;
  onGuidePageClick?: (id: string) => void;
  onApproveClick?: (id: string) => void;
  onRejectClick?: (id: string) => void;
  onViewClick?: (id: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onGuidePageClick,
  onApproveClick,
  onRejectClick,
  onViewClick
}) => (
  <div className="bg-blue-50 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex-1 w-full sm:w-auto">
        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
          {application.fullname}
        </h3>
        <div className="text-sm text-gray-600 mt-1">
          <span>Experience: {application.experience}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
        <div className="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
          <Button
            variant="light"
            color="black"
            className="bg-rose-200 hover:bg-rose-300 text-rose-700 text-xs sm:text-sm"
            size="sm"
            onClick={() => onGuidePageClick?.(application.id)}
          >
            Guide Page
          </Button>
          <Button
            variant="light"
            color="dark-green"
            className="bg-green-100 hover:bg-green-200 text-green-700 text-xs sm:text-sm"
            size="sm"
            onClick={() => onApproveClick?.(application.id)}
          >
            Approve
          </Button>
          <Button
            variant="light"
            color="black"
            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs sm:text-sm"
            size="sm"
            onClick={() => onRejectClick?.(application.id)}
          >
            Reject
          </Button>
          <Button
            variant="light"
            color="black"
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs sm:text-sm"
            size="sm"
            onClick={() => onViewClick?.(application.id)}
          >
            View Application
          </Button>
        </div>
      </div>
    </div>
  </div>
);