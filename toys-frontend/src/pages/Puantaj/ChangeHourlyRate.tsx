import React, { useState } from 'react';
import { Button, Alert } from '@mantine/core';
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { UserContext } from '../../context/UserContext';

const HOURLY_RATE_URL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS + "/internal/management/timesheet/hourly-rate");

const ChangeHourlyRate:React.FC = () => {
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [appliedFrom, setAppliedFrom] = useState<Date | null>(null);
    const [appliedUntil, setAppliedUntil] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const userContext = React.useContext(UserContext);
    

    const handleUpdateHourlyRate = async () => {
        try {
            const hourlyRateData = {
                rate: hourlyRate,
                applied_from: appliedFrom ? appliedFrom.toISOString() : "",
                applied_until: appliedUntil ? appliedUntil.toISOString() : ""
            };
            
            HOURLY_RATE_URL.searchParams.append("auth", userContext.authToken)
            const response = await fetch(HOURLY_RATE_URL.toString(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(hourlyRateData)

            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update hourly rate: ${response.status} ${response.statusText} - ${errorText}`);
            }
    
            navigate("/hourly-rate-success");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
            console.error("Error updating hourly rate:", error);
        }
    };

    return (
        <div className='update-hourly-rate-wrapper p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg'>
            <h1 className='text-2xl font-bold mb-6 text-center'>Update Hourly Rate</h1>
            <div className='form-group mb-4'>
                <label className='block text-gray-700'>Hourly Rate (TL):</label>
                <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
                    className='form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                />
            </div>
            <div className='form-group'>
                <label>Applied From:</label>
                <br></br>
                <DatePicker
                    selected={appliedFrom}
                    onChange={(date: Date | null) => setAppliedFrom(date)}
                    dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
                    className='form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholderText="Select start date"
                />
            </div>
            <br></br>
            <div className='form-group mb-4'>
                <label className='block text-gray-700'>Applied Until:</label>
                <DatePicker
                    selected={appliedUntil}
                    onChange={(date: Date | null) => setAppliedUntil(date)}
                    dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
                    className='form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                    placeholderText="Select end date"
                />
            </div>
            <Button
                className="update-button w-full bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full py-2 mb-4"
                onClick={handleUpdateHourlyRate}
            >
                Update Hourly Rate
            </Button>
            {error && <Alert variant="light" color="red" title="Error" icon={<IconAlertCircle />} className='my-4'>{error}</Alert>}
            <Button
                className="back-button w-full bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full py-2"
                onClick={() => navigate("/guide-payments")}
            >
                Back to Guide Payments
            </Button>
        </div>
    );
};

export default ChangeHourlyRate;