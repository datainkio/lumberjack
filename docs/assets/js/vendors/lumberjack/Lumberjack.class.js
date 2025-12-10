/** @format */

import LumberjackStyles from "./LumberjackStyles.js";
import {
  INDENT_SIZE,
  MAX_ARRAY_PREVIEW,
  MAX_OBJECT_PREVIEW,
  DEFAULT_MODE,
  DEFAULT_STYLE,
  SCRIPT_OUTLINE_ICON,
  SCRIPT_OUTLINE_STYLE,
  DIVIDER_CHAR,
  DIVIDER_LENGTH,
  DIVIDER_COLOR,
} from "./config.js";
import {
  SCRIPT_OUTLINE_TITLE,
  SCRIPT_OUTLINE_COUNT_TEMPLATE,
  EXECUTION_BEGIN_TITLE,
  EXECUTION_BEGIN_SUBTEXT,
  LABEL_EXECUTES,
  LABEL_TRIGGERS,
  LABEL_REQUIRES,
  GROUP_START_SUFFIX,
  GROUP_COMPLETE_SUFFIX,
} from "./constants.js";

// Conditional chalk import - only available in Node.js environment
let chalk = null;
try {
  // Dynamic import for Node.js environment
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    chalk = (await import("chalk")).default;
  }
} catch (err) {
  // Chalk not available - browser environment
  chalk = null;
}

/**
 * Lumberjack - Singleton debug logging utility
 *
 * Terminal/console output with semantic styling, auto-indent, and Error detection.
 * Auto-detects environment: Node.js (terminal with chalk) or browser (console with CSS).
 * Use via singleton: `import lumberjack from './lumberjack/index.js'`
 *
 * @class Lumberjack
 * @singleton
 *
 * @example Terminal mode (Node.js)
 * // Uses chalk for colored terminal output
 * lumberjack.trace('Build started', null, 'brief', 'headsup');
 *
 * @example Browser mode (runtime)
 * // Uses console.log with %c CSS styling
 * lumberjack.trace('Animation init', data, 'verbose', 'success');
 *
 * @example Auto-error detection
 * try {
 *   riskyOp();
 * } catch (err) {
 *   lumberjack.trace('Failed:', err, 'verbose'); // Auto-applies error style + stack trace
 * }
 *
 * @example Hierarchical logging
 * await lumberjack.group(async () => {
 *   lumberjack.trace('Parent', data);
 *   // Auto-indented nested logs
 * });
 *
 * @example Custom styles
 * const purple = new LumberjackStyle('#9333EA', '🎨');
 * lumberjack.trace('Message', data, 'brief', purple);
 *
 * @example Scoped logger
 * const scoped = Lumberjack.createScoped('Director');
 * scoped.trace('Init'); // Output: [Director] Init
 */
class Lumberjack {
  static #instance = null;
  static #initialized = false;
  static #isBrowser =
    typeof window !== "undefined" && typeof document !== "undefined";

  // Private instance fields
  #indentLevel = 0;
  #config = {};

