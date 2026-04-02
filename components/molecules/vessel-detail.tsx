"use client";

import { useMapStore } from "@/stores/use-map-store";
import { usePositions } from "@/hooks/use-positions";
import { getVesselColor } from "@/lib/vessel-category";
import {
  formatDimensions,
  formatSpeed,
  formatHeading,
  formatTimestamp,
} from "@/lib/format-vessel";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export const VesselDetail = () => {
  const selectedMmsi = useMapStore((s) => s.selectedVesselMmsi);
  const selectVessel = useMapStore((s) => s.selectVessel);
  const { data: vessels } = usePositions();

  const vessel = vessels?.find((v) => v.mmsi === selectedMmsi);
  const isOpen = selectedMmsi !== null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && selectVessel(null)}>
      <SheetContent side="right" className="w-[380px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{vessel?.name ?? "Unknown Vessel"}</SheetTitle>
          <SheetDescription>MMSI: {selectedMmsi}</SheetDescription>
        </SheetHeader>

        {vessel && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Badge
                style={{ backgroundColor: getVesselColor(vessel.vesselType) }}
                className="text-white"
              >
                {vessel.vesselType ?? "Other"}
              </Badge>
              {vessel.flag && (
                <span className="text-sm text-muted-foreground">
                  {vessel.flag}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p className="font-medium">
                  {formatDimensions(vessel.length, vessel.width)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Speed</p>
                <p className="font-medium">{formatSpeed(vessel.speed)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Heading</p>
                <p className="font-medium">{formatHeading(vessel.heading)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{formatHeading(vessel.course)}</p>
              </div>
              {vessel.destination && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Destination</p>
                  <p className="font-medium">{vessel.destination}</p>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">First seen</p>
                <p className="font-medium">
                  {formatTimestamp(vessel.firstSeen)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last seen</p>
                <p className="font-medium">
                  {formatTimestamp(vessel.lastSeen)}
                </p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
