"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ChevronRight, CalendarClock, MapPin } from "lucide-react";

function ConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const washName = searchParams.get("wash") || "Car Wash";
    const serviceName = searchParams.get("service") || "Service";
    const timeValue = searchParams.get("time") || "ASAP";
    const paymentMethod = searchParams.get("payment") || "Pay In-Person";

    return (
        <main
            style={{
                flex: 1,
                background: "#f2f2f7",
                display: "flex",
                flexDirection: "column",
                fontFamily: "inherit",
                alignItems: "center",
                padding: "80px 24px 40px",
            }}
        >
            {/* Success Icon */}
            <div style={{ marginBottom: 24, animation: "pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}>
                <CheckCircle2 size={80} color="#34c759" strokeWidth={1.5} />
            </div>

            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em", textAlign: "center" }}>
                Booking Confirmed
            </h1>
            <p style={{ marginTop: 12, fontSize: 17, color: "#86868b", textAlign: "center", lineHeight: 1.4 }}>
                Your spot is reserved. We've notified the car wash.
            </p>

            {/* Receipt Card (Still rounded Apple style, but distinct from backgrounds) */}
            <div style={{ width: "100%", marginTop: 40, background: "#ffffff", borderRadius: 16, border: "1px solid #e5e5ea", overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", borderBottom: "1px solid #e5e5ea" }}>
                    <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1d1d1f" }}>
                        {washName}
                    </h2>
                </div>
                
                <div style={{ padding: "0 24px", display: "flex", flexDirection: "column" }}>
                    <div style={{ padding: "16px 0", borderBottom: "1px solid #e5e5ea", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#86868b", fontSize: 15 }}>Service</span>
                        <span style={{ color: "#1d1d1f", fontSize: 15, fontWeight: 500 }}>{serviceName}</span>
                    </div>
                    <div style={{ padding: "16px 0", borderBottom: "1px solid #e5e5ea", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#86868b", fontSize: 15 }}>Arrival Time</span>
                        <span style={{ color: "#1d1d1f", fontSize: 15, fontWeight: 500 }}>{timeValue}</span>
                    </div>
                    <div style={{ padding: "16px 0", display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#86868b", fontSize: 15 }}>Payment</span>
                        <span style={{ color: "#1d1d1f", fontSize: 15, fontWeight: 500 }}>{paymentMethod}</span>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1 }} />

            <button
                onClick={() => router.push("/discover")}
                style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 12, // Slight rounding for this primary CTA
                    border: "none",
                    background: "#0ea5e9",
                    color: "#ffffff",
                    fontSize: 17,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    marginTop: 40
                }}
            >
                Back to Discover
            </button>

            <button
                onClick={() => {
                    if (confirm("Are you sure you want to cancel this booking?")) {
                        router.push("/discover");
                    }
                }}
                style={{
                    width: "100%",
                    height: 56,
                    borderRadius: 12,
                    border: "none",
                    background: "transparent",
                    color: "#ff3b30",
                    fontSize: 17,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    marginTop: 8
                }}
            >
                Cancel Booking
            </button>
            <style jsx global>{`
                @keyframes pop-in {
                    0% { transform: scale(0.5); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </main>
    );
}

export default function BookingConfirmationPage() {
    return (
        <Suspense fallback={<div style={{ flex: 1, background: "#f2f2f7" }} />}>
            <ConfirmationContent />
        </Suspense>
    );
}
