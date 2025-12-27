import { describe, it, expect, beforeEach } from 'vitest';
import LumberjackStyle from '../src/LumberjackStyle.js';

describe('LumberjackStyle', () => {
  describe('constructor', () => {
    it('should create a style with color and prefix', () => {
      const style = new LumberjackStyle('#FF0000', '❌');
      expect(style.color).toBe('#FF0000');
      expect(style.prefix).toBe('❌');
    });

    it('should create a style with default prefix', () => {
      const style = new LumberjackStyle('#FF0000');
      expect(style.prefix).toBe('');
    });

    it('should create a style with fontWeight and fontSize', () => {
      const style = new LumberjackStyle('#FF0000', '❌', 'bold', 14);
      expect(style.fontWeight).toBe('bold');
      expect(style.fontSize).toBe(14);
    });

    it('should throw error for invalid color', () => {
      expect(() => new LumberjackStyle('red')).toThrow();
      expect(() => new LumberjackStyle(null)).toThrow();
      expect(() => new LumberjackStyle(123)).toThrow();
    });

    it('should throw error for invalid fontWeight type', () => {
      expect(() => new LumberjackStyle('#FF0000', '❌', 123)).toThrow();
    });

    it('should throw error for invalid fontSize', () => {
      expect(() => new LumberjackStyle('#FF0000', '❌', 'normal', -1)).toThrow();
      expect(() => new LumberjackStyle('#FF0000', '❌', 'normal', 12.5)).toThrow();
      expect(() => new LumberjackStyle('#FF0000', '❌', 'normal', 'large')).toThrow();
    });

    it('should freeze the object to prevent modifications', () => {
      const style = new LumberjackStyle('#FF0000', '❌');
      expect(() => {
        style.color = '#00FF00';
      }).toThrow();
    });
  });

  describe('color_secondary', () => {
    it('should return a brightened color', () => {
      const style = new LumberjackStyle('#6B7280', '');
      const secondary = style.color_secondary;
      expect(secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(secondary).not.toBe(style.color);
    });

    it('should brighten consistently', () => {
      const style1 = new LumberjackStyle('#6B7280', '');
      const style2 = new LumberjackStyle('#6B7280', '');
      expect(style1.color_secondary).toBe(style2.color_secondary);
    });
  });

  describe('getters', () => {
    it('should return color', () => {
      const style = new LumberjackStyle('#FF0000', '❌');
      expect(style.color).toBe('#FF0000');
    });

    it('should return prefix', () => {
      const style = new LumberjackStyle('#FF0000', '⚡');
      expect(style.prefix).toBe('⚡');
    });

    it('should return fontWeight', () => {
      const style = new LumberjackStyle('#FF0000', '', 'bold', 12);
      expect(style.fontWeight).toBe('bold');
    });

    it('should return fontSize', () => {
      const style = new LumberjackStyle('#FF0000', '', 'normal', 16);
      expect(style.fontSize).toBe(16);
    });

    it('should return default fontWeight when not provided', () => {
      const style = new LumberjackStyle('#FF0000', '');
      expect(style.fontWeight).toBe('normal');
    });

    it('should return default fontSize when not provided', () => {
      const style = new LumberjackStyle('#FF0000', '');
      expect(style.fontSize).toBe(12);
    });
  });

  describe('edge cases', () => {
    it('should accept lowercase hex colors', () => {
      const style = new LumberjackStyle('#ff0000', '❌');
      expect(style.color).toBe('#ff0000');
    });

    it('should accept mixed case hex colors', () => {
      const style = new LumberjackStyle('#FfAaBb', '');
      expect(style.color).toBe('#FfAaBb');
    });

    it('should accept empty prefix', () => {
      const style = new LumberjackStyle('#FF0000', '');
      expect(style.prefix).toBe('');
    });

    it('should accept multi-character prefix', () => {
      const style = new LumberjackStyle('#FF0000', '❌ ERROR');
      expect(style.prefix).toBe('❌ ERROR');
    });

    it('should accept fontSize of 0', () => {
      const style = new LumberjackStyle('#FF0000', '', 'normal', 0);
      expect(style.fontSize).toBe(0);
    });
  });
});
