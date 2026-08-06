import { describe, it, expect } from 'vitest';
import { tap, diff } from './tap';

describe('httptap library', () => {
  it('should export tap and diff functions', () => {
    expect(typeof tap).toBe('function');
    expect(typeof diff).toBe('function');
  });
});
