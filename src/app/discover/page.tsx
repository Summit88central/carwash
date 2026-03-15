"use client";

import { useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { mockBusinesses, getDistance } from "@/data/mockDb";
import { Search, CalendarClock, ChevronRight } from "lucide-react";

// Mock Customer Location (e.g. anywhere in Johannesburg)
const CUSTOMER_LOCATION = { lat: -26.15, lng: 28.05 };
const MAX_DISTANCE_KM = 20;

const MapDisplay = dynamic(() => import("@/components/MapDisplay"), {
    ssr: false,
    loading: () => <div className="skeleton-box" style={{ height: 350, width: "100%", borderBottom: "1px solid #e5e5ea" }} />
});

export default function DiscoverPage() {
    const router = useRouter();

    // Process the washes: calculate distance, filter <= 20km, and sort closest first
    const nearbyWashes = useMemo(() => {
        return mockBusinesses
            .map(wash => ({
                ...wash,
                distance: getDistance(CUSTOMER_LOCATION.lat, CUSTOMER_LOCATION.lng, wash.location.lat, wash.location.lng)
            }))
            .filter(wash => wash.distance <= MAX_DISTANCE_KM)
            .sort((a, b) => a.distance - b.distance);
    }, []);

    // Create markers for the map
    const markers = nearbyWashes.map(w => ({
        id: w.id,
        lat: w.location.lat,
        lng: w.location.lng,
        title: w.washName
    }));

    return (
        <main
            style={{
                flex: 1,
                background: "#f2f2f7", // Apple grouped background
                display: "flex",
                flexDirection: "column",
                fontFamily: "inherit",
            }}
        >
            {/* Header & Search */}
            <div style={{ background: "#ffffff", padding: "56px 24px 16px", borderBottom: "1px solid #e5e5ea", position: "sticky", top: 0, zIndex: 10 }}>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f", margin: 0, letterSpacing: "-0.02em" }}>
                    Discover
                </h1>
                
                <div style={{ marginTop: 16, display: "flex", alignItems: "center", background: "#f2f2f7", borderRadius: 10, padding: "8px 12px" }}>
                    <Search size={18} color="#8e8e93" />
                    <input 
                        type="text" 
                        placeholder="Search for car washes..." 
                        style={{
                            border: "none",
                            background: "transparent",
                            outline: "none",
                            width: "100%",
                            marginLeft: 8,
                            fontSize: 17,
                            color: "#1d1d1f",
                            fontFamily: "inherit"
                        }}
                    />
                </div>
            </div>

            {/* Upcoming Wash Section (Mocked) */}
            <div style={{ padding: "16px 24px", background: "#ffffff", borderBottom: "1px solid #e5e5ea" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1d1d1f", margin: 0, letterSpacing: "-0.01em" }}>
                        Upcoming Wash
                    </h2>
                    <button 
                        onClick={() => router.push('/booking-confirmation?wash=Sparkle+City+Car+Wash&service=Standard+Wash&time=Today,+2:30+PM&payment=Pay+Online')}
                        style={{ 
                        background: "none", border: "none", color: "#0ea5e9", fontSize: 15, fontWeight: 500, padding: 0, cursor: "pointer", display: "flex", alignItems: "center"
                    }}>
                        View receipt <ChevronRight size={16} style={{ marginLeft: 2 }} />
                    </button>
                </div>
                
                <div style={{ 
                    background: "#0ea5e908", border: "1px solid #0ea5e930", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0ea5e915", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CalendarClock size={22} color="#0ea5e9" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#1d1d1f" }}>Sparkle City Car Wash</h3>
                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#86868b", fontWeight: 500 }}>Today, 2:30 PM • Standard Wash</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <Suspense fallback={<div className="skeleton-box" style={{ height: 350, width: "100%", borderBottom: "1px solid #e5e5ea" }} />}>
                <div style={{ height: 350, width: "100%", borderBottom: "1px solid #e5e5ea", position: "relative" }}>
                    <MapDisplay center={CUSTOMER_LOCATION} markers={markers} zoom={11} />
                </div>
            </Suspense>

            {/* List Section */}
            <div style={{ padding: "0 0 40px" }}>
                <div style={{ padding: "24px 24px 8px" }}>
                    <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1d1d1f", margin: 0, letterSpacing: "-0.01em" }}>
                        Nearby Washes
                    </h2>
                    <p style={{ marginTop: 4, fontSize: 13, color: "#86868b", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 500 }}>
                        Within {MAX_DISTANCE_KM}km
                    </p>
                </div>

                <div style={{ background: "#ffffff", borderTop: "1px solid #e5e5ea", borderBottom: "1px solid #e5e5ea", paddingLeft: 24 }}>
                    {nearbyWashes.length === 0 ? (
                        <div style={{ padding: "24px 24px 24px 0", color: "#86868b", fontSize: 17 }}>
                            No washes found near you.
                        </div>
                    ) : (
                        nearbyWashes.map((wash, index) => (
                            <button 
                                key={wash.id} 
                                onClick={() => router.push(`/book/${wash.id}`)}
                                style={{ 
                                    width: "100%",
                                    padding: "16px 24px 16px 0",
                                    border: "none",
                                    background: "transparent",
                                    borderBottom: index === nearbyWashes.length - 1 ? "none" : "1px solid #e5e5ea",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    cursor: "pointer",
                                    fontFamily: "inherit",
                                    textAlign: "left"
                                }}
                            >
                                <div>
                                    <h3 style={{ fontSize: 17, fontWeight: 500, color: "#1d1d1f", margin: 0 }}>
                                        {wash.washName}
                                    </h3>
                                    <p style={{ margin: "4px 0 0", fontSize: 15, color: "#86868b" }}>
                                        {wash.location.address}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: "#0ea5e9", background: "#0ea5e915", padding: "4px 8px", borderRadius: 6 }}>
                                        {wash.distance.toFixed(1)} km
                                    </span>
                                    <p style={{ margin: "6px 0 0", fontSize: 13, color: "#86868b", fontWeight: 500 }}>
                                        From R {Math.min(...wash.pricelist.map(p => p.price))}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}
