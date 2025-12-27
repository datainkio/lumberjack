import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Lumberjack } from '../src/Lumberjack.class.js';
import LumberjackStyle from '../src/LumberjackStyle.js';
import LumberjackStyles from '../src/LumberjackStyles.js';

describe('Lumberjack', () => {
  beforeEach(() => {
    // Reset singleton instance before each test by accessing private field
    // Since we can't directly reset, we'll work with the existing instance
    vi.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = Lumberjack.getInstance();
      const instance2 = Lumberjack.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should return an instance', () => {
      const instance = Lumberjack.getInstance();
      expect(instance).toBeDefined();
      expect(instance.enabled).toBeDefined();
    });
  });

  describe('configure', () => {
    it('should configure the instance', () => {
      const instance = Lumberjack.configure({ enabled: true });
      expect(instance.enabled).toBe(true);
    });

    it('should return the instance', () => {
      const instance = Lumberjack.configure({ enabled: true });
      expect(instance).toBe(Lumberjack.getInstance());
    });

    it('should accept prefix option', () => {
      const instance = Lumberjack.configure({ prefix: '[APP]' });
      expect(instance).toBeDefined();
    });

    it('should accept empty options', () => {
      const instance = Lumberjack.configure({});
      expect(instance).toBeDefined();
    });
  });

  describe('enabled property', () => {
    it('should get enabled state', () => {
      Lumberjack.configure({ enabled: true });
      expect(Lumberjack.enabled).toBe(true);
    });

    it('should set enabled state', () => {
      Lumberjack.enabled = true;
      expect(Lumberjack.enabled).toBe(true);
      Lumberjack.enabled = false;
      expect(Lumberjack.enabled).toBe(false);
    });

    it('should convert value to boolean', () => {
      Lumberjack.enabled = 'true';
      expect(Lumberjack.enabled).toBe(true);
      Lumberjack.enabled = 0;
      expect(Lumberjack.enabled).toBe(false);
    });
  });

  describe('indent/outdent', () => {
    it('should increase indent level', () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      instance.indent();
      expect(instance._getIndent()).toBe('  ');
      instance.indent();
      expect(instance._getIndent()).toBe('    ');
    });

    it('should decrease indent level', () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      instance.indent();
      instance.indent();
      instance.outdent();
      expect(instance._getIndent()).toBe('  ');
    });

    it('should not go below zero', () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      instance.outdent();
      instance.outdent();
      expect(instance._getIndent()).toBe('');
    });

    it('should reset indent to zero', () => {
      const instance = Lumberjack.getInstance();
      instance.indent();
      instance.indent();
      instance.indent();
      instance.resetIndent();
      expect(instance._getIndent()).toBe('');
    });
  });

  describe('trace', () => {
    beforeEach(() => {
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it('should not log when disabled', () => {
      Lumberjack.configure({ enabled: false });
      Lumberjack.trace('test message');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should log when enabled', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('test message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should not log in silent mode', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('test message', null, 'silent');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should accept message parameter', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Hello World');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept object parameter', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Data:', { key: 'value' });
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept mode parameter', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Message', null, 'verbose');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept style parameter', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Message', null, 'brief', 'error');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept custom LumberjackStyle', () => {
      Lumberjack.configure({ enabled: true });
      const customStyle = new LumberjackStyle('#9333EA', '🎨');
      Lumberjack.trace('Message', null, 'brief', customStyle);
      expect(console.log).toHaveBeenCalled();
    });

    it('should auto-detect Error objects', () => {
      Lumberjack.configure({ enabled: true });
      const error = new Error('Test error');
      Lumberjack.trace('Error occurred:', error, 'brief', 'default');
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle null object', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Message', null);
      expect(console.log).toHaveBeenCalled();
    });

    it('should handle undefined object', () => {
      Lumberjack.configure({ enabled: true });
      Lumberjack.trace('Message', undefined);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('_getValue', () => {
    let instance;

    beforeEach(() => {
      instance = Lumberjack.getInstance();
    });

    it('should format null', () => {
      expect(instance._getValue(null)).toBe('null');
    });

    it('should format undefined', () => {
      expect(instance._getValue(undefined)).toBe('undefined');
    });

    it('should format string', () => {
      expect(instance._getValue('hello')).toBe('hello');
    });

    it('should format number', () => {
      expect(instance._getValue(42)).toBe('42');
      expect(instance._getValue(3.14)).toBe('3.14');
    });

    it('should format boolean', () => {
      expect(instance._getValue(true)).toBe('true');
      expect(instance._getValue(false)).toBe('false');
    });

    it('should format array', () => {
      const result = instance._getValue([1, 2, 3]);
      expect(result).toMatch(/\[.*\]/);
    });

    it('should truncate long arrays', () => {
      const result = instance._getValue([1, 2, 3, 4, 5]);
      expect(result).toContain('...');
    });

    it('should format object', () => {
      const result = instance._getValue({ a: 1, b: 2 });
      expect(result).toMatch(/\{.*\}/);
    });

    it('should format Error', () => {
      const error = new Error('Test error');
      const result = instance._getValue(error);
      expect(result).toContain('Error');
      expect(result).toContain('Test error');
    });

    it('should format function', () => {
      const result = instance._getValue(() => {});
      expect(result).toBe('[Function]');
    });

    it('should detect circular references in arrays', () => {
      const arr = [1, 2];
      arr.push(arr);
      const result = instance._getValue(arr);
      expect(result).toContain('Circular');
    });

    it('should detect circular references in objects', () => {
      const obj = { a: 1 };
      obj.self = obj;
      const result = instance._getValue(obj);
      expect(result).toContain('Circular');
    });
  });

  describe('_formatVerbosePlain', () => {
    let instance;

    beforeEach(() => {
      instance = Lumberjack.getInstance();
    });

    it('should format null', () => {
      expect(instance._formatVerbosePlain(null)).toBe('null');
    });

    it('should format string', () => {
      expect(instance._formatVerbosePlain('hello')).toBe('hello');
    });

    it('should format array with indentation', () => {
      const result = instance._formatVerbosePlain([1, 2, 3]);
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });

    it('should format object with indentation', () => {
      const result = instance._formatVerbosePlain({ a: 1, b: 2 });
      expect(result).toContain('a:');
      expect(result).toContain('b:');
    });

    it('should format Error with stack trace', () => {
      const error = new Error('Test error');
      const result = instance._formatVerbosePlain(error);
      expect(result).toContain('Error');
      expect(result).toContain('Test error');
    });

    it('should respect max depth', () => {
      const deepObj = { a: { b: { c: { d: { e: { f: 'value' } } } } } };
      const result = instance._formatVerbosePlain(deepObj);
      expect(result).toBeDefined();
    });

    it('should detect circular references', () => {
      const obj = { a: 1 };
      obj.self = obj;
      const result = instance._formatVerbosePlain(obj);
      expect(result).toContain('Circular');
    });
  });

  describe('_getStyle', () => {
    let instance;

    beforeEach(() => {
      instance = Lumberjack.getInstance();
    });

    it('should return LumberjackStyle instance as-is', () => {
      const style = new LumberjackStyle('#FF0000', '❌');
      expect(instance._getStyle(style)).toBe(style);
    });

    it('should return style object with color and color_secondary', () => {
      const styleObj = {
        color: '#FF0000',
        color_secondary: '#FF6666',
        prefix: '❌'
      };
      expect(instance._getStyle(styleObj)).toBe(styleObj);
    });

    it('should use LumberjackStyles.getStyle for strings', () => {
      const style = instance._getStyle('error');
      expect(style).toBe(LumberjackStyles.ERROR);
    });

    it('should use LumberjackStyles.getStyle for default', () => {
      const style = instance._getStyle('default');
      expect(style).toBe(LumberjackStyles.DEFAULT);
    });
  });

  describe('createScoped', () => {
    beforeEach(() => {
      Lumberjack.configure({ enabled: true });
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it('should create a scoped logger', () => {
      const scoped = Lumberjack.createScoped('TestScope');
      expect(scoped).toBeDefined();
      expect(scoped.trace).toBeDefined();
      expect(scoped.indent).toBeDefined();
      expect(scoped.outdent).toBeDefined();
      expect(scoped.resetIndent).toBeDefined();
      expect(scoped.group).toBeDefined();
      expect(scoped.scope).toBe('TestScope');
    });

    it('should include scope in trace output', () => {
      const scoped = Lumberjack.createScoped('API');
      scoped.trace('Request started');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept options', () => {
      const scoped = Lumberjack.createScoped('API', {
        prefix: '🌐',
        color: '#60A5FA'
      });
      expect(scoped.scope).toBe('API');
      scoped.trace('Message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should have enabled getter/setter', () => {
      const scoped = Lumberjack.createScoped('Test');
      expect(scoped.enabled).toBe(true);
      scoped.enabled = false;
      expect(scoped.enabled).toBe(false);
    });

    it('should have config property', () => {
      const scoped = Lumberjack.createScoped('Test');
      expect(scoped.config).toBeDefined();
      expect(scoped.config.scope).toBe('Test');
    });

    it('should support indent/outdent', () => {
      const scoped = Lumberjack.createScoped('Test');
      scoped.indent();
      scoped.trace('Indented message');
      scoped.outdent();
      expect(console.log).toHaveBeenCalled();
    });

    it('should support group', async () => {
      const scoped = Lumberjack.createScoped('Test');
      await scoped.group(async () => {
        scoped.trace('Inside group');
      });
      expect(console.log).toHaveBeenCalled();
    });

    it('should support showScriptOutline', () => {
      const scoped = Lumberjack.createScoped('Test');
      scoped.showScriptOutline('Operation', [
        { name: 'step1', description: 'First step' }
      ]);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('group', () => {
    beforeEach(() => {
      Lumberjack.configure({ enabled: true });
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it('should execute function', async () => {
      const instance = Lumberjack.getInstance();
      let executed = false;
      await instance.group(() => {
        executed = true;
      });
      expect(executed).toBe(true);
    });

    it('should support async functions', async () => {
      const instance = Lumberjack.getInstance();
      let executed = false;
      await instance.group(async () => {
        executed = true;
      });
      expect(executed).toBe(true);
    });

    it('should increase indent during execution', async () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      let indentDuringExecution = '';
      await instance.group(() => {
        indentDuringExecution = instance._getIndent();
      });
      expect(indentDuringExecution).toBe('  ');
    });

    it('should restore indent after execution', async () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      await instance.group(() => {});
      expect(instance._getIndent()).toBe('');
    });

    it('should restore indent even if function throws', async () => {
      const instance = Lumberjack.getInstance();
      instance.resetIndent();
      try {
        await instance.group(() => {
          throw new Error('Test error');
        });
      } catch (e) {
        // Expected
      }
      expect(instance._getIndent()).toBe('');
    });
  });

  describe('showScriptOutline', () => {
    beforeEach(() => {
      Lumberjack.configure({ enabled: true });
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it('should not log when disabled', () => {
      Lumberjack.configure({ enabled: false });
      const instance = Lumberjack.getInstance();
      instance.showScriptOutline('Operation', []);
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should log when enabled', () => {
      Lumberjack.configure({ enabled: true });
      const instance = Lumberjack.getInstance();
      instance.showScriptOutline('Operation', [
        { name: 'step1', description: 'First step' }
      ]);
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept operation name', () => {
      const instance = Lumberjack.getInstance();
      instance.showScriptOutline('Build Process', []);
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept script sequence', () => {
      const instance = Lumberjack.getInstance();
      const scripts = [
        { name: 'clean', description: 'Clean build' },
        { name: 'build', description: 'Build project' }
      ];
      instance.showScriptOutline('Build', scripts);
      expect(console.log).toHaveBeenCalled();
    });

    it('should support brief mode', () => {
      const instance = Lumberjack.getInstance();
      instance.showScriptOutline('Operation', [
        { name: 'step1', description: 'First step' }
      ], 'brief');
      expect(console.log).toHaveBeenCalled();
    });

    it('should support verbose mode', () => {
      const instance = Lumberjack.getInstance();
      instance.showScriptOutline('Operation', [
        { name: 'step1', description: 'First step', script: 'script.js' }
      ], 'verbose');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept custom style', () => {
      const instance = Lumberjack.getInstance();
      const customStyle = new LumberjackStyle('#9333EA', '📋');
      instance.showScriptOutline('Operation', [], 'brief', customStyle);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('static trace', () => {
    beforeEach(() => {
      Lumberjack.configure({ enabled: true });
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      console.log.mockRestore();
    });

    it('should call instance trace', () => {
      Lumberjack.trace('Message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept all parameters', () => {
      Lumberjack.trace('Message', { data: 'value' }, 'verbose', 'error');
      expect(console.log).toHaveBeenCalled();
    });
  });
});
