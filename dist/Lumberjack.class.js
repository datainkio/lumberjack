import t from "./LumberjackStyles.js";
import { BRIGHTEN_PERCENT as x, DEFAULT_MODE as g, DEFAULT_STYLE as E, SCRIPT_OUTLINE_STYLE as w, DIVIDER_COLOR as T, DIVIDER_CHAR as y, INDENT_SIZE as A, MAX_ARRAY_PREVIEW as U, MAX_OBJECT_PREVIEW as L, DIVIDER_LENGTH as z } from "./config.js";
import { GROUP_START_SUFFIX as I, GROUP_COMPLETE_SUFFIX as _, SCRIPT_OUTLINE_TITLE as C, SCRIPT_OUTLINE_COUNT_TEMPLATE as R, LABEL_EXECUTES as O, LABEL_TRIGGERS as W, LABEL_REQUIRES as m, EXECUTION_BEGIN_TITLE as P, EXECUTION_BEGIN_SUBTEXT as V } from "./constants.js";
import B from "./utils.js";
let p = null;
try {
  typeof process < "u" && process.versions && process.versions.node && (p = (await import("chalk")).default);
} catch {
  p = null;
}
class u {
  static #n = null;
  static #o = !1;
  static #i = typeof window < "u" && typeof document < "u";
  // Private instance fields
  #t = 0;
  #e = {};
  /**
   * Private constructor - use static methods instead
   * @param {boolean|Object} enabled - Whether logging is enabled, or config object
   */
  constructor(e = !1) {
    if (u.#n) return u.#n;
    if (this.#e = typeof e == "object" ? {
      enabled: e.enabled ?? !1,
      prefix: "",
      styles: {},
      scope: null,
      showCallerLocation: !0,
      ...e
    } : { enabled: e, prefix: "", styles: {}, scope: null, showCallerLocation: !0 }, this.enabled = this.#e.enabled, this.#t = 0, u.#n = this, !u.#o) {
      const s = this.enabled ? t.SUCCESS : t.ERROR, n = s.color, r = this.enabled ? "enabled" : "disabled";
      !u.#i && p ? console.log(
        `${p.hex(t.HEADSUP.color)(
          "Lumberjack"
        )} initialized: ${p.hex(n)(r)}`
      ) : console.log(
        "%cLumberjack %cinitialized %c",
        `color: ${t.HEADSUP.color}; font-weight: ${t.HEADSUP.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`,
        `color: inherit; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`,
        `color: ${n}; font-weight: ${s.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      ), u.#o = !0;
    }
  }
  /**
   * Apply color styling based on environment
   * @private
   */
  #s(e, s, n = {}) {
    if (!u.#i && p) {
      let r = p.hex(e)(s);
      return n.bold && (r = p.bold(r)), r;
    }
    return s;
  }
  /**
   * Get the singleton instance
   * @param {boolean} enabled - Whether logging is enabled (only used on first call)
   * @returns {Lumberjack} The singleton Lumberjack instance
   */
  static getInstance(e) {
    if (!u.#n) {
      const s = e ?? (typeof process < "u" && process.env ? process.env.DEBUG === "true" : !1);
      u.#n = new u(s);
    }
    return u.#n;
  }
  /**
   * Configure the Lumberjack instance with new options
   * @param {Object} options - Configuration options
   * @returns {Lumberjack} The configured Lumberjack instance
   */
  static configure(e = {}) {
    const s = u.getInstance();
    return Object.assign(s.#e, e), e.enabled !== void 0 && (s.enabled = e.enabled), s;
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
  static createScoped(e, s = {}) {
    const n = u.getInstance(), { color: r, prefix: o } = s, l = o ? `${o} [${e}]` : `[${e}]`, h = r ? B(r, x) : null;
    return {
      trace: (i, a = null, f = g, c = E) => {
        if (r && u.#i)
          return n._traceScopedBrowser(
            l,
            i,
            a,
            f,
            c,
            r,
            // original for message
            h
            // brightened for scope prefix
          );
        const d = r && !u.#i && p ? `${p.hex(h ?? r)(
          l
        )} ${p.hex(r)(i)}` : `${l} ${i}`;
        return n.trace(d, a, f, c);
      },
      indent: () => n.indent(),
      outdent: () => n.outdent(),
      resetIndent: () => n.resetIndent(),
      group: async (i) => {
        n.trace(
          `${l} ${I}`,
          null,
          "brief",
          "headsup"
        );
        const a = await n.group(i);
        return n.trace(
          `${l} ${_}`,
          null,
          "brief",
          "success"
        ), a;
      },
      showScriptOutline: (i, a) => n.showScriptOutline(`${e}: ${i}`, a),
      get enabled() {
        return n.enabled;
      },
      set enabled(i) {
        n.enabled = i;
      },
      scope: e,
      config: { ...n.#e, scope: e }
    };
  }
  /**
   * Static trace method for convenience
   */
  static trace(e, s = null, n = g, r = E) {
    return u.getInstance().trace(e, s, n, r);
  }
  /**
   * Static getter/setter for enabled state
   */
  static get enabled() {
    return u.getInstance().enabled;
  }
  static set enabled(e) {
    u.getInstance().enabled = e;
  }
  indent() {
    this.#t++;
  }
  outdent() {
    this.#t = Math.max(0, this.#t - 1);
  }
  resetIndent() {
    this.#t = 0;
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
  showScriptOutline(e, s, n = "brief", r = "headsup") {
    if (!this.enabled) return;
    const o = this._getStyle(r), l = o.prefix || w?.prefix, h = y.repeat(z);
    !u.#i && p ? (console.log(
      `
` + p.hex(o.color)(l) + ` ${e.toUpperCase()}`
    ), console.log(p.hex(T)(h))) : (console.log(
      `
%c` + l + "%c " + e.toUpperCase(),
      `color: ${o.color}; font-weight: ${o.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`,
      `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    ), console.log(
      "%c" + h,
      `color: ${T}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    )), this.trace(
      C,
      R.replace(
        "{count}",
        String(s.length)
      ),
      "brief",
      "headsup"
    ), this.group(() => {
      s.forEach((i, a) => {
        const f = `${a + 1}.`;
        if (n === "verbose")
          this.trace(
            `${f} ${i.name}`,
            i.description || "No description provided",
            "brief",
            "default"
          ), i.script && (this.indent(), this.trace(O, i.script, "brief", "default"), this.outdent()), i.triggers?.length && (this.indent(), this.trace(
            W,
            i.triggers.join(", "),
            "brief",
            "default"
          ), this.outdent()), i.dependencies?.length && (this.indent(), this.trace(
            m,
            i.dependencies.join(", "),
            "brief",
            "default"
          ), this.outdent());
        else {
          const c = i.description ? ` - ${i.description}` : "";
          this.trace(
            `${f} ${i.name}${c}`,
            null,
            "brief",
            "default"
          );
        }
      });
    }), this.trace(
      P,
      V,
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
    return " ".repeat(this.#t * A);
  }
  /**
   * Get caller location from stack trace
   * @private
   * @returns {Object|null} Object with file, line, and column, or null if unavailable
   */
  _getCallerLocation() {
    try {
      const s = new Error().stack?.split(`
`) || [];
      for (let n = 0; n < s.length; n++) {
        const r = s[n];
        let o, l, h, i = r.match(/\(([^)]+):(\d+):(\d+)\)/);
        if (i ? (o = i[1], l = i[2], h = i[3]) : (i = r.match(/at\s+(.+):(\d+):(\d+)$/), i && (o = i[1], l = i[2], h = i[3])), !o || !l || !h)
          continue;
        const a = o.includes("Lumberjack.class.js") || o.includes("LumberjackStyle.js") || o.includes("LumberjackStyles.js") || o.includes("config.js") || o.includes("constants.js") || o.includes("utils.js") || o.includes("node_modules") || o.includes("internal/"), f = o.includes("index.js") && o.includes("src/");
        if (!(a || f))
          return { file: o, line: l, column: h };
      }
    } catch {
    }
    return null;
  }
  /**
   * Execute function with increased indentation
   * Adds separators and newlines before and after the group for visual separation
   * @param {Function} fn - Function to execute
   */
  async group(e) {
    const s = this.#t === 0;
    this.enabled && s && console.log(`
` + t.SEPARATOR + `
`), this.indent();
    try {
      await e();
    } finally {
      this.outdent(), this.enabled && s && console.log(`
` + t.SEPARATOR + `
`);
    }
  }
  /**
   * Trace and display object information
   * @param {string} message - User-defined message to display
   * @param {*} [obj] - Optional object(s) to trace (any datatype or array of objects)
   * @param {string} [mode='brief'] - Display mode: 'brief', 'verbose', or 'silent'
   * @param {string|LumberjackStyle} [style='default'] - Style type: 'default', 'headsup', 'error', 'success', or a custom LumberjackStyle instance
   */
  trace(e, s = null, n = g, r = E) {
    if (!this.enabled || n === "silent") return;
    r === "default" && s instanceof Error && (r = "error");
    const o = this._getStyle(r), l = this._getIndent(), h = this.#e.prefix?.trim(), i = o.prefix && o.prefix !== "", a = this.#e.showCallerLocation ? this._getCallerLocation() : null;
    if (!u.#i && p) {
      let f = l;
      if (h && (f += `${h} `), i && (f += p.hex(o.color)(
        o.prefix.replace(/\n/g, `
` + l)
      ), o.prefix.match(/\s$/) || (f += " ")), f += e, a) {
        const c = `${a.file}:${a.line}`;
        f += p.dim(` (${c})`);
      }
      s != null && (f += " " + (n === "brief" ? this._getValue(s, !1) : `
` + this._formatVerbosePlain(s, l))), console.log(f);
    } else {
      const f = [], c = [];
      if ((l || h) && (f.push("%c" + l + (h ? `${h} ` : "")), c.push(
        `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      )), i && (f.push("%c" + o.prefix.replace(/\n/g, `
` + l)), c.push(
        `color: ${o.color}; font-weight: ${o.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      ), o.prefix.match(/\s$/) || (f.push("%c "), c.push(
        `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      ))), f.push("%c" + e), c.push(
        `color: ${o.color}; font-weight: ${o.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      ), a) {
        const d = `${a.file}:${a.line}`;
        f.push("%c " + d), c.push(
          `color: ${t.DEFAULT.color}; font-weight: normal; font-size: 10px; opacity: 0.7`
        );
      }
      s != null && (n === "brief" ? (f.push("%c " + this._getValue(s, !1)), c.push(
        `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      )) : (f.push(`%c
` + this._formatVerbosePlain(s, l)), c.push(
        `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
      ))), console.log(f.join(""), ...c);
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
  _traceScopedBrowser(e, s, n, r, o, l, h) {
    if (!this.enabled || r === "silent") return;
    o === "default" && n instanceof Error && (o = "error");
    const i = this._getStyle(o), a = this._getIndent(), f = this.#e.showCallerLocation ? this._getCallerLocation() : null, c = [], d = [];
    a && (c.push("%c" + a), d.push(
      `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    ));
    const $ = this.#e.prefix?.trim();
    $ && (c.push("%c" + $ + " "), d.push(
      `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    )), i.prefix && (c.push("%c" + i.prefix.replace(/\n/g, `
` + a)), d.push(
      `color: ${i.color}; font-weight: ${i.fontWeight || t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    ), i.prefix.match(/\s$/) || (c.push("%c "), d.push(
      `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    )));
    const S = h || l || t.DEFAULT.color;
    c.push("%c" + e), d.push(
      `color: ${S}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    );
    const D = l || t.DEFAULT.color;
    if (c.push("%c " + s), d.push(
      `color: ${D}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    ), f) {
      const F = `${f.file}:${f.line}`;
      c.push("%c " + F), d.push(
        `color: ${t.DEFAULT.color}; font-weight: normal; font-size: 10px; opacity: 0.7`
      );
    }
    n != null && (c.push(
      "%c " + (r === "brief" ? this._getValue(n, !1) : `
` + this._formatVerbosePlain(n, a))
    ), d.push(
      `color: ${t.DEFAULT.color}; font-weight: ${t.DEFAULT.fontWeight}; font-size: ${t.DEFAULT.fontSize}px`
    )), console.log(c.join(""), ...d);
  }
  /**
   * Get the style object based on input
   * @private
   * @param {string|LumberjackStyle} style - Style name or LumberjackStyle instance
   * @returns {LumberjackStyle} Resolved style object
   */
  _getStyle(e) {
    return e instanceof Object && e.color && e.color_secondary ? e : t.getStyle(e);
  }
  /**
   * Format object for brief mode
   * @private
   * @param {*} obj - Object to format
   * @param {boolean} [inArray=false] - Whether the object is inside an array
   * @returns {string} Formatted string
   */
  _getValue(e, s = !1, n = /* @__PURE__ */ new Set()) {
    if (e === null) return "null";
    if (e === void 0) return "undefined";
    if (typeof e == "string") return e;
    if (typeof e == "number" || typeof e == "boolean") return String(e);
    if (Array.isArray(e)) {
      if (n.has(e)) return "[Circular]";
      n.add(e);
      const r = e.slice(0, U).map((l) => this._getValue(l, !0, n)), o = e.length > U ? ", ..." : "";
      return `[${r.join(", ")}${o}]`;
    }
    if (e instanceof Error)
      return `${e.name}: ${e.message}`;
    if (typeof e == "object") {
      if (n.has(e)) return "[Circular]";
      n.add(e);
      const r = Object.keys(e), l = r.slice(0, L).map(
        (i) => `${i}: ${this._getValue(e[i], !1, n)}`
      ), h = r.length > L ? ", ..." : "";
      return `{ ${l.join(", ")}${h} }`;
    }
    return typeof e == "function" ? "[Function]" : String(e);
  }
  /**
   * Format object for verbose mode with indentation
   * @private
   * @param {*} obj - Object to format
   * @param {string} indent - Current indentation string
   * @returns {string} Formatted multi-line string
   */
  _formatVerbosePlain(e, s = "", n = /* @__PURE__ */ new Set(), r = 0) {
    const o = " ".repeat(A), l = 5;
    return e === null ? "null" : e === void 0 ? "undefined" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" ? String(e) : Array.isArray(e) ? n.has(e) ? "[Circular]" : r >= l ? "[...]" : (n.add(e), e.map(
      (i) => `${s}${o}- ${this._formatVerbosePlain(
        i,
        s + o,
        n,
        r + 1
      )}`
    ).join(`
`) || "[]") : e instanceof Error ? `${e.name}: ${e.message}
${e.stack}` : typeof e == "object" ? n.has(e) ? "[Circular]" : r >= l ? "{...}" : (n.add(e), Object.entries(e).map(
      ([i, a]) => `${s}${o}${i}: ${this._formatVerbosePlain(
        a,
        s + o,
        n,
        r + 1
      )}`
    ).join(`
`) || "{}") : typeof e == "function" ? "[Function]" : String(e);
  }
  get enabled() {
    return this.#e.enabled;
  }
  set enabled(e) {
    this.#e.enabled = !!e;
  }
  getConfig() {
    return {
      enabled: this.#e.enabled,
      showCallerLocation: this.#e.showCallerLocation,
      prefix: this.#e.prefix,
      styles: this.#e.styles,
      scope: this.#e.scope
    };
  }
}
export {
  u as Lumberjack,
  u as default
};
