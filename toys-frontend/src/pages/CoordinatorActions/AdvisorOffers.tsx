import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import offersData from "../../mock_data/mock_advisor_offers.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdvisorOffers.css"

const OFFERS_PER_PAGE = 5;

interface Offer {
    id: string;
    high_school: string;
    phone: string;
    major: string;
    experience: string;
    fullname: string;
    status: string;
    rejection_explanation: string;
    date_of_offer: string;
    date_of_decision: string;
}

const AdvisorOffers = () => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    

    useEffect(() => {
        // Load data from the JSON file
        setOffers(offersData);
    }, []);

    const filteredOffers = offers.filter((offer) => {
        if (filter === "all") return true;
        return offer.status === filter;
    });

    const totalPages = Math.ceil(filteredOffers.length / OFFERS_PER_PAGE);

    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * OFFERS_PER_PAGE,
        currentPage * OFFERS_PER_PAGE
    );

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setOffers(offersData);
        } else {
            const filtered = offersData.filter((offer) =>
                offer.fullname.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setOffers(filtered);
        }
    };

    const handlePageChange = (direction: string) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDateFilter = () => {
        if (startDate && endDate) {
            const filtered = offersData.filter((offer) => {
                const offerDate = new Date(offer.date_of_offer);
                return offerDate >= startDate && offerDate <= endDate;
            });
            setOffers(filtered);
        } else {
            setOffers(offersData);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ fontSize: "2.5em", color: "blue", textAlign: "center" }}><b>Advisor Offers</b></h1>
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
            
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
    <div style={{ display: "inline-block", position: "relative" }}>
        <span style={{ marginRight: "10px", fontWeight: "bold", color: "blue", fontSize: "1.5em" }}>Select a range for the date the offer was made:</span><DatePicker
            selected={startDate}
            onChange={(date) => {
                setStartDate(date);
                setEndDate(null); // Reset end date when start date changes
            }}
            selectsStart
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            placeholderText="From Date"
            isClearable
            dateFormat="yyyy/MM/dd"
            className="custom-datepicker"
        />
    </div>
    <div style={{ display: "inline-block", position: "relative", marginLeft: "10px" }}>
        <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            minDate={startDate || undefined}
            placeholderText="To Date"
            isClearable
            dateFormat="yyyy/MM/dd"
            className="custom-datepicker custom-datepicker-end"
        />
    </div>
    <button
        onClick={handleDateFilter}
        style={{
            padding: "10px 15px",
            marginLeft: "10px",
            borderRadius: "8px", /* Rounded button */
            background: "#5c6bc0",
            color: "#fff",
            border: "none",
            cursor: "pointer",
        }}
    >
        Filter by Date
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
                    onClick={() => setFilter("accepted")}
                    style={{
                        padding: "10px 15px",
                        marginRight: "10px",
                        border: "none",
                        background: filter === "accepted" ? "#4caf50" : "#f1f1f1",
                        color: filter === "accepted" ? "#fff" : "#000",
                        borderRadius: "4px",
                    }}
                >
                    Accepted
                </button>
                <button
                    onClick={() => setFilter("rejected")}
                    style={{
                        padding: "10px 15px",
                        marginRight: "10px",
                        border: "none",
                        background: filter === "rejected" ? "#f44336" : "#f1f1f1",
                        color: filter === "rejected" ? "#fff" : "#000",
                        borderRadius: "4px",
                    }}
                >
                    Rejected
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    style={{
                        padding: "10px 15px",
                        border: "none",
                        background: filter === "pending" ? "#ff9800" : "#f1f1f1",
                        color: filter === "pending" ? "#fff" : "#000",
                        borderRadius: "4px",
                    }}
                >
                    Pending
                </button>
            </div>

            <div style={{ marginTop: "20px" }}>
                {paginatedOffers.length === 0 ? (
                    <p style={{ textAlign: "center", color: "red" }}>No record found.</p>
                ) : (
                    paginatedOffers.map((offer) => (
                        <div
                            key={offer.id}
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
                                <h1><b>{offer.fullname}</b></h1>
                                <p><b>Date of Offer:</b> {offer.date_of_offer}</p>
                                <p><b>Date of Response:</b> {offer.date_of_decision}</p>
                                <p><b>High School:</b> {offer.high_school}</p>
                                <p><b>Major: </b>{offer.major}</p>
                                {offer.status === "rejected" && (
                                    <div>
                                        <p>
                                        <b>Status of Offer:</b>{" "}
                                            <span style={{ color: "red", fontWeight:"bold", textTransform: "uppercase" }}>
                                                {offer.status}
                                            </span>
                                        </p>
                                        <p>
                                        <b>Rejection Reason:</b>{" "}
                                            <span>
                                                {offer.rejection_explanation}
                                            </span>
                                        </p>
                                    </div>
                                )}
                                {offer.status === "accepted" && (
                                    <p>
                                        <b>Status of Offer:</b>{" "}
                                        <span style={{ color: "green", fontWeight:"bold", textTransform: "uppercase" }}>
                                            {offer.status}
                                        </span>
                                    </p>
                                )}
                                {offer.status === "pending" && (
                                    <p>
                                        <b>Status of Offer:</b>{" "}
                                        <span style={{ color: "orange", fontWeight:"bold", textTransform: "uppercase" }}>
                                            {offer.status}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div>
                                <button
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
                                    View Profile
                                </button>
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
        </div>
    );
};

export default AdvisorOffers;