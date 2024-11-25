import React from 'react';
import advisorApplications from "../../mock_data/mock_simple_toys_applications1.json"
import traineeApplications from "../../mock_data/mock_simple_toys_applications2.json"
import { Tabs } from '@mantine/core';
import ApplicationCard from '../../components/ApplicationCard/ApplicationCard';
import { useNavigate } from 'react-router-dom';

const ToysApplications: React.FC = () => {

  const navigate = useNavigate()

  const handleGuidePageClick = (id: string) => {
    console.log('Guide Page clicked for id:', id);
  };
  const handleApproveClick = (id: string) => {
    console.log('Approve clicked for id:', id);
  };
  const handleRejectClick = (id: string) => {
    console.log('Reject clicked for id:', id);
  };

  const handleTraineeViewClick = (id: string) => {
    navigate(`/trainee-application-details/${id}`)
    console.log('View clicked for id:', id);
  };

  const handleAdvisorViewClick = (id: string) => {
    navigate(`/advisor-application-details/${id}`)
    console.log('View clicked for id:', id);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Applications</h1>
      
      <Tabs defaultValue="advisor" className="mb-4 sm:mb-6">
        <Tabs.List className="overflow-x-auto flex-nowrap whitespace-nowrap">
          <Tabs.Tab
            value="advisor"
            className="font-medium px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
          >
            Advisor Applications
          </Tabs.Tab>
          <Tabs.Tab
            value="trainee"
            className="font-medium px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
          >
            Trainee Guide Applications
          </Tabs.Tab>
        </Tabs.List>

        <div className="mt-4">
          <Tabs.Panel value="advisor">
            <div className="space-y-3 sm:space-y-4">
              {advisorApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onGuidePageClick={handleGuidePageClick}
                  onApproveClick={handleApproveClick}
                  onRejectClick={handleRejectClick}
                  onViewClick={handleAdvisorViewClick}
                />
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="trainee">
            <div className="space-y-3 sm:space-y-4">
              {traineeApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  variant="alternate"
                  application={application}
                  onGuidePageClick={handleGuidePageClick}
                  onApproveClick={handleApproveClick}
                  onRejectClick={handleRejectClick}
                  onViewClick={() => {handleTraineeViewClick(application.id)}}
                />
              ))}
            </div>
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
};

export default ToysApplications;