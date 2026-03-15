"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
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

interface MapPickerProps {
    initialLocation?: { lat: number; lng: number };
    onLocationSelect: (lat: number, lng: number) => void;
}

// Center of South Africa approximately
const SA_CENTER: [number, number] = [-28.4793, 24.6727];

function LocationSelector({ onLocationSelect, markerPos }: { onLocationSelect: (lat: number, lng: number) => void, markerPos: L.LatLng | null }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return markerPos ? <Marker position={markerPos} /> : null;
}

// A wrapper to handle the mounting of Leaflet on the client side only
export default function MapPicker({ initialLocation, onLocationSelect }: MapPickerProps) {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState<L.LatLng | null>(
        initialLocation ? L.latLng(initialLocation.lat, initialLocation.lng) : null
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div style={{ width: "100%", height: 300, background: "#f2f2f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#8e8e93", fontSize: 15 }}>Loading map...</span>
            </div>
        );
    }

    const handleSelect = (lat: number, lng: number) => {
        setPosition(L.latLng(lat, lng));
        onLocationSelect(lat, lng);
    };

    return (
        <div style={{ width: "100%", height: 300, overflow: "hidden", ...appleMapStyle }}>
            <MapContainer
                center={initialLocation ? [initialLocation.lat, initialLocation.lng] : SA_CENTER}
                zoom={initialLocation ? 13 : 5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector onLocationSelect={handleSelect} markerPos={position} />
            </MapContainer>
        </div>
    );
}

const appleMapStyle: React.CSSProperties = {
    borderRadius: 0, // Zero rounding as requested
    borderTop: "1px solid #e5e5ea",
    borderBottom: "1px solid #e5e5ea",
};
