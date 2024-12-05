import React from 'react';
import traineeApplications from "../../mock_data/mock_simple_toys_applications2.json"
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">Acemi Rehber Başvuruları</h1>

        <div className="mt-4">
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
        </div>
    </div>
  );
};

export default ToysApplications;