  /**
   * Private constructor - use static methods instead
   * @param {boolean|Object} enabled - Whether logging is enabled, or config object
   */
  constructor(enabled = false) {
    if (Lumberjack.#instance) return Lumberjack.#instance;

    // Handle both boolean and config object parameters
    this.#config =
      typeof enabled === "object"
        ? {
            enabled: enabled.enabled ?? false,
            prefix: "",
            styles: {},
            scope: null,
            ...enabled,
          }
        : { enabled, prefix: "", styles: {}, scope: null };

    this.enabled = this.#config.enabled;
    this.#indentLevel = 0;
    Lumberjack.#instance = this;

    // Display initialization message only once
    if (!Lumberjack.#initialized) {
      const statusStyle = this.enabled
        ? LumberjackStyles.SUCCESS
        : LumberjackStyles.ERROR;
      const statusColor = statusStyle.color;
      const statusText = this.enabled ? "enabled" : "disabled";

      if (!Lumberjack.#isBrowser && chalk) {
        console.log(
          `${chalk.hex(LumberjackStyles.HEADSUP.color)(
            "Lumberjack"
          )} initialized: ${chalk.hex(statusColor)(statusText)}`
        );
      } else {
        console.log(
          "%cLumberjack %cinitialized %c",
          `color: ${LumberjackStyles.HEADSUP.color}; font-weight: ${
            LumberjackStyles.HEADSUP.fontWeight ||
            LumberjackStyles.DEFAULT.fontWeight
          }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`,
          `color: inherit; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`,
          `color: ${statusColor}; font-weight: ${
            statusStyle.fontWeight || LumberjackStyles.DEFAULT.fontWeight
          }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
        );
      }

      Lumberjack.#initialized = true;
    }
  }

  /**
   * Apply color styling based on environment
   * @private
   */
  #style(color, text, options = {}) {
    if (!Lumberjack.#isBrowser && chalk) {
      let styled = chalk.hex(color)(text);
      if (options.bold) styled = chalk.bold(styled);
      return styled;
    }
    return text;
  }

  /**
   * Get the singleton instance
   * @param {boolean} enabled - Whether logging is enabled (only used on first call)
   * @returns {Lumberjack} The singleton Lumberjack instance
   */
  static getInstance(enabled) {
    if (!Lumberjack.#instance) {
      const isEnabled =
        enabled ??
        (typeof process !== "undefined" && process.env
          ? process.env.DEBUG === "true"
          : false);
      Lumberjack.#instance = new Lumberjack(isEnabled);
    }
    return Lumberjack.#instance;
  }

  /**
   * Configure the Lumberjack instance with new options
   * @param {Object} options - Configuration options
   * @returns {Lumberjack} The configured Lumberjack instance
   */
  static configure(options = {}) {
    const instance = Lumberjack.getInstance();
    Object.assign(instance.#config, options);
    if (options.enabled !== undefined) instance.enabled = options.enabled;
    return instance;
  }

  /**
   * Create a scoped logger that prefixes all messages with scope information
   * Maintains singleton benefits while allowing service-specific customization
   *
   * @param {string} scope - The scope name (e.g., 'Tailwind', 'Figma', 'NavigationBuilder')
   * @param {Object} [options] - Additional configuration for the scoped logger
   * @param {string} [options.prefix] - Optional emoji/icon prefix before scope name
   * @param {string} [options.color] - Optional hex color for the scope string (e.g., '#10B981')
   * @returns {Object} Scoped logger interface with all Lumberjack methods
   *
   * @example
   * const tailwindLogger = Lumberjack.createScoped('Tailwind');
   * const figmaLogger = Lumberjack.createScoped('Figma', { prefix: '🎨', color: '#10B981' });
   *
   * tailwindLogger.trace('CSS compilation started'); // "[Tailwind] CSS compilation started"
   * figmaLogger.trace('Design tokens fetched');      // "🎨 [Figma] Design tokens fetched" (green scope)
   */
  static createScoped(scope, options = {}) {
    const instance = Lumberjack.getInstance();
    const { color: scopeColor, prefix } = options;
    const rawScopePrefix = prefix ? `${prefix} [${scope}]` : `[${scope}]`;

    return {
      trace: (
        message,
        obj = null,
        mode = DEFAULT_MODE,
        style = DEFAULT_STYLE
      ) => {
        if (scopeColor && Lumberjack.#isBrowser) {
          return instance._traceScopedBrowser(
            rawScopePrefix,
            message,
            obj,
            mode,
            style,
            scopeColor
          );
        }

        const scopedMessage =
          scopeColor && !Lumberjack.#isBrowser && chalk
            ? `${chalk.hex(scopeColor)(rawScopePrefix)} ${message}`
            : `${rawScopePrefix} ${message}`;

        return instance.trace(scopedMessage, obj, mode, style);
      },

      indent: () => instance.indent(),
      outdent: () => instance.outdent(),
      resetIndent: () => instance.resetIndent(),

      group: async (fn) => {
        instance.trace(
          `${rawScopePrefix} Starting grouped operation`,
          null,
          "brief",
          "headsup"
        );
        const result = await instance.group(fn);
        instance.trace(
          `${rawScopePrefix} Completed grouped operation`,
          null,
          "brief",
          "success"
        );
        return result;
      },

      showScriptOutline: (operationName, outline) =>
        instance.showScriptOutline(`${scope}: ${operationName}`, outline),

      get enabled() {
        return instance.enabled;
      },
      set enabled(value) {
        instance.enabled = value;
      },

      scope,
      config: { ...instance.#config, scope },
    };
  }

  /**
   * Static trace method for convenience
   */
  static trace(
    message,
    obj = null,
    mode = DEFAULT_MODE,
    style = DEFAULT_STYLE
  ) {
    return Lumberjack.getInstance().trace(message, obj, mode, style);
  }

  /**
   * Static getter/setter for enabled state
   */
  static get enabled() {
    return Lumberjack.getInstance().enabled;
  }

  static set enabled(value) {
    Lumberjack.getInstance().enabled = value;
  }

  indent() {
    this.#indentLevel++;
  }

  outdent() {
    this.#indentLevel = Math.max(0, this.#indentLevel - 1);
  }

  resetIndent() {
    this.#indentLevel = 0;
  }

  /**
   * Display a script execution outline showing the planned script sequence
   * Provides transparency about what scripts will be called and in what order
   *
   * @param {string} operationName - Name of the overall operation (e.g., "Full Build Process")
   * @param {Array<Object>} scriptSequence - Array of script objects with name, description, dependencies
   * @param {string} [mode='brief'] - Display mode: 'brief' or 'verbose'
   * @param {string|LumberjackStyle} [style='headsup'] - Style for the outline headers
   *
   * @example
   * logger.showScriptOutline('Full Build Process', [
   *   { name: 'clean', description: 'Clear build directory', script: 'clearSiteFolder.js' },
   *   { name: 'build:design', description: 'Sync Figma design tokens', script: 'fetchFigma.js', triggers: ['buildCSS.js'] },
   *   { name: 'build:11ty', description: 'Generate static site', script: 'eleventy --quiet' }
   * ]);
   */
  showScriptOutline(
    operationName,
    scriptSequence,
    mode = "brief",
    style = "headsup"
  ) {
    if (!this.enabled) return;

    const styleObj = this._getStyle(style);
    const prefixIcon =
      styleObj.prefix || SCRIPT_OUTLINE_STYLE?.prefix || SCRIPT_OUTLINE_ICON;
    const divider = DIVIDER_CHAR.repeat(DIVIDER_LENGTH);

    if (!Lumberjack.#isBrowser && chalk) {
      console.log(
        "\n" +
          chalk.hex(styleObj.color)(prefixIcon) +
          ` ${operationName.toUpperCase()}`
      );
      console.log(chalk.gray(divider));
    } else {
      console.log(
        "\n%c" + prefixIcon + "%c " + operationName.toUpperCase(),
        `color: ${styleObj.color}; font-weight: ${
          styleObj.fontWeight || LumberjackStyles.DEFAULT.fontWeight
        }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`,
        `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
      console.log(
        "%c" + divider,
        `color: ${DIVIDER_COLOR}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
    }

    this.trace(
      SCRIPT_OUTLINE_TITLE,
      SCRIPT_OUTLINE_COUNT_TEMPLATE.replace(
        "{count}",
        String(scriptSequence.length)
      ),
      "brief",
      "headsup"
    );

    this.group(() => {
      scriptSequence.forEach((script, index) => {
        const stepNumber = `${index + 1}.`;

        if (mode === "verbose") {
          this.trace(
            `${stepNumber} ${script.name}`,
            script.description || "No description provided",
            "brief",
            "default"
          );

          if (script.script) {
            this.indent();
            this.trace(LABEL_EXECUTES, script.script, "brief", "default");
            this.outdent();
          }

          if (script.triggers?.length) {
            this.indent();
            this.trace(
              LABEL_TRIGGERS,
              script.triggers.join(", "),
              "brief",
              "default"
            );
            this.outdent();
          }

          if (script.dependencies?.length) {
            this.indent();
            this.trace(
              LABEL_REQUIRES,
              script.dependencies.join(", "),
              "brief",
              "default"
            );
            this.outdent();
          }
        } else {
          const description = script.description
            ? ` - ${script.description}`
            : "";
          this.trace(
            `${stepNumber} ${script.name}${description}`,
            null,
            "brief",
            "default"
          );
        }
      });
    });

    this.trace(
      EXECUTION_BEGIN_TITLE,
      EXECUTION_BEGIN_SUBTEXT,
      "brief",
      "headsup"
    );
  }

  /**
   * Get current indentation string
   * @private
   * @returns {string} Space characters for current indentation level
   */
  _getIndent() {
    return " ".repeat(this.#indentLevel * INDENT_SIZE);
  }

  /**
   * Execute function with increased indentation
   * Adds separators and newlines before and after the group for visual separation
   * @param {Function} fn - Function to execute
   */
  async group(fn) {
    const isTopLevel = this.#indentLevel === 0;

    if (this.enabled && isTopLevel) {
      console.log("\n" + LumberjackStyles.SEPARATOR + "\n");
    }

    this.indent();
    try {
      await fn();
    } finally {
      this.outdent();
      if (this.enabled && isTopLevel) {
        console.log("\n" + LumberjackStyles.SEPARATOR + "\n");
      }
    }
  }

  /**
   * Trace and display object information
   * @param {string} message - User-defined message to display
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string|LumberjackStyle} [style='default'] - Style type: 'default', 'headsup', 'error', 'success', or a custom LumberjackStyle instance
   */
  trace(message, obj = null, mode = DEFAULT_MODE, style = DEFAULT_STYLE) {
    if (!this.enabled || mode === "silent") return;

    // Auto-detect Error objects
    if (style === "default" && obj instanceof Error) style = "error";

    const styleObj = this._getStyle(style);
    const indent = this._getIndent();
    const configPrefix = this.#config.prefix?.trim();
    const hasPrefix = styleObj.prefix && styleObj.prefix !== "";

    if (!Lumberjack.#isBrowser && chalk) {
      // Terminal mode (Node.js with chalk)
      let output = indent;
      if (configPrefix) output += `${configPrefix} `;
      if (hasPrefix) {
        output += chalk.hex(styleObj.color)(
          styleObj.prefix.replace(/\n/g, "\n" + indent)
        );
        if (!styleObj.prefix.match(/\s$/)) output += " ";
      }
      output += message;

      if (obj != null) {
        output +=
          " " +
          (mode === "brief"
            ? this._getValue(obj, false)
            : "\n" + this._formatVerbosePlain(obj, indent));
      }

      console.log(output);
    } else {
      // Browser mode (console.log with CSS)
      const parts = [];
      const styles = [];

      // Add indent and config prefix
      if (indent || configPrefix) {
        parts.push("%c" + indent + (configPrefix ? `${configPrefix} ` : ""));
        styles.push(
          `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
        );
      }

      // Add style prefix (emoji/icon)
      if (hasPrefix) {
        parts.push("%c" + styleObj.prefix.replace(/\n/g, "\n" + indent));
        styles.push(
          `color: ${styleObj.color}; font-weight: ${
            styleObj.fontWeight || LumberjackStyles.DEFAULT.fontWeight
          }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
        );
        if (!styleObj.prefix.match(/\s$/)) {
          parts.push("%c ");
          styles.push(
            `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
          );
        }
      }

      // Add main message with custom color
      parts.push("%c" + message);
      styles.push(
        `color: ${styleObj.color}; font-weight: ${
          styleObj.fontWeight || LumberjackStyles.DEFAULT.fontWeight
        }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );

      // Add data object if present
      if (obj != null) {
        if (mode === "brief") {
          parts.push("%c " + this._getValue(obj, false));
          styles.push(
            `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
          );
        } else {
          // Verbose mode
          parts.push("%c\n" + this._formatVerbosePlain(obj, indent));
          styles.push(
            `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
          );
        }
      }

      console.log(parts.join(""), ...styles);
    }
  }

  /**
   * Special trace method for scoped loggers in browser with custom scope color
   * @private
   * @param {string} scopePrefix - The scope prefix string (e.g., "[Director]")
   * @param {string} message - The message to display
   * @param {*} obj - Optional object to trace
   * @param {string} mode - Display mode
   * @param {string} style - Style type
   * @param {string} scopeColor - Hex color for the scope
   */
  _traceScopedBrowser(scopePrefix, message, obj, mode, style, scopeColor) {
    if (!this.enabled || mode === "silent") return;
    if (style === "default" && obj instanceof Error) style = "error";

    const styleObj = this._getStyle(style);
    const indent = this._getIndent();
    const parts = [];
    const styles = [];

    if (indent) {
      parts.push("%c" + indent);
      styles.push(
        `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
    }

    const configPrefix = this.#config.prefix?.trim();
    if (configPrefix) {
      parts.push("%c" + configPrefix + " ");
      styles.push(
        `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
    }

    if (styleObj.prefix) {
      parts.push("%c" + styleObj.prefix.replace(/\n/g, "\n" + indent));
      styles.push(
        `color: ${styleObj.color}; font-weight: ${
          styleObj.fontWeight || LumberjackStyles.DEFAULT.fontWeight
        }; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
      if (!styleObj.prefix.match(/\s$/)) {
        parts.push("%c ");
        styles.push(
          `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
        );
      }
    }

    parts.push("%c" + scopePrefix);
    styles.push(
      `color: ${scopeColor}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
    );

    parts.push("%c " + message);
    styles.push(
      `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
    );

    if (obj != null) {
      parts.push(
        "%c " +
          (mode === "brief"
            ? this._getValue(obj, false)
            : "\n" + this._formatVerbosePlain(obj, indent))
      );
      styles.push(
        `color: ${LumberjackStyles.DEFAULT.color}; font-weight: ${LumberjackStyles.DEFAULT.fontWeight}; font-size: ${LumberjackStyles.DEFAULT.fontSize}px`
      );
    }

    console.log(parts.join(""), ...styles);
  }

  /**
   * Get the style object based on input
   * @private
   * @param {string|LumberjackStyle} style - Style name or LumberjackStyle instance
   * @returns {LumberjackStyle} Resolved style object
   */
  _getStyle(style) {
    if (style instanceof Object && style.color) return style;
    return LumberjackStyles.getStyle(style);
  }

  /**
   * Format object for brief mode
   * @private
   * @param {*} obj - Object to format
   * @param {boolean} [inArray=false] - Whether the object is inside an array
   * @returns {string} Formatted string
   */
  _getValue(obj, inArray = false) {
    if (obj === null) return "null";
    if (obj === undefined) return "undefined";
    if (typeof obj === "string") return obj;
    if (typeof obj === "number" || typeof obj === "boolean") return String(obj);

    if (Array.isArray(obj)) {
      const preview = obj
        .slice(0, MAX_ARRAY_PREVIEW)
        .map((item) => this._getValue(item, true));
      const suffix = obj.length > MAX_ARRAY_PREVIEW ? ", ..." : "";
      return `[${preview.join(", ")}${suffix}]`;
    }

    if (obj instanceof Error) {
      return `${obj.name}: ${obj.message}`;
    }

    if (typeof obj === "object") {
      const keys = Object.keys(obj);
      const previewKeys = keys.slice(0, MAX_OBJECT_PREVIEW);
      const preview = previewKeys.map(
        (key) => `${key}: ${this._getValue(obj[key])}`
      );
      const suffix = keys.length > MAX_OBJECT_PREVIEW ? ", ..." : "";
      return `{ ${preview.join(", ")}${suffix} }`;
    }

    if (typeof obj === "function") return "[Function]";
    return String(obj);
  }

  /**
   * Format object for verbose mode with indentation
   * @private
   * @param {*} obj - Object to format
   * @param {string} indent - Current indentation string
   * @returns {string} Formatted multi-line string
   */
  _formatVerbosePlain(obj, indent = "") {
    const space = " ".repeat(INDENT_SIZE);

    if (obj === null) return "null";
    if (obj === undefined) return "undefined";
    if (typeof obj === "string") return obj;
    if (typeof obj === "number" || typeof obj === "boolean") return String(obj);

    if (Array.isArray(obj)) {
      const items = obj
        .map(
          (item) =>
            `${indent}${space}- ${this._formatVerbosePlain(
              item,
              indent + space
            )}`
        )
        .join("\n");
      return items || "[]";
    }

    if (obj instanceof Error) {
      return `${obj.name}: ${obj.message}\n${obj.stack}`;
    }

    if (typeof obj === "object") {
      const entries = Object.entries(obj)
        .map(
          ([key, value]) =>
            `${indent}${space}${key}: ${this._formatVerbosePlain(
              value,
              indent + space
            )}`
        )
        .join("\n");
      return entries || "{}";
    }

    if (typeof obj === "function") return "[Function]";
    return String(obj);
  }

  get enabled() {
    return this.#config.enabled;
  }

  set enabled(value) {
    this.#config.enabled = Boolean(value);
  }
}

export { Lumberjack }; // Named export for advanced usage
export default Lumberjack;
