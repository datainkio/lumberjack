import n from "./utils.js";
class h {
  #e;
  #r;
  #t;
  #i;
  /**
   * @param {string} color - Hex color (e.g., '#6B7280')
   * @param {string} [prefix=''] - Emoji/symbol prefix
   */
  constructor(r, i = "", t = "normal", e = 12) {
    if (!r || typeof r != "string" || !r.startsWith("#"))
      throw new Error(
        'LumberjackStyle requires valid hex color (e.g., "#6B7280")'
      );
    if (t !== void 0 && typeof t != "string")
      throw new Error(
        "LumberjackStyle fontWeight must be a string when provided"
      );
    if (e !== void 0 && (typeof e != "number" || !Number.isInteger(e) || e < 0))
      throw new Error(
        "LumberjackStyle fontSize must be a non-negative integer when provided"
      );
    this.#e = r, this.#r = i, this.#t = t || "normal", this.#i = e, Object.freeze(this);
  }
  /** @returns {string} Hex color */
  get color() {
    return this.#e;
  }
  /** @returns {string} Brightened hex color */
  get color_secondary() {
    return n(this.#e, 0.2);
  }
  /** @returns {string} Prefix emoji/symbol */
  get prefix() {
    return this.#r;
  }
  /** @returns {string} Font weight for browser console (e.g., 'normal'|'bold') */
  get fontWeight() {
    return this.#t;
  }
  /** @returns {number|undefined} Font size in pixels for browser console, if provided */
  get fontSize() {
    return this.#i;
  }
}
export {
  h as default
};
