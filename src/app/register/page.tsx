"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, Store, ChevronLeft } from "lucide-react";

type AccountType = "customer" | "business" | null;

export default function RegisterPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<AccountType>(null);

    const handleContinue = () => {
        if (!selected) return;
        // Navigate to the relevant sign-up form
        router.push(selected === "customer" ? "/login?type=customer" : "/login?type=business");
    };

    return (
        <main
            style={{
                flex: 1,
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
                padding: "0 24px 40px",
            }}
        >
            {/* ── Back button ── */}
            <div style={{ paddingTop: 56 }}>
                <button
                    onClick={() => router.back()}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#0ea5e9",
                        fontSize: 17,
                        fontWeight: 400,
                        padding: "4px 0",
                        fontFamily: "inherit",
                        letterSpacing: "-0.01em",
                    }}
                >
                    <ChevronLeft size={22} strokeWidth={1.5} />
                    Back
                </button>
            </div>

            {/* ── Header ── */}
            <div style={{ marginTop: 40 }}>
                <h1
                    style={{
                        fontSize: 34,
                        fontWeight: 600,
                        color: "#1d1d1f",
                        lineHeight: 1.2,
                        letterSpacing: "-0.02em",
                        margin: 0,
                    }}
                >
                    Choose your account
                </h1>
            </div>

            {/* ── Role Selections (Embedded, no cards, no rounding) ── */}
            <div style={{ marginTop: 48, display: "flex", flexDirection: "column" }}>
                {/* I need a wash */}
                <button
                    onClick={() => setSelected("customer")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "24px 0",
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #e5e5ea",
                        borderTop: "1px solid #e5e5ea",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        borderRadius: 0,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Car size={32} color={selected === "customer" ? "#0ea5e9" : "#1d1d1f"} strokeWidth={1.2} />
                        <span
                            style={{
                                fontSize: 22,
                                fontWeight: 500,
                                color: selected === "customer" ? "#0ea5e9" : "#1d1d1f",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            I need a wash
                        </span>
                    </div>
                    {selected === "customer" && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13L9 17L19 7" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                    )}
                </button>

                {/* I run a wash */}
                <button
                    onClick={() => setSelected("business")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "24px 0",
                        width: "100%",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #e5e5ea",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        borderRadius: 0,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <Store size={32} color={selected === "business" ? "#0ea5e9" : "#1d1d1f"} strokeWidth={1.2} />
                        <span
                            style={{
                                fontSize: 22,
                                fontWeight: 500,
                                color: selected === "business" ? "#0ea5e9" : "#1d1d1f",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            I run a wash
                        </span>
                    </div>
                    {selected === "business" && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 13L9 17L19 7" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ── Spacer + CTA ── */}
            <div style={{ flex: 1 }} />

            <div style={{ marginTop: 40 }}>
                <button
                    onClick={handleContinue}
                    disabled={!selected}
                    style={{
                        width: "100%",
                        height: 56,
                        borderRadius: 0,
                        border: "none",
                        background: selected ? "#0ea5e9" : "#f2f2f7",
                        color: selected ? "#ffffff" : "#8e8e93",
                        fontSize: 17,
                        fontWeight: 600,
                        cursor: selected ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s ease, color 0.2s ease",
                        fontFamily: "inherit",
                        letterSpacing: "-0.01em",
                    }}
                >
                    Continue
                </button>

                <p
                    style={{
                        marginTop: 24,
                        textAlign: "center",
                        fontSize: 15,
                        color: "#86868b",
                    }}
                >
                    Already have an account?{" "}
                    <button
                        onClick={() => router.push("/login")}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#0ea5e9",
                            fontWeight: 500,
                            fontSize: 15,
                            cursor: "pointer",
                            padding: 0,
                            fontFamily: "inherit",
                        }}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </main>
    );
}
