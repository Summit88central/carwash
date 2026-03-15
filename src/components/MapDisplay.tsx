"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default Leaflet marker icons in Next.js
const defaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

interface MapDisplayProps {
    center: { lat: number; lng: number };
    markers: Array<{ id: string; lat: number; lng: number; title: string }>;
    zoom?: number;
}

export default function MapDisplay({ center, markers, zoom = 12 }: MapDisplayProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="skeleton-box" style={{ width: "100%", height: "100%" }}>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100%", overflow: "hidden", ...appleMapStyle }}>
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%", background: "#e5e5ea" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User Center Marker (Distinct style if possible, or just default) */}
                <Marker position={[center.lat, center.lng]}>
                    <Popup>You are here</Popup>
                </Marker>

                {/* Business Markers */}
                {markers.map((m) => (
                    <Marker key={m.id} position={[m.lat, m.lng]}>
                        <Popup>{m.title}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}

const appleMapStyle: React.CSSProperties = {
    borderRadius: 0,
    borderTop: "1px solid #e5e5ea",
    borderBottom: "1px solid #e5e5ea",
};
