import dynamic from "next/dynamic";
import { VesselDetail } from "@/components/molecules/vessel-detail";

const MapView = dynamic(
  () => import("@/components/organisms/map-view").then((m) => m.MapView),
  {
    ssr: false,
  },
);

export default function Home() {
  return (
    <main className="h-screen w-full relative">
      <MapView />
      <VesselDetail />
    </main>
  );
}
