import { describe, it, expect } from 'vitest';
import { sqlSafetySchema, positionSchema, nlqRequestSchema } from '../schemas';

describe('sqlSafetySchema', () => {
  it('accepts valid SELECT queries', () => {
    expect(sqlSafetySchema.safeParse('SELECT * FROM vessels').success).toBe(true);
    expect(sqlSafetySchema.safeParse("SELECT name FROM vessels WHERE mmsi = '123456789'").success).toBe(true);
  });

  it('rejects INSERT statements', () => {
    expect(sqlSafetySchema.safeParse('INSERT INTO vessels VALUES (1)').success).toBe(false);
  });

  it('rejects DROP statements', () => {
    expect(sqlSafetySchema.safeParse('DROP TABLE vessels').success).toBe(false);
  });

  it('rejects multiple statements', () => {
    expect(sqlSafetySchema.safeParse('SELECT 1; DROP TABLE vessels').success).toBe(false);
  });
});

describe('positionSchema', () => {
  it('validates correct position data', () => {
    const result = positionSchema.safeParse({
      mmsi: '123456789',
      longitude: 0.11,
      latitude: 49.49,
      speed: 12.5,
      heading: 180,
      course: 175,
      timestamp: '2026-03-30T12:00:00Z',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid MMSI', () => {
    const result = positionSchema.safeParse({
      mmsi: '12345',
      longitude: 0.11,
      latitude: 49.49,
      speed: null,
      heading: null,
      course: null,
      timestamp: new Date(),
    });
    expect(result.success).toBe(false);
  });
});

describe('nlqRequestSchema', () => {
  it('rejects queries shorter than 3 characters', () => {
    expect(nlqRequestSchema.safeParse({ query: 'ab' }).success).toBe(false);
  });

  it('accepts valid queries', () => {
    expect(nlqRequestSchema.safeParse({ query: 'Show me all tankers' }).success).toBe(true);
  });
});
