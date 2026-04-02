"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject, MutableRefObject } from "react";
import maplibregl from "maplibre-gl";
import { PORT_CONFIG } from "@/lib/constants";

const BASEMAP_STYLE_URL =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

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

    let cancelled = false;

    fetch(BASEMAP_STYLE_URL)
      .then((res) => res.json())
      .then((style: Record<string, unknown>) => {
        if (cancelled || !containerRef.current) return;

        style.projection = style.projection ?? { type: "mercator" };

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: style as maplibregl.StyleSpecification,
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
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      setIsLoaded(false);
    };
  }, [containerRef]);

  return { mapRef, isLoaded };
};
