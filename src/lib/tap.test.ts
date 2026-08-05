import { describe, it, expect, vi } from 'vitest';
import { tap } from './tap';

// Mock execSync to avoid actual network calls
vi.mock('child_process', () => ({
  execSync: vi.fn().mockReturnValue('{"success": true}\n200')
}));

describe('httptap', () => {
  it('should be defined', () => {
    expect(tap).toBeDefined();
  });
});
