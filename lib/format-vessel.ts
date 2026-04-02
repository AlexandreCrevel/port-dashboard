export const formatDimensions = (
  length: number | null,
  width: number | null,
): string => {
  if (length === null || width === null) return "N/A";
  return `${length}m × ${width}m`;
};

export const formatSpeed = (speed: number | null): string => {
  if (speed === null) return "N/A";
  return `${speed} kn`;
};

export const formatHeading = (heading: number | null): string => {
  if (heading === null) return "N/A";
  return `${heading}°`;
};

export const formatTimestamp = (date: Date | null | undefined): string => {
  if (!date) return "N/A";
  return date.toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
};
