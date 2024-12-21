import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import paymentsData from "../../mock_data/mock_guide_payments.json";

const GUIDES_PER_PAGE = 5;

interface GuidePayment {
    guide: {
        id: number;
        name: string;
        iban: string;
        bank: string;
    };
    unpaid_hours: number;
    debt: number;
    money_paid: number;
}

const GuidePayments: React.FC = () => {
    const navigate = useNavigate();
    const [guidePayments, setGuidePayments] = useState<GuidePayment[]>([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setGuidePayments(paymentsData);
    }, []);

    const filteredPayments = guidePayments.filter((payment) => {
        if (filter === "all") return true;
        if (filter === "unpaid") return payment.debt > 0;
        if (filter === "paid") return payment.debt === 0;
        return true;
    });

    const totalPages = Math.ceil(filteredPayments.length / GUIDES_PER_PAGE);
    const paginatedPayments = filteredPayments.slice(
        (currentPage - 1) * GUIDES_PER_PAGE,
        currentPage * GUIDES_PER_PAGE
    );
    
    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setGuidePayments(paymentsData);
        } else {
            const filtered = paymentsData.filter((payment) =>
                payment.guide.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setGuidePayments(filtered);
        }
    };

    const handlePageChange = (direction: string) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePayDebt = (guideId: number) => {
        setGuidePayments((prevPayments) =>
            prevPayments.map((payment) =>
                payment.guide.id === Number(guideId)
                    ? { ...payment, debt: 0, unpaid_hours: 0, money_paid: payment.money_paid + payment.debt }
                    : payment
            )
        );

        // Update the JSON data
        const updatedPayments = paymentsData.map((payment) =>
            payment.guide.id === Number(guideId)
                ? { ...payment, debt: 0, unpaid_hours: 0, money_paid: payment.money_paid + payment.debt }
                : payment
        );

        saveUpdatedPayments(updatedPayments);
    };

    const saveUpdatedPayments = (updatedPayments: GuidePayment[]) => {
        // For the purpose of this example, we'll use localStorage to save the data
        localStorage.setItem('guidePayments', JSON.stringify(updatedPayments));
    };

    const handleDetails = (guideId: string) => {
        navigate(`/payment-detail/${guideId}`);
    };

    return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h1 style={{ fontSize: "2.5em", color: "blue", textAlign: "center" }}><b>Guide Payments</b></h1>
    <div style={{ height: "20px" }}></div>
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                padding: "10px",
                width: "60%",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
            }}
        />
        <button
            onClick={handleSearch}
            style={{
                padding: "10px 15px",
                marginLeft: "10px",
                borderRadius: "4px",
                background: "#5c6bc0",
                color: "#fff",
                border: "none",
            }}
        >
            Search
        </button>
    </div>
    
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
            All
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
            Paid
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
            Unpaid
        </button>
        <button
            style={{
            padding: "10px 15px",
            border: "none",
            background: "pink",
            color: "black",
            borderRadius: "4px",
            float: "right",
            }}
        >
            Pay All Debts
        </button>
        <button
            style={{
            marginRight: "10px",
            padding: "10px 15px",
            border: "none",
            background: "pink",
            color: "black",
            borderRadius: "4px",
            float: "right",
            }}
        >
            Change Hourly Rate
        </button>
    </div>

    <div style={{ marginTop: "20px" }}>
        {paginatedPayments.length === 0 ? (
            <p style={{ textAlign: "center", color: "red" }}>No record found.</p>
        ) : (
            paginatedPayments.map((payment) => (
                <div
                    key={payment.guide.id}
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
                        <h1><b>{payment.guide.name}</b></h1>
                        <p><b>Guide ID: </b> {payment.guide.id}</p>
                        <p><b>Guide IBAN: </b> {payment.guide.iban}</p>
                        <p><b>Guide Bank: </b> {payment.guide.bank}</p>
                        <p><b>Unpaid Hours: </b>{payment.unpaid_hours}</p>
                        <p><b>Debt: </b>{payment.debt}</p>
                        <p><b>Total Amount Paid: </b>{payment.money_paid}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        onClick={() => handleDetails(payment.guide.id.toString())}
                        style={{
                            padding: "20px 60px",
                            background: "#5c6bc0",
                            color: "#fff",
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1.2em",
                        }}
                    >
                        Payment Details
                    </button>
                    {payment.debt > 0 && (
                        <button
                            onClick={() => handlePayDebt(payment.guide.id)}
                            style={{
                                padding: "20px 60px",
                                background: "#f44336",
                                color: "#fff",
                                border: "none",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1.2em",
                            }}
                        >
                            Pay Total Debt
                        </button>
                    )}
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

export default GuidePayments;