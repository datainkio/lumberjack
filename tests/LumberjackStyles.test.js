import { describe, it, expect } from 'vitest';
import LumberjackStyles from '../src/LumberjackStyles.js';
import LumberjackStyle from '../src/LumberjackStyle.js';

describe('LumberjackStyles', () => {
  describe('static styles', () => {
    it('should have DEFAULT style', () => {
      expect(LumberjackStyles.DEFAULT).toBeInstanceOf(LumberjackStyle);
      expect(LumberjackStyles.DEFAULT.color).toBe('#CCCCCC');
      expect(LumberjackStyles.DEFAULT.prefix).toBe('');
      expect(LumberjackStyles.DEFAULT.fontWeight).toBe('normal');
      expect(LumberjackStyles.DEFAULT.fontSize).toBe(12);
    });

    it('should have HEADSUP style', () => {
      expect(LumberjackStyles.HEADSUP).toBeInstanceOf(LumberjackStyle);
      expect(LumberjackStyles.HEADSUP.color).toBe('#F59E0B');
      expect(LumberjackStyles.HEADSUP.prefix).toBe('⚡');
    });

    it('should have ERROR style', () => {
      expect(LumberjackStyles.ERROR).toBeInstanceOf(LumberjackStyle);
      expect(LumberjackStyles.ERROR.color).toBe('#EF4444');
      expect(LumberjackStyles.ERROR.prefix).toBe('❌');
    });

    it('should have SUCCESS style', () => {
      expect(LumberjackStyles.SUCCESS).toBeInstanceOf(LumberjackStyle);
      expect(LumberjackStyles.SUCCESS.color).toBe('#10B981');
      expect(LumberjackStyles.SUCCESS.prefix).toBe('');
    });

    it('should have SEPARATOR constant', () => {
      expect(LumberjackStyles.SEPARATOR).toBe('::::::::::::::::::');
    });
  });

  describe('getStyle', () => {
    it('should return DEFAULT for null', () => {
      expect(LumberjackStyles.getStyle(null)).toBe(LumberjackStyles.DEFAULT);
    });

    it('should return DEFAULT for undefined', () => {
      expect(LumberjackStyles.getStyle(undefined)).toBe(LumberjackStyles.DEFAULT);
    });

    it('should return DEFAULT for empty string', () => {
      expect(LumberjackStyles.getStyle('')).toBe(LumberjackStyles.DEFAULT);
    });

    it('should return HEADSUP for "headsup"', () => {
      expect(LumberjackStyles.getStyle('headsup')).toBe(LumberjackStyles.HEADSUP);
    });

    it('should return ERROR for "error"', () => {
      expect(LumberjackStyles.getStyle('error')).toBe(LumberjackStyles.ERROR);
    });

    it('should return SUCCESS for "success"', () => {
      expect(LumberjackStyles.getStyle('success')).toBe(LumberjackStyles.SUCCESS);
    });

    it('should return DEFAULT for "default"', () => {
      expect(LumberjackStyles.getStyle('default')).toBe(LumberjackStyles.DEFAULT);
    });

    it('should be case-insensitive', () => {
      expect(LumberjackStyles.getStyle('HEADSUP')).toStrictEqual(LumberjackStyles.HEADSUP);
      expect(LumberjackStyles.getStyle('HeAdUp')).toStrictEqual(LumberjackStyles.HEADSUP);
      expect(LumberjackStyles.getStyle('ERROR')).toStrictEqual(LumberjackStyles.ERROR);
      expect(LumberjackStyles.getStyle('Success')).toStrictEqual(LumberjackStyles.SUCCESS);
    });

    it('should return DEFAULT for unknown string', () => {
      expect(LumberjackStyles.getStyle('unknown')).toBe(LumberjackStyles.DEFAULT);
    });

    it('should accept LumberjackStyle instance', () => {
      const customStyle = new LumberjackStyle('#9333EA', '🎨');
      expect(LumberjackStyles.getStyle(customStyle)).toBe(customStyle);
    });

    it('should accept object with color and color_secondary', () => {
      const styleObj = {
        color: '#9333EA',
        color_secondary: '#a855f7',
        prefix: '🎨'
      };
      expect(LumberjackStyles.getStyle(styleObj)).toBe(styleObj);
    });

    it('should return DEFAULT for non-string non-object types', () => {
      expect(LumberjackStyles.getStyle(123)).toBe(LumberjackStyles.DEFAULT);
      expect(LumberjackStyles.getStyle(true)).toBe(LumberjackStyles.DEFAULT);
      expect(LumberjackStyles.getStyle([])).toBe(LumberjackStyles.DEFAULT);
    });

    it('should return DEFAULT for object without required properties', () => {
      expect(LumberjackStyles.getStyle({ color: '#FF0000' })).toBe(LumberjackStyles.DEFAULT);
      expect(LumberjackStyles.getStyle({ color_secondary: '#FF0000' })).toBe(LumberjackStyles.DEFAULT);
    });
  });

  describe('style immutability', () => {
    it('should not allow modification of DEFAULT style', () => {
      expect(() => {
        LumberjackStyles.DEFAULT.color = '#FF0000';
      }).toThrow();
    });

    it('should not allow modification of HEADSUP style', () => {
      expect(() => {
        LumberjackStyles.HEADSUP.prefix = '⚠️';
      }).toThrow();
    });

    it('should not allow modification of ERROR style', () => {
      expect(() => {
        LumberjackStyles.ERROR.fontSize = 16;
      }).toThrow();
    });

    it('should not allow modification of SUCCESS style', () => {
      expect(() => {
        LumberjackStyles.SUCCESS.fontWeight = 'bold';
      }).toThrow();
    });
  });

  describe('color_secondary', () => {
    it('should return brightened color for DEFAULT', () => {
      const secondary = LumberjackStyles.DEFAULT.color_secondary;
      expect(secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(secondary).not.toBe(LumberjackStyles.DEFAULT.color);
    });

    it('should return brightened color for HEADSUP', () => {
      const secondary = LumberjackStyles.HEADSUP.color_secondary;
      expect(secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(secondary).not.toBe(LumberjackStyles.HEADSUP.color);
    });

    it('should return brightened color for ERROR', () => {
      const secondary = LumberjackStyles.ERROR.color_secondary;
      expect(secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(secondary).not.toBe(LumberjackStyles.ERROR.color);
    });

    it('should return brightened color for SUCCESS', () => {
      const secondary = LumberjackStyles.SUCCESS.color_secondary;
      expect(secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(secondary).not.toBe(LumberjackStyles.SUCCESS.color);
    });
  });
});
