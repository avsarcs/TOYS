import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import defaultPayment from "../../mock_data/mock_tour_guide_payments.json";
import { MoneyForTour, SimpleGuide } from "../../types/designed";
import { UserContext } from "../../context/UserContext";
import { notifications } from "@mantine/notifications";

const RECORDS_PER_PAGE = 5;


const PaymentDetail: React.FC = () => {
    const navigate = useNavigate();
    const [tourPayments, setTourPayments] = useState<MoneyForTour[]>(defaultPayment);
    const [guide, setGuide] = useState<SimpleGuide>();
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const { guideId } = useParams<{ guideId: string }>();
    const userContext = useContext(UserContext);

    useEffect(() => {
        getPayments().catch((reason) => {
            console.error(reason);
        });
    }, [guideId]);

    const getName = useCallback(async () => {
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/user/profile/simple");
        try
        {
            if (guideId) {
                url.searchParams.append("id", guideId);
            }
            url.searchParams.append("auth", userContext.authToken);
            const res = await fetch(url, {
                method: "GET",
            });
            if (!res.ok) {
                notifications.show({
                    color: "red",
                    title: "Hata",
                    message: "İsim alınamıyor."
                });
            }
            else {
                const resText = await res.text();
                const resJson = JSON.parse(resText);
                setGuide(resJson);

            }
        }
        catch (e)
        {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    },[userContext.authToken]);

    const getPayments = useCallback(async () => {
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/management/timesheet/payment-state/tour");
        try
        {
            if (guideId) {
                url.searchParams.append("guide_id", guideId);
            }
            url.searchParams.append("auth", userContext.authToken);
            const res = await fetch(url, {
                method: "GET",
            });
            if (!res.ok) {
                notifications.show({
                    color: "red",
                    title: "Hata",
                    message: "Turlar görüntülenemiyor."
                });
            }
            else {
                const resText = await res.text();
                const resJson = JSON.parse(resText);
                setTourPayments(resJson);

            }
        }
        catch (e)
        {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    },[userContext.authToken]);

    const filteredPayments = tourPayments.filter((payment) => {
        if (filter === "all") return true;
        if (filter === "unpaid") return payment.money_debted > 0;
        if (filter === "paid") return payment.money_debted === 0;
        return true;
    });

    const totalPages = Math.ceil(filteredPayments.length / RECORDS_PER_PAGE);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * RECORDS_PER_PAGE,
        currentPage * RECORDS_PER_PAGE
    );

    
    const handlePageChange = (direction: string) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const handleBackToGuides = () => {
        navigate("/guide-payments");
    };

    return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <button
                        onClick={() => handleBackToGuides()}
                        style={{
                            padding: "10px 30px",
                            background: "#5c6bc0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1.2em",
                        }}
                    >
                        Back to All Guides
                    </button>
    <h1 style={{ fontSize: "2.5em", color: "blue", textAlign: "center" }}><b>Guide Payments</b></h1>
    <h2 style={{ fontSize: "1.5em", textAlign: "center", color: "black" }}>
        <b>Viewing payments for guide: </b>{tourPayments.length > 0 ? guide?.name : "Unknown"}
    </h2>
    <div style={{ height: "20px" }}></div>
    
    <div>
        <button
            onClick={() => setFilter("all")}
            style={{
                padding: "10px 15px",
                marginRight: "10px",
                border: "none",
                background: filter === "all" ? "#5c6bc0" : "#f1f1f1",
                color: filter === "all" ? "#fff" : "#000",
                borderRadius: "4px",
            }}
        >
            All Tours
        </button>
        <button
            onClick={() => setFilter("paid")}
            style={{
                padding: "10px 15px",
                marginRight: "10px",
                border: "none",
                background: filter === "paid" ? "#4caf50" : "#f1f1f1",
                color: filter === "paid" ? "#fff" : "#000",
                borderRadius: "4px",
            }}
        >
            Paid Tours
        </button>
        <button
            onClick={() => setFilter("unpaid")}
            style={{
                padding: "10px 15px",
                marginRight: "10px",
                border: "none",
                background: filter === "unpaid" ? "#f44336" : "#f1f1f1",
                color: filter === "unpaid" ? "#fff" : "#000",
                borderRadius: "4px",
            }}
        >
            Unpaid Tours
        </button>
    </div>

    <div style={{ marginTop: "20px" }}>
        {paginatedPayments.length === 0 ? (
            <p style={{ textAlign: "center", color: "red" }}>No record found.</p>
        ) : (
            paginatedPayments.map((payment) => (
                <div
                    key={guideId}
                    style={{
                        padding: "20px",
                        marginBottom: "10px",
                        border: "1px solid #ccc",

                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "lightblue", 
                        borderRadius: "8px", 

                    }}
                >
                    <div>
                        <p><b>Tour Highschool: </b>{payment.tour_highschool}</p>
                        <p><b>Tour ID: </b>{payment.tour_id}</p>
                        <p><b>Tour Date: </b>{payment.tour_date}</p>
                        <p><b>Hourly Rate: </b>{payment.hourly_rate}</p>
                        <p><b>Hours Worked: </b>{payment.hours_worked}</p>
                        <p><b>Money Debted: </b>{payment.money_debted}</p>
                    </div>
                    
                </div>
            ))
        )}
    </div>

    {/* Pagination Controls */}
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
        }}
    >
        <button
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
            style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginRight: "10px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                background: currentPage === 1 ? "#f1f1f1" : "#fff",
            }}
        >
            Previous
        </button>
        <span>
            Page {currentPage} of {totalPages}
        </span>
        <button
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
            style={{
                padding: "10px 15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                marginLeft: "10px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                background: currentPage === totalPages ? "#f1f1f1" : "#fff",
            }}
        >
            Next
        </button>
    </div>
</div> );
};

export default PaymentDetail;