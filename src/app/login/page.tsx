"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
    ssr: false,
    loading: () => <div style={{ height: 300, background: "#f2f2f7" }} />
});

function OnboardingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams.get("type") || "customer";

    const [step, setStep] = useState(1);
    
    // Customer state
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [carType, setCarType] = useState("");
    
    // Business state
    const [bizOwner, setBizOwner] = useState("");
    const [bizName, setBizName] = useState("");
    const [bizLoc, setBizLoc] = useState<{lat: number, lng: number} | null>(null);
    const [pricelist, setPricelist] = useState<Array<{service: string, price: string}>>([
        { service: "Standard Wash", price: "" }
    ]);

    const isBusiness = type === "business";

    // Validate inputs per step
    const canContinue = () => {
        if (isBusiness) {
            if (step === 1) return phone.trim().length >= 6;
            if (step === 2) return bizOwner.trim().length > 0;
            if (step === 3) return bizName.trim().length > 0;
            if (step === 4) return bizLoc !== null;
            if (step === 5) return pricelist.length > 0 && pricelist.every(p => p.service.trim() !== "" && p.price.trim() !== "");
        } else {
            if (step === 1) return phone.trim().length >= 6;
            if (step === 2) return name.trim().length > 0;
            if (step === 3) return carType.trim().length > 0;
        }
        return true;
    };

    const handleNext = () => {
        if (!canContinue()) return;
        
        const maxSteps = isBusiness ? 5 : 3;
        
        if (step < maxSteps) {
            setStep(step + 1);
        } else {
            // Finish onboarding
            if (isBusiness) {
                // Navigate to a business dashboard
                router.push("/business");
            } else {
                router.push("/discover");
            }
        }
    };

    const addPricelistItem = () => {
        setPricelist([...pricelist, { service: "", price: "" }]);
    };

    const updatePricelist = (index: number, field: "service" | "price", value: string) => {
        const updated = [...pricelist];
        updated[index][field] = value;
        setPricelist(updated);
    };

    const removePricelistItem = (index: number) => {
        const updated = pricelist.filter((_, i) => i !== index);
        setPricelist(updated);
    };

    return (
        <main
            style={{
                flex: 1,
                background: "#ffffff",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Back button */}
            <div style={{ paddingTop: 56, paddingLeft: 24, paddingRight: 24 }}>
                <button
                    onClick={() => {
                        if (step > 1) setStep(step - 1);
                        else router.back();
                    }}
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

            {/* Header */}
            <div style={{ marginTop: 40, paddingLeft: 24, paddingRight: 24 }}>
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
                    {isBusiness ? (
                        step === 1 ? "What's your phone number?" :
                        step === 2 ? "What's your name?" :
                        step === 3 ? "What's your wash's name?" :
                        step === 4 ? "Drop a pin on your location" :
                        "Set up your pricelist"
                    ) : (
                        step === 1 ? "What's your phone number?" :
                        step === 2 ? "What's your first name?" :
                        "What vehicle do you drive?"
                    )}
                </h1>
                <p
                    style={{
                        marginTop: 12,
                        fontSize: 17,
                        color: "#86868b",
                        lineHeight: 1.4,
                        letterSpacing: "-0.01em",
                    }}
                >
                    {isBusiness ? (
                        step === 1 ? "We'll send a code to verify your account." :
                        step === 2 ? "Just the manager or owner's name." :
                        step === 3 ? "This is how customers will see your wash." :
                        step === 4 ? "Tap the map to set your exact car wash location." :
                        "Add the main services you offer and their prices (R)."
                    ) : (
                        step === 1 ? "We'll send you a code to verify your account securely." :
                        step === 2 ? "So we know what to call you." :
                        "Help washes prep for your size (e.g. Sedan, SUV)."
                    )}
                </p>
            </div>

            {/* Form Fields (Embedded, Apple Style) */}
            <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 0, paddingLeft: 24, paddingRight: 24 }}>
                {isBusiness ? (
                    step === 1 ? (
                        <input type="tel" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={{...inputStyle, fontSize: 32}} autoFocus />
                    ) : step === 2 ? (
                        <input type="text" placeholder="Owner Name" value={bizOwner} onChange={(e) => setBizOwner(e.target.value)} style={inputStyle} autoFocus />
                    ) : step === 3 ? (
                        <input type="text" placeholder="e.g. QuickWash Downtown" value={bizName} onChange={(e) => setBizName(e.target.value)} style={inputStyle} autoFocus />
                    ) : step === 4 ? (
                        null /* Map is full bleed, rendered outside padding below */
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {pricelist.map((item, i) => (
                                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                    <input type="text" placeholder="Service (e.g. Wash & Go)" value={item.service} onChange={(e) => updatePricelist(i, "service", e.target.value)} style={{...inputStyle, flex: 2, fontSize: 18}} />
                                    <span style={{ fontSize: 18, color: "#8e8e93" }}>R</span>
                                    <input type="number" placeholder="0" value={item.price} onChange={(e) => updatePricelist(i, "price", e.target.value)} style={{...inputStyle, flex: 1, fontSize: 18}} />
                                    {pricelist.length > 1 && (
                                        <button onClick={() => removePricelistItem(i)} style={{background: "none", border: "none", color: "#ff3b30", cursor: "pointer", padding: "16px 0"}}>
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button onClick={addPricelistItem} style={{ background: "none", border: "none", color: "#0ea5e9", fontSize: 17, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "16px 0", alignSelf: "flex-start", fontFamily: "inherit" }}>
                                <Plus size={20} /> Add Service
                            </button>
                        </div>
                    )
                ) : (
                    step === 1 ? (
                        <input type="tel" placeholder="(555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} style={{...inputStyle, fontSize: 32}} autoFocus />
                    ) : step === 2 ? (
                        <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} autoFocus />
                    ) : (
                        <input type="text" placeholder="e.g. VW Polo, SUV, Sedan" value={carType} onChange={(e) => setCarType(e.target.value)} style={inputStyle} autoFocus />
                    )
                )}
            </div>

            {isBusiness && step === 4 && (
                <div style={{ marginTop: 24, width: "100%" }}>
                    <MapPicker onLocationSelect={(lat, lng) => setBizLoc({ lat, lng })} />
                    {bizLoc && (
                        <p style={{ textAlign: "center", marginTop: 16, fontSize: 15, color: "#0ea5e9", fontWeight: 500 }}>
                            Pin dropped successfully.
                        </p>
                    )}
                </div>
            )}

            <div style={{ flex: 1 }} />

            {/* CTA */}
            <div style={{ marginTop: 40, paddingLeft: 24, paddingRight: 24, paddingBottom: 40 }}>
                <button
                    onClick={handleNext}
                    disabled={!canContinue()}
                    style={{
                        width: "100%",
                        height: 56,
                        borderRadius: 0,
                        border: "none",
                        background: canContinue() ? "#0ea5e9" : "#f2f2f7",
                        color: canContinue() ? "#ffffff" : "#8e8e93",
                        fontSize: 17,
                        fontWeight: 600,
                        cursor: canContinue() ? "pointer" : "not-allowed",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s ease, color 0.2s ease",
                        fontFamily: "inherit",
                        letterSpacing: "-0.01em",
                    }}
                >
                    {isBusiness ? (step < 5 ? "Continue" : "Go to Dashboard") : (step < 3 ? "Continue" : "Start Exploring")}
                </button>
            </div>
        </main>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: 22,
    padding: "16px 0",
    border: "none",
    borderBottom: "1px solid #e5e5ea",
    outline: "none",
    color: "#1d1d1f",
    background: "transparent",
    fontFamily: "inherit",
    letterSpacing: "-0.01em",
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ background: "#ffffff", flex: 1 }} />}>
            <OnboardingContent />
        </Suspense>
    );
}
