"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject, MutableRefObject } from "react";
import maplibregl from "maplibre-gl";
import { PORT_CONFIG } from "@/lib/constants";

interface UseMapReturn {
  mapRef: MutableRefObject<maplibregl.Map | null>;
  isLoaded: boolean;
}

export const useMap = (
  containerRef: RefObject<HTMLDivElement | null>,
): UseMapReturn => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [PORT_CONFIG.center.longitude, PORT_CONFIG.center.latitude],
      zoom: PORT_CONFIG.mapDefaults.zoom,
      minZoom: PORT_CONFIG.mapDefaults.minZoom,
      maxZoom: PORT_CONFIG.mapDefaults.maxZoom,
      maxBounds: [
        [
          PORT_CONFIG.boundingBox.min.longitude,
          PORT_CONFIG.boundingBox.min.latitude,
        ],
        [
          PORT_CONFIG.boundingBox.max.longitude,
          PORT_CONFIG.boundingBox.max.latitude,
        ],
      ],
    });

    map.on("load", () => setIsLoaded(true));
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
  }, [containerRef]);

  return { mapRef, isLoaded };
};
