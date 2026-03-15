"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Info, MapPin, Clock, CreditCard, Wallet } from "lucide-react";
import { mockBusinesses } from "@/data/mockDb";

export default function BookPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const wash = mockBusinesses.find(b => b.id === params.id) || mockBusinesses[0];

    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"Online" | "In-Person">("Online");
    
    // Dynamic Time Slots (Client-side to avoid SSR mismatch)
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    
    // Payment UI State
    const [showPaySheet, setShowPaySheet] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    useEffect(() => {
        const slots = [];
        const now = new Date();
        let current = new Date(now);
        // Round up to the next 30 min block
        current.setMinutes(Math.ceil(current.getMinutes() / 30) * 30);
        current.setSeconds(0);
        
        for (let i = 0; i < 4; i++) {
            slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + 30);
        }
        setTimeSlots(slots);
        setSelectedTime(slots[0]);
    }, []);

    const price = selectedServiceId ? wash.pricelist.find(s => s.id === selectedServiceId)?.price : 0;

    const navigateToSuccess = () => {
        router.push(
            `/booking-confirmation?wash=${encodeURIComponent(wash.washName)}&service=${encodeURIComponent(
                wash.pricelist.find(s => s.id === selectedServiceId)?.service || ""
            )}&time=${encodeURIComponent(selectedTime)}&payment=${encodeURIComponent(paymentMethod)}`
        );
    };

    const handleConfirm = () => {
        if (!selectedServiceId || !selectedTime) return;
        
        if (paymentMethod === "Online") {
            setShowPaySheet(true);
        } else {
            navigateToSuccess();
        }
    };

    const processPayment = () => {
        setIsPaying(true);
        // Simulate FaceID / Processing Delay
        setTimeout(() => {
            navigateToSuccess();
        }, 1500);
    };

    return (
        <main
            style={{
                flex: 1,
                background: "#f2f2f7",
                display: "flex",
                flexDirection: "column",
                fontFamily: "inherit",
                position: "relative",
            }}
        >
            {/* Header */}
            <div style={{ background: "#ffffff", padding: "56px 24px 16px", borderBottom: "1px solid #e5e5ea", position: "sticky", top: 0, zIndex: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            display: "flex", alignItems: "center", gap: 2, background: "none", border: "none",
                            cursor: "pointer", color: "#0ea5e9", fontSize: 17, fontWeight: 400,
                            padding: "4px 0", fontFamily: "inherit", letterSpacing: "-0.01em", marginLeft: -8,
                        }}
                    >
                        <ChevronLeft size={22} strokeWidth={1.5} />
                        Back
                    </button>
                    <button style={{ background: "none", border: "none", color: "#0ea5e9" }}>
                        <Info size={22} strokeWidth={1.5} />
                    </button>
                </div>
                
                <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>
                    {wash.washName}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "#86868b" }}>
                    <MapPin size={16} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{wash.location.address}</span>
                </div>
            </div>

            {/* Select Service */}
            <div style={{ marginTop: 24 }}>
                <h3 style={{ marginLeft: 24, marginBottom: 8, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                    Select Service
                </h3>
                <div style={{ background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                    {wash.pricelist.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedServiceId(item.id)}
                            style={{
                                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "16px 24px 16px 0", border: "none", background: "transparent",
                                borderBottom: i === wash.pricelist.length - 1 ? "none" : "1px solid #e5e5ea",
                                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                            }}
                        >
                            <span style={{ fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>{item.service}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ fontSize: 17, color: "#86868b" }}>R {item.price}</span>
                                <div style={{ 
                                    width: 24, height: 24, borderRadius: "50%", 
                                    border: `1.5px solid ${selectedServiceId === item.id ? "#0ea5e9" : "#c7c7cc"}`,
                                    background: selectedServiceId === item.id ? "#0ea5e9" : "transparent",
                                    display: "flex", alignItems: "center", justifyContent: "center"
                                }}>
                                    {selectedServiceId === item.id && (
                                        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                            <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Select Time */}
            <div style={{ marginTop: 32 }}>
                <h3 style={{ marginLeft: 24, marginBottom: 8, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                    Arrival Time
                </h3>
                <div style={{ background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                    {timeSlots.length === 0 ? (
                        <div style={{ padding: "16px 24px 16px 0", color: "#8e8e93" }}>Loading slots...</div>
                    ) : (
                        timeSlots.map((timeOpt, i, arr) => (
                            <button
                                key={timeOpt}
                                onClick={() => setSelectedTime(timeOpt)}
                                style={{
                                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                                    padding: "16px 24px 16px 0", border: "none", background: "transparent",
                                    borderBottom: i === arr.length - 1 ? "none" : "1px solid #e5e5ea",
                                    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                                }}
                            >
                                <span style={{ fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>{timeOpt}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Clock size={16} color={selectedTime === timeOpt ? "#0ea5e9" : "#86868b"} />
                                    <div style={{ 
                                        width: 24, height: 24, borderRadius: "50%", 
                                        border: `1.5px solid ${selectedTime === timeOpt ? "#0ea5e9" : "#c7c7cc"}`,
                                        background: selectedTime === timeOpt ? "#0ea5e9" : "transparent",
                                        display: "flex", alignItems: "center", justifyContent: "center"
                                    }}>
                                        {selectedTime === timeOpt && (
                                            <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                                <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Select Payment Method */}
            <div style={{ marginTop: 32 }}>
                <h3 style={{ marginLeft: 24, marginBottom: 8, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                    Payment
                </h3>
                <div style={{ background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                    <button
                        onClick={() => setPaymentMethod("Online")}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "16px 24px 16px 0", border: "none", background: "transparent",
                            borderBottom: "1px solid #e5e5ea",
                            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <CreditCard size={14} color="#ffffff" />
                            </div>
                            <span style={{ fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>Pay Online</span>
                        </div>
                        <div style={{ 
                            width: 24, height: 24, borderRadius: "50%", 
                            border: `1.5px solid ${paymentMethod === "Online" ? "#0ea5e9" : "#c7c7cc"}`,
                            background: paymentMethod === "Online" ? "#0ea5e9" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            {paymentMethod === "Online" && (
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setPaymentMethod("In-Person")}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "16px 24px 16px 0", border: "none", background: "transparent",
                            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <Wallet size={14} color="#1d1d1f" />
                            </div>
                            <span style={{ fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>Pay In-Person</span>
                        </div>
                        <div style={{ 
                            width: 24, height: 24, borderRadius: "50%", 
                            border: `1.5px solid ${paymentMethod === "In-Person" ? "#0ea5e9" : "#c7c7cc"}`,
                            background: paymentMethod === "In-Person" ? "#0ea5e9" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            {paymentMethod === "In-Person" && (
                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                                    <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            <div style={{ flex: 1 }} />

            {/* Bottom CTA Bar */}
            <div style={{ 
                position: "sticky", bottom: 0, left: 0, width: "100%", marginTop: "auto", zIndex: 20,
                background: "#ffffff", borderTop: "1px solid #e5e5ea", padding: "16px 24px 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
                <div>
                    <span style={{ display: "block", fontSize: 13, color: "#86868b", fontWeight: 500 }}>Total</span>
                    <span style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.01em" }}>
                        R {price || "0"}
                    </span>
                </div>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedServiceId}
                    style={{
                        padding: "0 32px", height: 50, borderRadius: 25, border: "none",
                        background: selectedServiceId ? "#0ea5e9" : "#f2f2f7", 
                        color: selectedServiceId ? "#ffffff" : "#8e8e93",
                        fontSize: 17, fontWeight: 600, cursor: selectedServiceId ? "pointer" : "not-allowed",
                        transition: "background 0.2s", fontFamily: "inherit", letterSpacing: "-0.01em",
                        display: "flex", alignItems: "center", gap: 8
                    }}
                >
                    {paymentMethod === "Online" ? "Pay Now" : "Confirm"}
                </button>
            </div>

            {/* Apple Pay / Payment Overlay */}
            {showPaySheet && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100vh",
                    background: "rgba(0,0,0,0.4)", zIndex: 100,
                    display: "flex", flexDirection: "column", justifyContent: "flex-end",
                }}>
                    <div style={{ flex: 1 }} onClick={() => !isPaying && setShowPaySheet(false)} />
                    <div style={{ 
                        background: "#ffffff", width: "100%", maxWidth: 480, margin: "0 auto",
                        borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "24px 24px 40px",
                        boxShadow: "0 -10px 40px rgba(0,0,0,0.1)",
                        animation: "slide-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)",
                        display: "flex", flexDirection: "column", alignItems: "center"
                    }}>
                        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#e5e5ea", marginBottom: 24 }} />
                        
                        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.01em" }}>
                            Pay QuickWash
                        </h2>
                        
                        <div style={{ marginTop: 24, padding: "20px 0", width: "100%", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 17, color: "#86868b" }}>TOTAL</span>
                            <span style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f" }}>R {price}</span>
                        </div>
                        
                        <button
                            onClick={processPayment}
                            disabled={isPaying}
                            style={{
                                width: "100%", height: 56, borderRadius: 28, border: "none",
                                background: "#1d1d1f", color: "#ffffff", fontSize: 17, fontWeight: 600,
                                cursor: isPaying ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                                fontFamily: "inherit", letterSpacing: "-0.01em", marginTop: 32, gap: 10
                            }}
                        >
                            {isPaying ? (
                                <span style={{ animation: "pulse 1.5s infinite" }}>Processing...</span>
                            ) : (
                                "Double Click to Pay"
                            )}
                        </button>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes slide-up {
                    0% { transform: translateY(100%); }
                    100% { transform: translateY(0); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </main>
    );
}
