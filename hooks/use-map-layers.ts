"use client";

import { useEffect, type MutableRefObject } from "react";
import type { Map, GeoJSONSource, MapLayerMouseEvent } from "maplibre-gl";
import { usePositions } from "@/hooks/use-positions";
import { useMapStore } from "@/stores/use-map-store";
import { vesselsToGeoJSON } from "@/lib/map-geojson";
import {
  VESSEL_CIRCLE_LAYER,
  VESSEL_LABEL_LAYER,
  GEOFENCE_FILL_LAYER,
  GEOFENCE_LINE_LAYER,
  geofenceGeoJSON,
} from "@/lib/map-layers";

/** Adds map sources, layers, click handlers, and keeps vessel data in sync. */
export const useMapLayers = (
  mapRef: MutableRefObject<Map | null>,
  isLoaded: boolean,
): void => {
  const { data: vessels } = usePositions();
  const highlightedMmsis = useMapStore((s) => s.highlightedMmsis);

  // Initialize sources, layers, and interaction handlers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded) return;

    map.addSource("vessels", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
    map.addSource("geofence", {
      type: "geojson",
      data: geofenceGeoJSON(),
    });

    map.addLayer(GEOFENCE_FILL_LAYER);
    map.addLayer(GEOFENCE_LINE_LAYER);
    map.addLayer(VESSEL_CIRCLE_LAYER);
    map.addLayer(VESSEL_LABEL_LAYER);

    const handleClick = (e: MapLayerMouseEvent) => {
      const mmsi = e.features?.[0]?.properties?.mmsi;
      if (typeof mmsi === "string") {
        useMapStore.getState().selectVessel(mmsi);
      }
    };

    const handleEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const handleLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    map.on("click", "vessel-circles", handleClick);
    map.on("mouseenter", "vessel-circles", handleEnter);
    map.on("mouseleave", "vessel-circles", handleLeave);

    return () => {
      map.off("click", "vessel-circles", handleClick);
      map.off("mouseenter", "vessel-circles", handleEnter);
      map.off("mouseleave", "vessel-circles", handleLeave);
    };
  }, [mapRef, isLoaded]);

  // Sync vessel GeoJSON data when positions or highlights change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoaded || !vessels) return;

    const source = map.getSource("vessels") as GeoJSONSource | undefined;
    source?.setData(vesselsToGeoJSON(vessels, highlightedMmsis));
  }, [mapRef, isLoaded, vessels, highlightedMmsis]);
};
