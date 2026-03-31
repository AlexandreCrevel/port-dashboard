import { describe, it, expect } from 'vitest';
import { vessels, positions, weatherReadings, dailySummaries } from '../schema';

describe('schema', () => {
  it('should export vessels table', () => {
    expect(vessels).toBeDefined();
  });

  it('should export positions table', () => {
    expect(positions).toBeDefined();
  });

  it('should export weatherReadings table', () => {
    expect(weatherReadings).toBeDefined();
  });

  it('should export dailySummaries table', () => {
    expect(dailySummaries).toBeDefined();
  });
});
