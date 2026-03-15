"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── animation timing (matches CSS keyframes) ─── */
const REDIRECT_MS = 6800; // after this, navigate to /register

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const phase = "washing" as const; // car is always in the bay
  const [taglineIdx, setTaglineIdx] = useState(0);

  const taglines = [
    "Finding washes near you…",
    "Car entering the bay…",
    "Sudding up… almost there.",
    "Sparkling clean. Let's go!",
  ];

  /* progress bar & phase tracking */
  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / REDIRECT_MS) * 100, 100);
      setProgress(pct);



      /* tagline every ~1.7s */
      setTaglineIdx(Math.floor(elapsed / 1700) % taglines.length);

      if (elapsed >= REDIRECT_MS) {
        clearInterval(tick);
        router.push("/register");
      }
    }, 30);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      style={{
        flex: 1,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* ── WORDMARK ── */}
      <div
        style={{
          animation: "logo-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* droplet icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "linear-gradient(145deg, #38bdf8 0%, #0ea5e9 100%)",
            boxShadow: "0 4px 14px rgba(14,165,233,0.28)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 5 9.5 5 14.5A7 7 0 0 0 19 14.5C19 9.5 12 2 12 2Z"
              fill="white" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "#0f172a",
          }}
        >
          Quick<span style={{ color: "#0ea5e9" }}>Wash</span>
        </span>
      </div>

      {/* subtitle */}
      <p
        style={{
          fontSize: 13,
          color: "#64748b",
          fontWeight: 500,
          letterSpacing: "0.01em",
          marginBottom: 44,
          animation: "fade-in-up 0.6s 0.3s both ease-out",
        }}
      >
        Your local car wash, booked in 30 seconds
      </p>

      {/* ── CAR WASH ILLUSTRATION ── */}
      <CarWashScene phase={phase} />

      {/* ── PHASE LABEL ── */}
      <div
        key={taglineIdx}
        style={{
          marginTop: 28,
          height: 20,
          fontSize: 13,
          color: "#475569",
          fontWeight: 500,
          animation: "fade-in-up 0.35s ease-out both",
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        {taglines[taglineIdx]}
      </div>

      {/* ── PROGRESS BAR ── */}
      <div
        style={{
          marginTop: 28,
          width: "min(280px, 80vw)",
          height: 4,
          background: "#f1f5f9",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
            borderRadius: 99,
            transition: "width 60ms linear",
            boxShadow: "0 0 8px rgba(56,189,248,0.4)",
          }}
        />
      </div>
      <p style={{ marginTop: 8, fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
        {Math.round(progress)}%
      </p>
    </main>
  );
}

/* ════════════════════════════════════════════════════════
   CAR WASH SCENE – pure CSS-animated illustration
════════════════════════════════════════════════════════ */
function CarWashScene({ phase }: { phase: string }) {
  const isWashing = phase === "washing";

  return (
    <div
      style={{
        position: "relative",
        width: "min(340px, 92vw)",
        height: 180,
        animation: "fade-in-up 0.5s 0.15s both ease-out",
      }}
    >
      {/* ── GROUND TRACK ── */}
      <div
        style={{
          position: "absolute",
          bottom: 14,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(90deg, transparent, #e2e8f0 10%, #e2e8f0 90%, transparent)",
          borderRadius: 9,
        }}
      />

      {/* ── BAY ARCH (shelter) ── */}
      <BayArch isWashing={isWashing} />

      {/* ── WATER CURTAINS (only while washing) ── */}
      {isWashing && <WaterCurtains />}

      {/* ── BUBBLES (only while washing) ── */}
      {isWashing && <Bubbles />}

      {/* ── CAR ── */}
      <div
        style={{
          position: "absolute",
          bottom: 17,
          left: "50%",
          /* center the car visually (car is 164px wide) */
          marginLeft: -82,
          willChange: "transform",
          zIndex: 10,
        }}
      >
        <CarSVG isWashing={isWashing} />
      </div>

      {/* road dashes */}
      <RoadDashes />
    </div>
  );
}

/* ── Bay arch with optional glow ── */
function BayArch({ isWashing }: { isWashing: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: 210,
        height: 140,
        border: `2.5px solid ${isWashing ? "#4ade80" : "#cbd5e1"}`,
        borderBottom: "none",
        borderRadius: "100px 100px 0 0",
        background: isWashing
          ? "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)"
          : "#f8fafc",
        transition: "border-color 0.6s, background 0.6s",
        boxShadow: isWashing ? "0 0 24px 4px rgba(74,222,128,0.18)" : "none",
        zIndex: 1,
      }}
    >
      {/* arch header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: isWashing ? "#38bdf8" : "#e2e8f0",
          borderRadius: "100px 100px 0 0",
          transition: "background 0.6s",
        }}
      />
      {/* side pillars */}
      <div style={{ position: "absolute", bottom: 0, left: -3, width: 5, height: 30, background: isWashing ? "#38bdf8" : "#e2e8f0", borderRadius: 4, transition: "background 0.6s" }} />
      <div style={{ position: "absolute", bottom: 0, right: -3, width: 5, height: 30, background: isWashing ? "#38bdf8" : "#e2e8f0", borderRadius: 4, transition: "background 0.6s" }} />

      {/* "CAR WASH" sign on arch */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: "50%",
          transform: "translateX(-50%)",
          background: isWashing ? "#0ea5e9" : "#334155",
          color: "#fff",
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.18em",
          padding: "3px 10px",
          borderRadius: 99,
          whiteSpace: "nowrap",
          transition: "background 0.6s",
        }}
      >
        CAR WASH
      </div>
    </div>
  );
}

/* ── Animated water curtain strips ── */
function WaterCurtains() {
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: "50%",
        transform: "translateX(-50%)",
        width: 190,
        height: 100,
        overflow: "hidden",
        zIndex: 15,
        pointerEvents: "none",
      }}
    >
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${i * 7.5}%`,
            width: 2,
            height: "100%",
            background: "linear-gradient(180deg, rgba(147,210,255,0) 0%, rgba(147,210,255,0.55) 40%, rgba(59,130,246,0.25) 100%)",
            borderRadius: 4,
            animation: `curtain-sweep ${0.55 + i * 0.045}s linear infinite alternate`,
            animationDelay: `${i * 0.04}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating soap bubbles ── */
function Bubbles() {
  const bubbleData = [
    { size: 8, left: "30%", delay: 0 },
    { size: 5, left: "45%", delay: 0.3 },
    { size: 10, left: "60%", delay: 0.6 },
    { size: 6, left: "38%", delay: 0.9 },
    { size: 9, left: "52%", delay: 1.2 },
    { size: 4, left: "66%", delay: 0.15 },
    { size: 7, left: "42%", delay: 0.75 },
  ];
  return (
    <div style={{ position: "absolute", bottom: 55, left: 0, right: 0, zIndex: 20, pointerEvents: "none" }}>
      {bubbleData.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: 0,
            left: b.left,
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: "rgba(186,230,255,0.4)",
            border: "1px solid rgba(147,210,255,0.7)",
            animation: `bubble-float ${1.0 + i * 0.2}s ease-in infinite`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Road center dashes ── */
function RoadDashes() {
  return (
    <div style={{ position: "absolute", bottom: 25, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10, zIndex: 0 }}>
      {[...Array(7)].map((_, i) => (
        <div key={i} style={{ width: 16, height: 2, background: "#e2e8f0", borderRadius: 2 }} />
      ))}
    </div>
  );
}

/* ── Car SVG component with inline car shine during wash ── */
function CarSVG({ isWashing }: { isWashing: boolean }) {
  return (
    <div style={{ position: "relative", width: 164, height: 58 }}>
      <svg
        width={164}
        height={58}
        viewBox="0 0 164 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        {/* ── Body ── */}
        <rect x="4" y="26" width="156" height="26" rx="10" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />

        {/* ── Cabin ── */}
        <path
          d="M28 26 C30 10 45 8 58 8 L106 8 C119 8 132 10 136 26 Z"
          fill={isWashing ? "#e0f2fe" : "#f0f9ff"}
          stroke="#334155"
          strokeWidth="2"
          style={{ transition: "fill 0.5s" }}
        />

        {/* ── Windshield ── */}
        <path
          d="M36 26 C38 14 50 12 62 12 L102 12 C114 12 126 14 128 26 Z"
          fill={isWashing ? "#7dd3fc" : "#bae6fd"}
          stroke="#64748b"
          strokeWidth="1.5"
          style={{ transition: "fill 0.5s" }}
        />

        {/* ── Side windows ── */}
        <rect x="68" y="13" width="24" height="12" rx="3" fill={isWashing ? "#38bdf8" : "#7dd3fc"} stroke="#64748b" strokeWidth="1.2" style={{ transition: "fill 0.5s" }} />
        <rect x="96" y="13" width="18" height="12" rx="3" fill={isWashing ? "#38bdf8" : "#7dd3fc"} stroke="#64748b" strokeWidth="1.2" style={{ transition: "fill 0.5s" }} />

        {/* ── Door line ── */}
        <line x1="62" y1="26" x2="62" y2="50" stroke="#cbd5e1" strokeWidth="1.5" />
        <line x1="100" y1="26" x2="100" y2="50" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* ── Door handle ── */}
        <rect x="70" y="36" width="10" height="3" rx="1.5" fill="#94a3b8" />
        <rect x="108" y="36" width="10" height="3" rx="1.5" fill="#94a3b8" />

        {/* ── Brand stripe ── */}
        <rect x="32" y="36" width="18" height="3" rx="1.5" fill="#0ea5e9" />

        {/* ── Headlights ── */}
        <rect x="148" y="30" width="10" height="6" rx="3" fill="#fef9c3" stroke="#fbbf24" strokeWidth="1" />
        <rect x="148" y="30" width="10" height="6" rx="3" fill="rgba(251,191,36,0.15)" />

        {/* ── Tail lights ── */}
        <rect x="4" y="30" width="10" height="6" rx="3" fill="#fecaca" stroke="#ef4444" strokeWidth="1" />

        {/* ── Wheels ── */}
        {/* rear */}
        <circle cx="34" cy="52" r="10" fill="#1e293b" />
        <circle cx="34" cy="52" r="6" fill="#334155" />
        <circle cx="34" cy="52" r="3" fill="#64748b" />
        <circle cx="34" cy="52" r="1" fill="#fff" />
        {/* front */}
        <circle cx="130" cy="52" r="10" fill="#1e293b" />
        <circle cx="130" cy="52" r="6" fill="#334155" />
        <circle cx="130" cy="52" r="3" fill="#64748b" />
        <circle cx="130" cy="52" r="1" fill="#fff" />

        {/* Wheel lug bolts (rear) */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i * 90) * (Math.PI / 180);
          return (
            <circle key={i}
              cx={34 + Math.cos(angle) * 4}
              cy={52 + Math.sin(angle) * 4}
              r={0.8}
              fill="#94a3b8"
            />
          );
        })}
        {/* Wheel lug bolts (front) */}
        {[0, 1, 2, 3].map(i => {
          const angle = (i * 90) * (Math.PI / 180);
          return (
            <circle key={i}
              cx={130 + Math.cos(angle) * 4}
              cy={52 + Math.sin(angle) * 4}
              r={0.8}
              fill="#94a3b8"
            />
          );
        })}

        {/* ── Grille ── */}
        <rect x="152" y="38" width="7" height="7" rx="2" fill="#334155" />
        <rect x="153" y="39" width="5" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="153" y="41.5" width="5" height="1.5" rx="0.5" fill="#64748b" />
        <rect x="153" y="44" width="5" height="1.5" rx="0.5" fill="#64748b" />

        {/* ── Antenna ── */}
        <line x1="110" y1="8" x2="114" y2="0" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="114" cy="0" r="1.5" fill="#94a3b8" />
      </svg>

      {/* Wheel spin overlays (pure CSS animation) */}
      <WheelSpinner cx={34} cy={52} />
      <WheelSpinner cx={130} cy={52} />

      {/* Car shine during washing */}
      {isWashing && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 10,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "-60%",
              width: "30%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
              transform: "skewX(-20deg)",
              animation: "car-shine 1.4s linear infinite",
            }}
          />
        </div>
      )}

      {/* Drip drops during washing */}
      {isWashing && <DripDrops />}
    </div>
  );
}

/* Spinning wheel overlay positioned on top of SVG wheel centers */
function WheelSpinner({ cx, cy }: { cx: number; cy: number }) {
  const SCALE = 1; // SVG is 164px wide, same as container
  return (
    <div
      style={{
        position: "absolute",
        left: cx * SCALE - 10,
        top: cy - 10,
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: "2.5px solid transparent",
        borderTopColor: "#38bdf8",
        animation: "wheel-spin 0.55s linear infinite",
        zIndex: 5,
        pointerEvents: "none",
      }}
    />
  );
}

/* Water drips falling off the car */
function DripDrops() {
  return (
    <div style={{ position: "absolute", top: 10, left: 0, right: 0, pointerEvents: "none" }}>
      {[20, 55, 90, 125, 145].map((leftPx, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: leftPx,
            width: 3,
            height: 8,
            borderRadius: "0 0 4px 4px",
            background: "rgba(96,165,250,0.5)",
            animation: `drip ${0.7 + i * 0.15}s ease-in infinite`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
