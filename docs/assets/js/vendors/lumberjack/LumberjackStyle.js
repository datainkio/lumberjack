/** @format */

/**
 * LumberjackStyle - Immutable style configuration
 *
 * Represents color + optional prefix for lumberjack output.
 *
 * @example
 * const purple = new LumberjackStyle('#9333EA', '🎨');
 * lumberjack.trace('Message', data, 'brief', purple);
 *
 * @example Built-in styles (preferred)
 * import { LumberjackStyles } from './lumberjack/index.js';
 * LumberjackStyles.ERROR   // Red with ❌
 * LumberjackStyles.SUCCESS // Green with ✅
 * LumberjackStyles.HEADSUP // Amber with ⚡
 * LumberjackStyles.STANDARD // Gray, no prefix
 */
class LumberjackStyle {
  #color;
  #prefix;
  #fontWeight;
  #fontSize;

  /**
   * @param {string} color - Hex color (e.g., '#6B7280')
   * @param {string} [prefix=''] - Emoji/symbol prefix
   */
  constructor(color, prefix = "", fontWeight = "normal", fontSize = 12) {
    if (!color || typeof color !== "string" || !color.startsWith("#")) {
      throw new Error(
        'LumberjackStyle requires valid hex color (e.g., "#6B7280")'
      );
    }

    if (fontWeight !== undefined && typeof fontWeight !== "string") {
      throw new Error(
        "LumberjackStyle fontWeight must be a string when provided"
      );
    }

    if (fontSize !== undefined) {
      if (
        typeof fontSize !== "number" ||
        !Number.isInteger(fontSize) ||
        fontSize < 0
      ) {
        throw new Error(
          "LumberjackStyle fontSize must be a non-negative integer when provided"
        );
      }
    }

    this.#color = color;
    this.#prefix = prefix;
    this.#fontWeight = fontWeight || "normal";
    this.#fontSize = fontSize;

    Object.freeze(this);
  }

  /** @returns {string} Hex color */
  get color() {
    return this.#color;
  }

  /** @returns {string} Prefix emoji/symbol */
  get prefix() {
    return this.#prefix;
  }

  /** @returns {string} Font weight for browser console (e.g., 'normal'|'bold') */
  get fontWeight() {
    return this.#fontWeight;
  }

  /** @returns {number|undefined} Font size in pixels for browser console, if provided */
  get fontSize() {
    return this.#fontSize;
  }
}

export default LumberjackStyle;
