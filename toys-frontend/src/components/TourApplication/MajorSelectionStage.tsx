import React, { useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { IndividualApplicationStageProps } from '../../types/designed';
import majorOptions from "../../mock_data/mock_majors.json"

const MajorSelectionStage: React.FC<IndividualApplicationStageProps> = ({
  applicationInfo,
  setApplicationInfo,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (index: number): void => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleMajorSelect = (index: number, selectedMajor: string): void => {
    const newMajorChoices = [...applicationInfo.requested_majors];
    if (newMajorChoices.includes(selectedMajor)) {
      return;
    }
    newMajorChoices[index] = selectedMajor;
    setApplicationInfo((prevInfo) => ({
      ...prevInfo,
      requested_majors: newMajorChoices,
    }));
    setOpenDropdown(null);
  };

  return (
    <div className="w-full max-w-md space-y-2 p-4">
      <h1 className='header text-3xl font-semibold mb-2'>Rehber Bölüm Tercihi<br/></h1>
      <h2 className='subheader mb-4'>Garanti vermemekle birlikte turunuz için seçtiğiniz bölümden bir rehber ayarlamaya çalışacağız. (Bir tercihiniz yoksa bu aşamayı atlayabilirsiniz.)</h2>
      {applicationInfo.requested_majors.map((major, index) => (
        <div key={index} className="">
          <button
            onClick={() => toggleDropdown(index)}
            className="w-full flex items-center justify-between px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center space-x-2">
              <span className="text-gray-700 font-medium">
                {index === 0 ? 'Birinci Seçim' : index === 1 ? 'İkinci Seçim' : 'Üçüncü Seçim'}
              </span>
              <span className="text-gray-500">{major}</span>
            </div>
            <IconChevronDown
              className={`w-5 h-5 transition-transform ${
                openDropdown === index ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openDropdown === index && (
            <div className="absolute z-10 max-w-80 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="py-1">
                {majorOptions.filter((option) => !applicationInfo.requested_majors.includes(option)).map((option) => (
                  <button
                    key={option}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => handleMajorSelect(index, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MajorSelectionStage;