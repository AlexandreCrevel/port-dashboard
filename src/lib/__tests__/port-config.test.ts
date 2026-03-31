import { describe, it, expect } from 'vitest';
import { PORT_CONFIG } from '../constants';

describe('PORT_CONFIG', () => {
  it('has valid center coordinates for Le Havre', () => {
    expect(PORT_CONFIG.center.latitude).toBeCloseTo(49.49, 1);
    expect(PORT_CONFIG.center.longitude).toBeCloseTo(0.11, 1);
  });

  it('has bounding box that contains center', () => {
    const { center, boundingBox } = PORT_CONFIG;
    expect(center.latitude).toBeGreaterThan(boundingBox.min.latitude);
    expect(center.latitude).toBeLessThan(boundingBox.max.latitude);
    expect(center.longitude).toBeGreaterThan(boundingBox.min.longitude);
    expect(center.longitude).toBeLessThan(boundingBox.max.longitude);
  });

  it('has closed geofence polygon', () => {
    const geo = PORT_CONFIG.geofence;
    expect(geo[0]).toEqual(geo[geo.length - 1]);
  });
});
