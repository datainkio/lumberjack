import o from "./LumberjackStyle.js";
import { SEPARATOR as f, DEFAULT_STYLE as t, HEADSUP_STYLE as i, ERROR_STYLE as r, SUCCESS_STYLE as n } from "./config.js";
class a {
  static SEPARATOR = f;
  /** @type {LumberjackStyle} Default neutral style */
  static DEFAULT = new o(
    t.color ?? "#FFFFFF",
    t.prefix ?? "",
    t.fontWeight ?? "normal",
    t.fontSize ?? 12
  );
  /** @type {LumberjackStyle} Attention/warning style */
  static HEADSUP = new o(
    i.color,
    i.prefix,
    i.fontWeight ?? t.fontWeight,
    i.fontSize ?? t.fontSize
  );
  /** @type {LumberjackStyle} Error/failure style */
  static ERROR = new o(
    r.color,
    r.prefix,
    r.fontWeight ?? t.fontWeight,
    r.fontSize ?? t.fontSize
  );
  /** @type {LumberjackStyle} Success/confirmation style */
  static SUCCESS = new o(
    n.color,
    n.prefix,
    n.fontWeight ?? t.fontWeight,
    n.fontSize ?? t.fontSize
  );
  /**
   * Get style by name (case-insensitive)
   * @param {string|LumberjackStyle|Object} styleName - 'default'|'headsup'|'error'|'success' or a LumberjackStyle instance
   * @returns {LumberjackStyle} Matching style or DEFAULT if not found
   */
  static getStyle(e) {
    if (!e) return this.DEFAULT;
    if (e instanceof Object && e.color && e.color_secondary)
      return e;
    if (typeof e != "string") return this.DEFAULT;
    switch (e.toLowerCase()) {
      case "headsup":
        return this.HEADSUP;
      case "error":
        return this.ERROR;
      case "success":
        return this.SUCCESS;
      default:
        return this.DEFAULT;
    }
  }
}
export {
  a as default
};
