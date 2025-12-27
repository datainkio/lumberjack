import { Lumberjack as t } from "./Lumberjack.class.js";
import { default as i } from "./LumberjackStyle.js";
import { default as f } from "./LumberjackStyles.js";
import { DEFAULT_MODE as o, DEFAULT_STYLE as c } from "./config.js";
const d = {
  /**
   * Log message with optional data
   * @param {string} message - Description
   * @param {*} [obj=null] - Data to log (auto-detects Error objects)
   * @param {'brief'|'verbose'} [mode='brief'] - Detail level
   * @param {string|LumberjackStyle} [style='standard'] - 'standard'|'headsup'|'error'|'success' or custom
   */
  trace: (e, n = null, r = o, a = c) => t.getInstance().trace(e, n, r, a),
  /** Increase indent level */
  indent: () => t.getInstance().indent(),
  /** Decrease indent level */
  outdent: () => t.getInstance().outdent(),
  /** Reset indent to zero */
  resetIndent: () => t.getInstance().resetIndent(),
  /**
   * Execute function with auto-indent
   * @param {Function} fn - Async or sync function
   */
  group: (e) => t.getInstance().group(e),
  /**
   * Show formatted operation outline
   * @param {string} operationName - Operation title
   * @param {string[]} scriptSequence - Array of step descriptions
   * @param {'brief'|'verbose'} [mode='brief'] - Detail level
   * @param {string|LumberjackStyle} [style='headsup'] - Style preset or instance
   */
  showScriptOutline: (e, n, r = "brief", a = c) => t.getInstance().showScriptOutline(
    e,
    n,
    r,
    a
  ),
  /**
   * Configure global logger
   * @param {Object} options - { enabled, prefix, styles, scope }
   */
  configure: (e = {}) => t.configure(e),
  /**
   * Create scoped logger instance
   * @param {string} scope - Scope name (e.g., 'Director', 'StageManager')
   * @param {Object} [options={}] - Additional config
   * @returns {Object} Scoped logger with same API
   */
  createScoped: (e, n = {}) => t.createScoped(e, n),
  get enabled() {
    return t.getInstance().enabled;
  },
  set enabled(e) {
    t.getInstance().enabled = e;
  }
};
export {
  t as Lumberjack,
  i as LumberjackStyle,
  f as LumberjackStyles,
  d as default
};
