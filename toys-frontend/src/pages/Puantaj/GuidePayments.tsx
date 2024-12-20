import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import defaultPayment from "../../mock_data/mock_guide_payments.json";
import { MoneyForGuide } from "../../types/designed";
import { UserContext } from "../../context/UserContext";
import { notifications } from "@mantine/notifications";
import { set } from "react-datepicker/dist/date_utils";


const GUIDES_PER_PAGE = 5;



const GuidePayments: React.FC = () => {
    const navigate = useNavigate();
    const [paymentsData, setPaymentsData] = useState<MoneyForGuide[]>(defaultPayment);
    const [filteredData, setFilteredData] = useState<MoneyForGuide[] | null>(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const userContext = useContext(UserContext);

    useEffect(() => {
        getInfo().catch((reason) => {
            console.error(reason);
        });
    }, []);


    const getInfo = useCallback( async() => {
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/management/timesheet/payment-state/guides");
        try 
        {
            url.searchParams.append("auth", userContext.authToken);
            url.searchParams.append("name", "");
            const res = await fetch(url, {
                method: "GET",
            });

            if (!res.ok) {
                notifications.show({
                    color: "red",
                    title: "Hata",
                    message: "Rehberler görüntülenemiyor."
                });
            }
            else {
                const resText = await res.text();
                const resJson = JSON.parse(resText);
                setPaymentsData(resJson);

            }
        }
        catch (e) {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    },[userContext.authToken]);

    const filteredPayments = (filteredData || paymentsData).filter((payment) => {
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
            setFilteredData(null); // Reset to show all data
        } else {
            const filtered = paymentsData.filter((payment) =>
                payment.guide.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
        setCurrentPage(1); // Reset to the first page
    };
    

    const handlePageChange = (direction: string) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePayDebt = useCallback( async(guideId: number) => {
        const apiURL = new URL(import.meta.env.VITE_BACKEND_API_ADDRESS);
        const url = new URL(apiURL + "internal/management/timesheet/pay/guide");
        try 
        {
            url.searchParams.append("guide_id", guideId.toString());
            url.searchParams.append("auth", userContext.authToken);
            const res = await fetch(url, {
                method: "POST",
            });

            if (res.ok) {
                notifications.show({
                    color: "blue",
                    title: "Ödeme Başarılı!",
                    message: "Ödeme başarıyla tamamlandı."
                });
                window.location.reload();
            }
            else
            {
                notifications.show({
                    color: "red",
                    title: "Ödeme Başarısız!",
                    message: "Ödeme yapılamadı."
                });
            }
        }
        catch (e) {
            notifications.show({
                color: "red",
                title: "Hay aksi!",
                message: "Bir şeyler yanlış gitti. Lütfen site yöneticisine durumu haber edin."
            });
        }
    },[userContext.authToken]);




    const saveUpdatedPayments = (updatedPayments: MoneyForGuide[]) => {
        localStorage.setItem('guidePayments', JSON.stringify(updatedPayments));
    };

    const handleDetails = (guideId: string) => {
        navigate(`/payment-detail/${guideId}`);
    };

    return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
    <h1 style={{ fontSize: "2.5em", color: "blue", textAlign: "center" }}><b>Ödemeler</b></h1>
    <div style={{ height: "20px" }}></div>
    <div style={{ marginBottom: "20px", textAlign: "center", background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <input
            type="text"
            placeholder="İsim aratın"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                padding: "10px",
                width: "60%",
                marginBottom: "10px",
                borderRadius: "20px",
                border: "1px solid #ccc",
            }}
        />
        <button
            onClick={handleSearch}
            style={{
                padding: "10px 15px",
                marginLeft: "10px",
                borderRadius: "20px",
                background: "#5c6bc0",
                color: "#fff",
                border: "none",
            }}
        >
            Ara
        </button>
    </div>
    
    <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <button
            onClick={() => setFilter("all")}
            style={{
            padding: "10px 15px",
            marginRight: "10px",
            border: "none",
            background: filter === "all" ? "#d7bde2" : "#f1f1f1", // pastel purple when selected
            color: filter === "all" ? "purple" : "#000", // purple bold text when selected
            fontWeight: "bold",
            borderRadius: "20px",
            }}
        >
            Tüm Ödemeler
        </button>
        <button
            onClick={() => setFilter("paid")}
            style={{
            padding: "10px 15px",
            marginRight: "10px",
            border: "none",
            background: filter === "paid" ? "#a8e6a1" : "#f1f1f1", // pastel light green when selected
            color: filter === "paid" ? "green" : "#000", // green text when selected
            fontWeight: "bold",
            borderRadius: "20px",
            }}
        >
            Yapılmış Ödemeler
        </button>
        <button
            onClick={() => setFilter("unpaid")}
            style={{
            padding: "10px 15px",
            marginRight: "10px",
            border: "none",
            background: filter === "unpaid" ? "#f8a1a1" : "#f1f1f1", // pastel red when selected
            color: filter === "unpaid" ? "red" : "#000", // red text when selected
            fontWeight: "bold",
            borderRadius: "20px",
            }}
        >
            Yapılmamış Ödemeler 
        </button>
        <button
            onClick={() => paymentsData.forEach(payment => handlePayDebt(payment.guide.id))}
            style={{
            padding: "10px 15px",
            border: "none",
            background: "lightpink",
            color: "red",
            float: "right",
            fontWeight: "bold",
            borderRadius: "20px",
            }}
        >
            Tüm Borçları Öde
        </button>
        <button
            onClick={() => navigate('/change-hourly-rate')}
            style={{
            marginRight: "10px",
            padding: "10px 15px",
            border: "none",
            background: "lightpink",
            color: "red",
            fontWeight: "bold",
            borderRadius: "20px",
            float: "right",
            }}
        >
            Saatlik Ücreti Güncelle
        </button>
    </div>

    <div style={{ marginTop: "20px" }}>
        {paginatedPayments.length === 0 ? (
            <p style={{ textAlign: "center", color: "red" }}>Kayıt bulunamadı.</p>
        ) : (
            paginatedPayments.map((payment) => (
                <div
                    key={payment.guide.id}
                    style={{
                        padding: "20px",
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "#f1f1f1", 
                        borderRadius: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        maxWidth: "1850px",
                        margin: "10px auto",
                    }}
                >
                    <div>
                        <h1 style={{ fontSize: "1.5em", color: "darkblue" }}><b>{payment.guide.name}</b></h1>
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
                            background: "#b7cced",
                            color: "darkblue",
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "1.2em",
                        }}
                    >
                        Ödeme Detayları
                    </button>
                    {payment.debt > 0 && (
                        <button
                            onClick={() => handlePayDebt(payment.guide.id)}
                            style={{
                                padding: "20px 60px",
                                background: "#d4edd3",
                                color: "darkgreen",
                                border: "none",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1.2em",
                            }}
                        >
                            Borç Öde
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
            Önceki Sayfa
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
            Sonraki Sayfa
        </button>
    </div>
</div> );
};

export default GuidePayments;