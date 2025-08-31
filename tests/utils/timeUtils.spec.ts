import { isSameHour } from '../../src/utils/timeUtils';

describe('timeUtils', () => {
  describe('isSameHour', () => {
    it.each([
      { time1: '2025-01-01T00:00:00Z', time2: '2025-01-01T00:45:00Z', expected: true },
      { time1: '2025-01-01T13:00:00Z', time2: '2025-01-01T14:00:00Z', expected: false },
      { time1: 1704110400000, time2: 1704111600000, expected: true },
      { time1: 1704110400000, time2: 1704114000000, expected: false },
    ])(
      'should return $expected when comparing if $time1 and $time2 are in the same hour',
      ({ time1, time2, expected }) => {
        expect(isSameHour(time1, time2)).toBe(expected);
      },
    );
  });
});
