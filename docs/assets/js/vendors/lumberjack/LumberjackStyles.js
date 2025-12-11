/** @format */

import LumberjackStyle from "./LumberjackStyle.js";
import {
  DEFAULT_STYLE,
  HEADSUP_STYLE,
  ERROR_STYLE,
  SUCCESS_STYLE,
  SEPARATOR as CONFIG_SEPARATOR,
} from "./config.js";

/**
 * LumberjackStyles - Predefined semantic styles
 *
 * Immutable style constants for consistent output formatting.
 *
 * @example Usage
 * import { LumberjackStyles } from './lumberjack/index.js';
 * lumberjack.trace('Error occurred', err, 'verbose', 'error'); // String shorthand
 * lumberjack.trace('Success!', data, 'brief', LumberjackStyles.SUCCESS); // Direct constant
 *
 * @example Color palette (Tailwind-inspired)
 * STANDARD - Gray-500 (#6B7280), no prefix
 * HEADSUP  - Amber-500 (#F59E0B), ⚡ prefix
 * ERROR    - Red-500 (#EF4444), ❌ prefix
 * SUCCESS  - Green-500 (#10B981), no prefix
 */
class LumberjackStyles {
  static SEPARATOR = CONFIG_SEPARATOR;

  /** @type {LumberjackStyle} Default neutral style */
  static DEFAULT = new LumberjackStyle(
    DEFAULT_STYLE.color ?? "#FFFFFF",
    DEFAULT_STYLE.prefix ?? "",
    DEFAULT_STYLE.fontWeight ?? "normal",
    DEFAULT_STYLE.fontSize ?? 12
  );

  /** @type {LumberjackStyle} Attention/warning style */
  static HEADSUP = new LumberjackStyle(
    HEADSUP_STYLE.color ?? DEFAULT_STYLE.color,
    HEADSUP_STYLE.prefix ?? DEFAULT_STYLE.prefix,
    HEADSUP_STYLE.fontWeight ?? DEFAULT_STYLE.fontWeight,
    HEADSUP_STYLE.fontSize ?? DEFAULT_STYLE.fontSize
  );

  /** @type {LumberjackStyle} Error/failure style */
  static ERROR = new LumberjackStyle(
    ERROR_STYLE.color ?? DEFAULT_STYLE.color,
    ERROR_STYLE.prefix ?? DEFAULT_STYLE.prefix,
    ERROR_STYLE.fontWeight ?? DEFAULT_STYLE.fontWeight,
    ERROR_STYLE.fontSize ?? DEFAULT_STYLE.fontSize
  );

  /** @type {LumberjackStyle} Success/confirmation style */
  static SUCCESS = new LumberjackStyle(
    SUCCESS_STYLE.color ?? DEFAULT_STYLE.color,
    SUCCESS_STYLE.prefix ?? DEFAULT_STYLE.prefix,
    SUCCESS_STYLE.fontWeight ?? DEFAULT_STYLE.fontWeight,
    SUCCESS_STYLE.fontSize ?? DEFAULT_STYLE.fontSize
  );

  /**
   * Get style by name (case-insensitive)
   * @param {string|LumberjackStyle|Object} styleName - 'default'|'headsup'|'error'|'success' or a LumberjackStyle instance
   * @returns {LumberjackStyle} Matching style or DEFAULT if not found
   */
  static getStyle(styleName = "default") {
    if (!styleName) return this.DEFAULT;

    // Allow direct LumberjackStyle instance or compatible object
    if (
      styleName instanceof Object &&
      styleName.color &&
      styleName.color_secondary
    ) {
      return styleName;
    }

    if (typeof styleName !== "string") return this.DEFAULT;

    const normalized = styleName.toLowerCase();
    switch (normalized) {
      case "headsup":
        return this.HEADSUP;
      case "error":
        return this.ERROR;
      case "success":
        return this.SUCCESS;
      case "default":
      default:
        return this.DEFAULT;
    }
  }
}

export default LumberjackStyles;
