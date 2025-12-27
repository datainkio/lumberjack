import { describe, it, expect } from 'vitest';
import brighten from '../src/utils.js';

describe('brighten', () => {
  it('should brighten a 6-digit hex color', () => {
    const result = brighten('#6B7280', 0.2);
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
    // #6B7280 brightened by 20% should be lighter
    expect(result).toBe('#808899');
  });

  it('should brighten a 3-digit hex color', () => {
    const result = brighten('#FFF', 0.1);
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should handle hex colors without # prefix', () => {
    const result = brighten('6B7280', 0.2);
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should cap RGB values at 255', () => {
    const result = brighten('#FFFFFF', 0.5);
    expect(result).toBe('#ffffff');
  });

  it('should handle black color', () => {
    const result = brighten('#000000', 0.2);
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should handle zero percent brightening', () => {
    const result = brighten('#6B7280', 0);
    expect(result).toBe('#6b7280');
  });

  it('should handle negative percent (darkening)', () => {
    const result = brighten('#FFFFFF', -0.2);
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should expand 3-digit hex to 6-digit correctly', () => {
    const result = brighten('#ABC', 0);
    expect(result).toBe('#aabbcc');
  });
});
