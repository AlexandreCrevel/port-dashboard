"use client";

import dynamic from "next/dynamic";
import { VesselDetail } from "@/components/molecules/vessel-detail";

const MapView = dynamic(
  () => import("@/components/organisms/map-view").then((m) => m.MapView),
  { ssr: false },
);

export const MapContainer = () => (
  <>
    <MapView />
    <VesselDetail />
  </>
);
