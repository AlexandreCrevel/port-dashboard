import { describe, it, expect } from 'vitest';
import { db, dbReadonly } from '../db';

describe('db', () => {
  it('should export db instance', () => {
    expect(db).toBeDefined();
  });

  it('should export dbReadonly instance', () => {
    expect(dbReadonly).toBeDefined();
  });
});
