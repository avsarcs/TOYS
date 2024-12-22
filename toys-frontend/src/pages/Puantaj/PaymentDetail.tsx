import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import defaultPayment from "../../mock_data/mock_tour_guide_payments.json";
import { MoneyForEvent, SimpleGuide } from "../../types/designed";
import { UserContext } from "../../context/UserContext";
import { notifications } from "@mantine/notifications";

const RECORDS_PER_PAGE = 5;


const PaymentDetail: React.FC = () => {
    const navigate = useNavigate();
    const [tourPayments, setTourPayments] = useState<MoneyForEvent[]>(defaultPayment);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const { guideId } = useParams<{ guideId: string }>();
    const [guide, setGuide] = useState<SimpleGuide | null>(null);
    const userContext = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPayments().catch((reason) => {
            console.error(reason);
        });
    }, [guideId]);
    useEffect(() => {
        getGuide().catch((reason) => {
            console.error(reason);
        });
    }, [guideId]);

    const formatISODate = (isoDate: string | number | Date) => {
        const date = new Date(isoDate);
    
        // Convert to time zone-adjusted string
        return date.toLocaleString("en-GB", {
            timeZone: "UTC", // Adjust time to your desired time zone (e.g., "Europe/London", "America/New_York")
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23", // Use 24-hour time format
        });
    };
    
    const getGuide = useCallback(async () => {
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/user/profile/simple");
        try
        {
            if (guideId) {
                url.searchParams.append("id", guideId);
            }
            url.searchParams.append("auth", await userContext.getAuthToken());
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
    },[userContext.getAuthToken]);

    const getPayments = useCallback(async () => {
        setLoading(true);
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/management/timesheet/payment-state/event");
        try
        {
            if (guideId) {
                url.searchParams.append("guide_id", guideId);
            }
            url.searchParams.append("auth", await userContext.getAuthToken());
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
        finally
        {
            setLoading(false);
        }
    },[userContext.getAuthToken]);

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
        <div style={{ position: "relative" }}>
        {/* Loading Spinner Overlay */}
        {loading && (
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    backdropFilter: "blur(5px)",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div
                        style={{
                            width: "50px",
                            height: "50px",
                            border: "6px solid #ccc",
                            borderTop: "6px solid #007bff",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }}
                    ></div>
                    <p style={{ marginTop: "10px", fontSize: "1.2em", color: "#007bff" }}>
                        Yükleniyor...
                    </p>
                </div>
            </div>
        )}
    
        {/* Main Content */}
        <div
            style={{
                filter: loading ? "blur(5px)" : "none",
                pointerEvents: loading ? "none" : "auto",
            }}
        >
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
                    Tüm Rehberler
                </button>
                <h1 style={{ fontSize: "2.5em", color: "blue", textAlign: "center" }}>
                    <b>Rehber Ödemeleri</b>
                </h1>
                <h2 style={{ fontSize: "1.5em", textAlign: "center", color: "black" }}>
                    <p>
                        <b>Şu rehber için ödemeleri görüntülüyorsunuz: </b>
                        {guide ? guide.name + " " : "Bilinmeyen Rehber"}
                    </p>
                </h2>
    
                <div style={{ height: "20px" }}></div>
    
                <div>
                    <button
                        onClick={() => setFilter("all")}
                        style={{
                            padding: "10px 15px",
                            marginRight: "10px",
                            border: "none",
                            background: filter === "all" ? "#d7bde2" : "#f1f1f1",
                            color: filter === "all" ? "#6a1b9a" : "#000",
                            borderRadius: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        Tüm Etkinlikler
                    </button>
                    <button
                        onClick={() => setFilter("paid")}
                        style={{
                            padding: "10px 15px",
                            marginRight: "10px",
                            border: "none",
                            background: filter === "paid" ? "#a5d6a7" : "#f1f1f1",
                            color: filter === "paid" ? "#388e3c" : "#000",
                            borderRadius: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        Ödenmiş Etkinlikler
                    </button>
                    <button
                        onClick={() => setFilter("unpaid")}
                        style={{
                            padding: "10px 15px",
                            marginRight: "10px",
                            border: "none",
                            background: filter === "unpaid" ? "#ef9a9a" : "#f1f1f1",
                            color: filter === "unpaid" ? "#d32f2f" : "#000",
                            borderRadius: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        Ödenmemiş Etkinlikler
                    </button>
                </div>
    
                <div style={{ marginTop: "20px" }}>
                    {paginatedPayments.length === 0 ? (
                        <p style={{ textAlign: "center", color: "red" }}>Hiçbir kayıt bulunamadı.</p>
                    ) : (
                        paginatedPayments.map((payment) => (
                            <div
                                key={payment.event_id}
                                style={{
                                    padding: "20px",
                                    marginBottom: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "20px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                    fontSize: "1.2em",
                                }}
                            >
                                <div>
                                    <p>
                                        <b>Etkinlik Tipi: </b>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    payment.event_type === "TOUR"
                                                        ? "#ffcc80"
                                                        : "#90caf9",
                                                color:
                                                    payment.event_type === "TOUR"
                                                        ? "#e65100"
                                                        : "#1e88e5",
                                                padding: "5px 10px",
                                                borderRadius: "10px",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {payment.event_type === "TOUR" ? "Tur" : "Fuar"}
                                        </span>
                                    </p>
                                    <p>
                                        <b>Lise: </b>
                                        {payment.event_highschool.name}
                                    </p>
                                    <p>
                                        <b>Etkinlik ID: </b>
                                        {payment.event_id}
                                    </p>
                                    <p>
                                        <b>Etkinlik Tarihi: </b>
                                        {formatISODate(payment.event_date)}
                                    </p>
                                    <p>
                                        <b>Saatlik Maaş: </b>
                                        {payment.hourly_rate}
                                    </p>
                                    <p>
                                        <b>Çalışılan Saatler: </b>
                                        {payment.hours_worked}
                                    </p>
                                    <p>
                                        <b>Borç: </b>
                                        {payment.money_debted}
                                    </p>
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
                        Önceki Sayfa
                    </button>
                    <span>
                        Sayfa {currentPage} / {totalPages}
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
                        Sonraki Sayfa
                    </button>
                </div>
            </div>
        </div>
    </div>
     );
};

export default PaymentDetail;