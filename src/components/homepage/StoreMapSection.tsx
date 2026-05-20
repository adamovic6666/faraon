"use client";

import {
  APIProvider,
  Map,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { storeLocations } from "@/data/store-locations";

const SILVER_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#dadada" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [{ color: "#e5e5e5" }],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [{ color: "#eeeeee" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9c9c9" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
];

// Create a helper component for the marker to keep the main component clean
const StoreMarker = ({
  location,
}: {
  location: (typeof storeLocations)[number];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Marker
        position={{ lat: location.lat, lng: location.lng }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <InfoWindow
          position={{ lat: location.lat, lng: location.lng }}
          onCloseClick={() => setOpen(false)}
        >
          <div style={{ maxWidth: "240px" }}>
            <strong>{location.name}</strong>
            <br />
            {location.address}
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const StoreMapSection = ({ isLocationPage }: { isLocationPage: boolean }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

  return (
    <section className="w-full max-w-frame mx-auto px-4 xl:px-0 mt-8 mb-8">
      <div className="rounded-xl overflow-hidden">
        <APIProvider apiKey={apiKey}>
          <Map
            style={{
              width: "100%",
              height: isLocationPage ? "600px" : "400px",
            }}
            defaultCenter={{ lat: 45.257, lng: 19.836 }}
            defaultZoom={11}
            styles={SILVER_MAP_STYLE}
          >
            {storeLocations.map((loc, i) => (
              <StoreMarker key={loc.name + i} location={loc} />
            ))}
          </Map>
        </APIProvider>
      </div>
    </section>
  );
};

export default StoreMapSection;
