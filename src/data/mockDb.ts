export interface Location {
    lat: number;
    lng: number;
    address: string;
}

export interface Serviceltem {
    id: string;
    service: string;
    price: number;
}

export interface Customer {
    id: string;
    phone: string;
    name: string;
    carType: string;
}

export interface Business {
    id: string;
    phone: string;
    ownerName: string;
    washName: string;
    location: Location;
    pricelist: Serviceltem[];
}

export const mockCustomers: Customer[] = [
    {
        id: "c1",
        phone: "5551234567",
        name: "Leslie",
        carType: "Sedan"
    }
];

export const mockBusinesses: Business[] = [
    {
        id: "b1",
        phone: "5559876543",
        ownerName: "Thabo",
        washName: "Sparkle City Car Wash",
        location: { lat: -26.2041, lng: 28.0473, address: "Johannesburg CBD" },
        pricelist: [
            { id: "p1", service: "Standard Wash", price: 100 },
            { id: "p2", service: "Executive Valet", price: 250 }
        ]
    },
    {
        id: "b2",
        phone: "5551112222",
        ownerName: "Sarah",
        washName: "Sandton Suds",
        location: { lat: -26.1076, lng: 28.0567, address: "Sandton" },
        pricelist: [
            { id: "p3", service: "Quick Wash", price: 150 },
            { id: "p4", service: "Full Detail", price: 400 }
        ]
    },
    {
        id: "b3",
        phone: "5553334444",
        ownerName: "Sipho",
        washName: "Pretoria Pure Wash",
        location: { lat: -25.7479, lng: 28.2293, address: "Pretoria Central" },
        pricelist: [
            { id: "p5", service: "Basic Wash", price: 90 },
            { id: "p6", service: "Premium Polish", price: 300 }
        ]
    }
];

// Helper to calculate distance in kilometers using the Haversine formula
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
