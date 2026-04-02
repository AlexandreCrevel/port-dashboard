"use client";

import { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMap } from "@/hooks/use-map";
import { useMapLayers } from "@/hooks/use-map-layers";

export const MapView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapRef, isLoaded } = useMap(containerRef);
  useMapLayers(mapRef, isLoaded);

  return <div ref={containerRef} className="w-full h-full min-h-[400px]" />;
};
