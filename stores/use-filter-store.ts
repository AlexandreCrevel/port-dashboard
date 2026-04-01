import { create } from "zustand";

interface FilterState {
  vesselTypes: string[];
  timeRange: "24h" | "7d";
  toggleVesselType: (type: string) => void;
  setTimeRange: (range: "24h" | "7d") => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  vesselTypes: [],
  timeRange: "24h",
  toggleVesselType: (type) =>
    set((state) => ({
      vesselTypes: state.vesselTypes.includes(type)
        ? state.vesselTypes.filter((t) => t !== type)
        : [...state.vesselTypes, type],
    })),
  setTimeRange: (timeRange) => set({ timeRange }),
  resetFilters: () => set({ vesselTypes: [], timeRange: "24h" }),
}));
