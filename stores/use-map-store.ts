import { create } from "zustand";
import { PORT_CONFIG } from "@/lib/constants";

interface MapState {
  center: [number, number];
  zoom: number;
  selectedVesselMmsi: string | null;
  highlightedMmsis: string[];
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  selectVessel: (mmsi: string | null) => void;
  setHighlightedMmsis: (mmsis: string[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [PORT_CONFIG.center.longitude, PORT_CONFIG.center.latitude],
  zoom: PORT_CONFIG.mapDefaults.zoom,
  selectedVesselMmsi: null,
  highlightedMmsis: [],
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  selectVessel: (mmsi) => set({ selectedVesselMmsi: mmsi }),
  setHighlightedMmsis: (mmsis) => set({ highlightedMmsis: mmsis }),
}));
