import { VESSEL_TYPE_COLORS } from "@/lib/constants";

export const getVesselColor = (vesselType: string | null): string => {
  if (!vesselType || !(vesselType in VESSEL_TYPE_COLORS)) {
    return VESSEL_TYPE_COLORS.Other;
  }
  return VESSEL_TYPE_COLORS[vesselType];
};
