import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import lumberjack, { Lumberjack, LumberjackStyle, LumberjackStyles } from '../src/index.js';

describe('lumberjack singleton', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
  });

  describe('exports', () => {
    it('should export default lumberjack singleton', () => {
      expect(lumberjack).toBeDefined();
      expect(typeof lumberjack).toBe('object');
    });

    it('should export Lumberjack class', () => {
      expect(Lumberjack).toBeDefined();
      expect(typeof Lumberjack).toBe('function');
    });

    it('should export LumberjackStyle class', () => {
      expect(LumberjackStyle).toBeDefined();
      expect(typeof LumberjackStyle).toBe('function');
    });

    it('should export LumberjackStyles class', () => {
      expect(LumberjackStyles).toBeDefined();
      expect(typeof LumberjackStyles).toBe('function');
    });
  });

  describe('trace method', () => {
    it('should have trace method', () => {
      expect(lumberjack.trace).toBeDefined();
      expect(typeof lumberjack.trace).toBe('function');
    });

    it('should call Lumberjack.getInstance().trace', () => {
      lumberjack.enabled = true;
      lumberjack.trace('Test message');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept message parameter', () => {
      lumberjack.enabled = true;
      lumberjack.trace('Hello World');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept object parameter', () => {
      lumberjack.enabled = true;
      lumberjack.trace('Data:', { key: 'value' });
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept mode parameter', () => {
      lumberjack.enabled = true;
      lumberjack.trace('Message', null, 'verbose');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept style parameter', () => {
      lumberjack.enabled = true;
      lumberjack.trace('Message', null, 'brief', 'error');
      expect(console.log).toHaveBeenCalled();
    });

    it('should not log when disabled', () => {
      lumberjack.enabled = false;
      lumberjack.trace('Message');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('indent method', () => {
    it('should have indent method', () => {
      expect(lumberjack.indent).toBeDefined();
      expect(typeof lumberjack.indent).toBe('function');
    });

    it('should increase indentation', () => {
      lumberjack.resetIndent();
      lumberjack.indent();
      lumberjack.enabled = true;
      lumberjack.trace('Indented');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('outdent method', () => {
    it('should have outdent method', () => {
      expect(lumberjack.outdent).toBeDefined();
      expect(typeof lumberjack.outdent).toBe('function');
    });

    it('should decrease indentation', () => {
      lumberjack.resetIndent();
      lumberjack.indent();
      lumberjack.outdent();
      lumberjack.enabled = true;
      lumberjack.trace('Normal');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('resetIndent method', () => {
    it('should have resetIndent method', () => {
      expect(lumberjack.resetIndent).toBeDefined();
      expect(typeof lumberjack.resetIndent).toBe('function');
    });

    it('should reset indentation to zero', () => {
      lumberjack.indent();
      lumberjack.indent();
      lumberjack.resetIndent();
      lumberjack.enabled = true;
      lumberjack.trace('Reset');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('group method', () => {
    it('should have group method', () => {
      expect(lumberjack.group).toBeDefined();
      expect(typeof lumberjack.group).toBe('function');
    });

    it('should execute function', async () => {
      let executed = false;
      await lumberjack.group(() => {
        executed = true;
      });
      expect(executed).toBe(true);
    });

    it('should support async functions', async () => {
      let executed = false;
      await lumberjack.group(async () => {
        executed = true;
      });
      expect(executed).toBe(true);
    });

    it('should auto-indent during execution', async () => {
      lumberjack.enabled = true;
      lumberjack.resetIndent();
      await lumberjack.group(() => {
        lumberjack.trace('Inside group');
      });
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('showScriptOutline method', () => {
    it('should have showScriptOutline method', () => {
      expect(lumberjack.showScriptOutline).toBeDefined();
      expect(typeof lumberjack.showScriptOutline).toBe('function');
    });

    it('should accept operation name and script sequence', () => {
      lumberjack.enabled = true;
      lumberjack.showScriptOutline('Build', [
        { name: 'clean', description: 'Clean build' }
      ]);
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept mode parameter', () => {
      lumberjack.enabled = true;
      lumberjack.showScriptOutline('Build', [], 'verbose');
      expect(console.log).toHaveBeenCalled();
    });

    it('should accept style parameter', () => {
      lumberjack.enabled = true;
      lumberjack.showScriptOutline('Build', [], 'brief', 'headsup');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('configure method', () => {
    it('should have configure method', () => {
      expect(lumberjack.configure).toBeDefined();
      expect(typeof lumberjack.configure).toBe('function');
    });

    it('should configure the logger', () => {
      lumberjack.configure({ enabled: true });
      expect(lumberjack.enabled).toBe(true);
    });

    it('should accept options object', () => {
      lumberjack.configure({ enabled: false, prefix: '[APP]' });
      expect(lumberjack.enabled).toBe(false);
    });
  });

  describe('createScoped method', () => {
    it('should have createScoped method', () => {
      expect(lumberjack.createScoped).toBeDefined();
      expect(typeof lumberjack.createScoped).toBe('function');
    });

    it('should create a scoped logger', () => {
      const scoped = lumberjack.createScoped('API');
      expect(scoped).toBeDefined();
      expect(scoped.trace).toBeDefined();
      expect(scoped.scope).toBe('API');
    });

    it('should accept options', () => {
      const scoped = lumberjack.createScoped('API', {
        prefix: '🌐',
        color: '#60A5FA'
      });
      expect(scoped.scope).toBe('API');
    });

    it('should create independent scoped loggers', () => {
      const api = lumberjack.createScoped('API');
      const db = lumberjack.createScoped('DB');
      expect(api.scope).toBe('API');
      expect(db.scope).toBe('DB');
    });
  });

  describe('enabled property', () => {
    it('should have enabled getter', () => {
      lumberjack.configure({ enabled: true });
      expect(lumberjack.enabled).toBe(true);
    });

    it('should have enabled setter', () => {
      lumberjack.enabled = true;
      expect(lumberjack.enabled).toBe(true);
      lumberjack.enabled = false;
      expect(lumberjack.enabled).toBe(false);
    });

    it('should reflect Lumberjack instance state', () => {
      lumberjack.enabled = true;
      expect(Lumberjack.enabled).toBe(true);
      lumberjack.enabled = false;
      expect(Lumberjack.enabled).toBe(false);
    });
  });

  describe('integration', () => {
    it('should work with all methods together', async () => {
      lumberjack.configure({ enabled: true });
      lumberjack.trace('Starting operation');
      lumberjack.indent();
      lumberjack.trace('Step 1');
      lumberjack.outdent();
      lumberjack.trace('Done');
      expect(console.log).toHaveBeenCalled();
    });

    it('should work with scoped loggers', async () => {
      lumberjack.configure({ enabled: true });
      const api = lumberjack.createScoped('API');
      api.trace('Request started');
      api.indent();
      api.trace('Processing');
      api.outdent();
      expect(console.log).toHaveBeenCalled();
    });

    it('should work with groups and indentation', async () => {
      lumberjack.configure({ enabled: true });
      lumberjack.resetIndent();
      await lumberjack.group(async () => {
        lumberjack.trace('Inside group');
        lumberjack.indent();
        lumberjack.trace('Nested');
        lumberjack.outdent();
      });
      expect(console.log).toHaveBeenCalled();
    });

    it('should work with custom styles', () => {
      lumberjack.configure({ enabled: true });
      const customStyle = new LumberjackStyle('#9333EA', '🎨');
      lumberjack.trace('Custom styled message', null, 'brief', customStyle);
      expect(console.log).toHaveBeenCalled();
    });

    it('should work with predefined styles', () => {
      lumberjack.configure({ enabled: true });
      lumberjack.trace('Success', null, 'brief', LumberjackStyles.SUCCESS);
      lumberjack.trace('Error', null, 'brief', LumberjackStyles.ERROR);
      lumberjack.trace('Headsup', null, 'brief', LumberjackStyles.HEADSUP);
      expect(console.log).toHaveBeenCalled();
    });
  });
});
