import { describe, it, expect } from 'vitest';
import { VESSEL_TYPE_COLORS, VESSEL_TYPE_CATEGORIES } from '../constants';

describe('VESSEL_TYPE_CATEGORIES', () => {
  it('has a color for every category', () => {
    for (const category of Object.keys(VESSEL_TYPE_CATEGORIES)) {
      expect(VESSEL_TYPE_COLORS).toHaveProperty(category);
    }
  });
});
