export const VESSEL_TYPES: Record<number, string> = {
  20: 'Wing in Ground',
  30: 'Fishing',
  31: 'Towing',
  32: 'Towing (large)',
  33: 'Dredging',
  34: 'Diving Operations',
  35: 'Military Operations',
  36: 'Sailing',
  37: 'Pleasure Craft',
  40: 'High Speed Craft',
  50: 'Pilot Vessel',
  51: 'Search and Rescue',
  52: 'Tug',
  53: 'Port Tender',
  55: 'Law Enforcement',
  60: 'Passenger',
  70: 'Cargo',
  80: 'Tanker',
  90: 'Other',
};

export const VESSEL_TYPE_CATEGORIES = {
  Cargo: [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
  Tanker: [80, 81, 82, 83, 84, 85, 86, 87, 88, 89],
  Passenger: [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
  Fishing: [30],
  Tug: [52],
  'High Speed Craft': [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  Other: [],
} as const;

export const VESSEL_TYPE_COLORS: Record<string, string> = {
  Cargo: '#3b82f6',
  Tanker: '#ef4444',
  Passenger: '#22c55e',
  Fishing: '#f59e0b',
  Tug: '#8b5cf6',
  'High Speed Craft': '#06b6d4',
  Other: '#6b7280',
};
