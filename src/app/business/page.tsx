"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { mockBusinesses } from "@/data/mockDb";
import { CalendarClock, MapPin } from "lucide-react";

const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
    ssr: false,
    loading: () => <div className="skeleton-box" style={{ height: 250, width: "100%", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea" }} />
});

// Mock upcoming bookings for the demo
const MOCK_BOOKINGS = [
    { id: "b1", customerName: "Leslie Khanye", service: "Full Wash & Vacuum", time: "In 1 Hour", price: 150, carType: "Hatchback (VW Polo)" },
    { id: "b2", customerName: "Sarah Jones", service: "Exterior Only", time: "Later Today", price: 80, carType: "SUV (Toyota Fortuner)" },
];

export default function BusinessDashboard() {
    // For now, load the first mocked business as our placeholder "current user"
    const business = mockBusinesses[0];

    return (
        <main
            style={{
                flex: 1,
                background: "#f2f2f7", // Apple's grouped background color
                display: "flex",
                flexDirection: "column",
                padding: "0 0 40px",
                fontFamily: "inherit",
            }}
        >
            {/* Nav Header */}
            <div style={{ background: "#ffffff", padding: "56px 24px 16px", borderBottom: "1px solid #e5e5ea", position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                    <p style={{ margin: 0, fontSize: 13, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
                        Welcome back
                    </p>
                    <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", margin: "2px 0 0", letterSpacing: "-0.02em" }}>
                        {business.ownerName}
                    </h1>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: "#1d1d1f", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 18 }}>
                    {business.ownerName.charAt(0)}
                </div>
            </div>

            {/* Business Info Cell */}
            <div style={{ marginTop: 24, background: "#ffffff", padding: "20px 24px", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea" }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.01em" }}>
                    {business.washName}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <div style={{ background: "#e5e5ea", padding: "4px 8px", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>Live</div>
                    <p style={{ margin: 0, fontSize: 15, color: "#86868b", fontWeight: 500 }}>
                        {business.phone}
                    </p>
                </div>
            </div>

            {/* Upcoming Bookings */}
            <h3 style={{ marginTop: 32, marginLeft: 24, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                Upcoming Bookings
            </h3>
            <div style={{ marginTop: 8, background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                {MOCK_BOOKINGS.map((booking, i) => (
                    <div 
                        key={booking.id}
                        style={{
                            padding: "16px 24px 16px 0",
                            borderBottom: i === MOCK_BOOKINGS.length - 1 ? "none" : "1px solid #e5e5ea",
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between"
                        }}
                    >
                        <div>
                            <h4 style={{ margin: 0, fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>
                                {booking.customerName}
                            </h4>
                            <p style={{ margin: "4px 0 0", fontSize: 15, color: "#1d1d1f" }}>
                                {booking.service}
                            </p>
                            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#86868b" }}>
                                {booking.carType}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f2f2f7", padding: "4px 8px", borderRadius: 6 }}>
                                <CalendarClock size={14} color="#0ea5e9" />
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#0ea5e9" }}>{booking.time}</span>
                            </div>
                            <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 500, color: "#1d1d1f" }}>
                                R {booking.price}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Location Map */}
            <h3 style={{ marginTop: 32, marginLeft: 24, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                Location
            </h3>
            <div style={{ marginTop: 8 }}>
                <div style={{ height: 250, width: "100%", position: "relative", borderTop: "1px solid #e5e5ea" }}>
                    <Suspense fallback={<div className="skeleton-box" style={{ width: "100%", height: "100%" }} />}>
                        <MapDisplay 
                            center={business.location} 
                            markers={[{ id: business.id, ...business.location, title: business.washName }]} 
                            zoom={14}
                        />
                    </Suspense>
                </div>
                <div style={{ background: "#ffffff", padding: "16px 24px", borderBottom: "1px solid #e5e5ea", display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <MapPin size={16} color="#1d1d1f" />
                    </div>
                    <span style={{ margin: 0, fontSize: 15, color: "#1d1d1f", fontWeight: 500 }}>{business.location.address}</span>
                </div>
            </div>

            {/* Pricelist */}
            <h3 style={{ marginTop: 32, marginLeft: 24, fontSize: 13, textTransform: "uppercase", color: "#86868b", letterSpacing: "0.04em", fontWeight: 600 }}>
                Pricelist
            </h3>
            <div style={{ marginTop: 8, background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                {business.pricelist.map((item, i) => (
                    <div 
                        key={item.id} 
                        style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            padding: "16px 24px 16px 0",
                            borderBottom: i === business.pricelist.length - 1 ? "none" : "1px solid #e5e5ea"
                        }}
                    >
                        <span style={{ fontSize: 17, color: "#1d1d1f", fontWeight: 500 }}>{item.service}</span>
                        <span style={{ fontSize: 17, color: "#86868b" }}>R {item.price}</span>
                    </div>
                ))}
            </div>
            
            <div style={{ marginTop: 40, padding: "0 24px" }}>
                 <button style={{ width: "100%", padding: "16px", borderRadius: 12, background: "#ffffff", border: "1px solid #e5e5ea", color: "#ff3b30", fontSize: 17, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                     Log Out
                 </button>
            </div>
        </main>
    );
}
