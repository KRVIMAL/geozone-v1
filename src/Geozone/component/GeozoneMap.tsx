import React, { RefObject } from 'react';

interface GeozoneMapProps {
  mapRef: RefObject<HTMLDivElement>;
}

const GeozoneMap: React.FC<GeozoneMapProps> = ({ mapRef }) => {
  return (
    <div className="flex-1 relative">
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
        id="map"
      ></div>
    </div>
  );
};

export default GeozoneMap;