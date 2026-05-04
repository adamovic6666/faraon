"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { useState } from "react";
import { storeLocations } from "@/data/store-locations";

// Create a helper component for the marker to keep the main component clean
const StoreMarker = ({
  location,
}: {
  location: (typeof storeLocations)[number];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker
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
            mapId="YOUR_MAP_ID"
            colorScheme="DARK"
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
