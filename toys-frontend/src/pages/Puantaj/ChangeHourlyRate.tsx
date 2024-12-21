import React, { useState, useCallback } from "react";
import { Button, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../../context/UserContext";
import { notifications } from "@mantine/notifications";

const ChangeHourlyRate: React.FC = () => {
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [appliedFrom, setAppliedFrom] = useState<Date | null>(null);
  const [appliedUntil, setAppliedUntil] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const navigate = useNavigate();
  const userContext = React.useContext(UserContext);

  // Function to format the date in ISO format with Turkish time zone (+03:00)
  const formatToTurkishISO = (date: Date): string => {
    const tzOffset = 180; // Turkish time zone offset in minutes (+03:00)
    const adjustedDate = new Date(date.getTime() + tzOffset * 60000);
    return adjustedDate.toISOString().replace("Z", "+03:00");
  };

  const getInfo = useCallback(
    async (rate: number, appliedFrom: Date | null, appliedUntil: Date | null) => {
      setLoading(true);
      const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
      const url = new URL(apiURL + "internal/management/timesheet/hourly-rate");

      const hourlyRateModel = {
        rate,
        applied_from: appliedFrom ? formatToTurkishISO(appliedFrom) : null,
        applied_until: appliedUntil ? formatToTurkishISO(appliedUntil) : "TODAY",
      };

      try {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userContext.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hourlyRateModel),
        });

        if (!res.ok) {
          notifications.show({
            color: "red",
            title: "Hata",
            message: "Saatlik ücret verileri gönderilemedi.",
          });
        } else {
          const resJson = await res.json();
          notifications.show({
            color: "green",
            title: "Başarılı",
            message: "Saatlik ücret güncellendi.",
          });
          console.log("Response Data:", resJson); // Debugging
          navigate("/guide-payments"); // Redirect after successful update
        }
      } catch (e) {
        notifications.show({
          color: "red",
          title: "Hay aksi!",
          message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin.",
        });
      } finally {
        setLoading(false);
      }
    },
    [userContext.authToken, navigate]
  );

  const handleUpdateHourlyRate = () => {
    if (!hourlyRate || !appliedFrom || !appliedUntil) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null); // Clear previous errors
    getInfo(hourlyRate, appliedFrom, appliedUntil);
  };

  return (
    <div className="update-hourly-rate-wrapper p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Hourly Rate</h1>
      <div className="form-group mb-4">
        <label className="block text-gray-700">Hourly Rate (TL):</label>
        <input
          type="number"
          value={hourlyRate || ""} // Ensure value is a number or empty string
          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} // Default to 0 if input is invalid
          className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="form-group">
        <label>Applied From:</label>
        <br />
        <DatePicker
          selected={appliedFrom}
          onChange={(date: Date | null) => setAppliedFrom(date)}
          dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
          className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Select start date"
        />
      </div>
      <br />
      <div className="form-group mb-4">
        <label className="block text-gray-700">Applied Until:</label>
        <DatePicker
          selected={appliedUntil}
          onChange={(date: Date | null) => setAppliedUntil(date)}
          dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSSXXX"
          className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholderText="Select end date"
        />
      </div>
      <Button
        className="update-button w-full bg-blue-200 hover:bg-blue-300 text-blue-800 rounded-full py-2 mb-4"
        onClick={handleUpdateHourlyRate}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Updating..." : "Update Hourly Rate"}
      </Button>
      {error && (
        <Alert
          variant="light"
          color="red"
          title="Error"
          icon={<IconAlertCircle />}
          className="my-4"
        >
          {error}
        </Alert>
      )}
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
