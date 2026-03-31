import { describe, it, expect } from 'vitest';
import {
  getVesselsInZone,
  getPositionsSince,
  getTrafficTimeline,
  getLatestWeather,
  getWeatherHistory,
  getLatestSummary,
  getSummaryByDate,
  executeNlqQuery,
  getKpiMetrics,
} from '../queries';

describe('queries', () => {
  it('should export getVesselsInZone', () => expect(getVesselsInZone).toBeDefined());
  it('should export getPositionsSince', () => expect(getPositionsSince).toBeDefined());
  it('should export getTrafficTimeline', () => expect(getTrafficTimeline).toBeDefined());
  it('should export getLatestWeather', () => expect(getLatestWeather).toBeDefined());
  it('should export getWeatherHistory', () => expect(getWeatherHistory).toBeDefined());
  it('should export getLatestSummary', () => expect(getLatestSummary).toBeDefined());
  it('should export getSummaryByDate', () => expect(getSummaryByDate).toBeDefined());
  it('should export executeNlqQuery', () => expect(executeNlqQuery).toBeDefined());
  it('should export getKpiMetrics', () => expect(getKpiMetrics).toBeDefined());
});
