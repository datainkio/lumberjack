import e from "./LumberjackStyles.js";
import { BRIGHTEN_PERCENT as x, DEFAULT_MODE as g, DEFAULT_STYLE as E, SCRIPT_OUTLINE_STYLE as z, DIVIDER_COLOR as T, DIVIDER_CHAR as w, INDENT_SIZE as A, MAX_ARRAY_PREVIEW as U, MAX_OBJECT_PREVIEW as D, DIVIDER_LENGTH as I } from "./config.js";
import { GROUP_START_SUFFIX as y, GROUP_COMPLETE_SUFFIX as _, SCRIPT_OUTLINE_TITLE as R, SCRIPT_OUTLINE_COUNT_TEMPLATE as C, LABEL_EXECUTES as O, LABEL_TRIGGERS as W, LABEL_REQUIRES as P, EXECUTION_BEGIN_TITLE as m, EXECUTION_BEGIN_SUBTEXT as V } from "./constants.js";
import B from "./utils.js";
let p = null;
try {
  typeof process < "u" && process.versions && process.versions.node && (p = (await import("chalk")).default);
} catch {
  p = null;
}
class h {
  static #n = null;
  static #o = !1;
  static #i = typeof window < "u" && typeof document < "u";
  // Private instance fields
  #e = 0;
  #t = {};
  /**
   * Private constructor - use static methods instead
   * @param {boolean|Object} enabled - Whether logging is enabled, or config object
   */
  constructor(t = !1) {
    if (h.#n) return h.#n;
    if (this.#t = typeof t == "object" ? {
      enabled: t.enabled ?? !1,
      prefix: "",
      styles: {},
      scope: null,
      ...t
    } : { enabled: t, prefix: "", styles: {}, scope: null }, this.enabled = this.#t.enabled, this.#e = 0, h.#n = this, !h.#o) {
      const i = this.enabled ? e.SUCCESS : e.ERROR, n = i.color, o = this.enabled ? "enabled" : "disabled";
      !h.#i && p ? console.log(
        `${p.hex(e.HEADSUP.color)(
          "Lumberjack"
        )} initialized: ${p.hex(n)(o)}`
      ) : console.log(
        "%cLumberjack %cinitialized %c",
        `color: ${e.HEADSUP.color}; font-weight: ${e.HEADSUP.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`,
        `color: inherit; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`,
        `color: ${n}; font-weight: ${i.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      ), h.#o = !0;
    }
  }
  /**
   * Apply color styling based on environment
   * @private
   */
  #r(t, i, n = {}) {
    if (!h.#i && p) {
      let o = p.hex(t)(i);
      return n.bold && (o = p.bold(o)), o;
    }
    return i;
  }
  /**
   * Get the singleton instance
   * @param {boolean} enabled - Whether logging is enabled (only used on first call)
   * @returns {Lumberjack} The singleton Lumberjack instance
   */
  static getInstance(t) {
    if (!h.#n) {
      const i = t ?? (typeof process < "u" && process.env ? process.env.DEBUG === "true" : !1);
      h.#n = new h(i);
    }
    return h.#n;
  }
  /**
   * Configure the Lumberjack instance with new options
   * @param {Object} options - Configuration options
   * @returns {Lumberjack} The configured Lumberjack instance
   */
  static configure(t = {}) {
    const i = h.getInstance();
    return Object.assign(i.#t, t), t.enabled !== void 0 && (i.enabled = t.enabled), i;
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
  static createScoped(t, i = {}) {
    const n = h.getInstance(), { color: o, prefix: r } = i, f = r ? `${r} [${t}]` : `[${t}]`, u = o ? B(o, x) : null;
    return {
      trace: (s, a = null, l = g, c = E) => {
        if (o && h.#i)
          return n._traceScopedBrowser(
            f,
            s,
            a,
            l,
            c,
            o,
            // original for message
            u
            // brightened for scope prefix
          );
        const d = o && !h.#i && p ? `${p.hex(u ?? o)(
          f
        )} ${p.hex(o)(s)}` : `${f} ${s}`;
        return n.trace(d, a, l, c);
      },
      indent: () => n.indent(),
      outdent: () => n.outdent(),
      resetIndent: () => n.resetIndent(),
      group: async (s) => {
        n.trace(
          `${f} ${y}`,
          null,
          "brief",
          "headsup"
        );
        const a = await n.group(s);
        return n.trace(
          `${f} ${_}`,
          null,
          "brief",
          "success"
        ), a;
      },
      showScriptOutline: (s, a) => n.showScriptOutline(`${t}: ${s}`, a),
      get enabled() {
        return n.enabled;
      },
      set enabled(s) {
        n.enabled = s;
      },
      scope: t,
      config: { ...n.#t, scope: t }
    };
  }
  /**
   * Static trace method for convenience
   */
  static trace(t, i = null, n = g, o = E) {
    return h.getInstance().trace(t, i, n, o);
  }
  /**
   * Static getter/setter for enabled state
   */
  static get enabled() {
    return h.getInstance().enabled;
  }
  static set enabled(t) {
    h.getInstance().enabled = t;
  }
  indent() {
    this.#e++;
  }
  outdent() {
    this.#e = Math.max(0, this.#e - 1);
  }
  resetIndent() {
    this.#e = 0;
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
  showScriptOutline(t, i, n = "brief", o = "headsup") {
    if (!this.enabled) return;
    const r = this._getStyle(o), f = r.prefix || z?.prefix, u = w.repeat(I);
    !h.#i && p ? (console.log(
      `
` + p.hex(r.color)(f) + ` ${t.toUpperCase()}`
    ), console.log(p.hex(T)(u))) : (console.log(
      `
%c` + f + "%c " + t.toUpperCase(),
      `color: ${r.color}; font-weight: ${r.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`,
      `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    ), console.log(
      "%c" + u,
      `color: ${T}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    )), this.trace(
      R,
      C.replace(
        "{count}",
        String(i.length)
      ),
      "brief",
      "headsup"
    ), this.group(() => {
      i.forEach((s, a) => {
        const l = `${a + 1}.`;
        if (n === "verbose")
          this.trace(
            `${l} ${s.name}`,
            s.description || "No description provided",
            "brief",
            "default"
          ), s.script && (this.indent(), this.trace(O, s.script, "brief", "default"), this.outdent()), s.triggers?.length && (this.indent(), this.trace(
            W,
            s.triggers.join(", "),
            "brief",
            "default"
          ), this.outdent()), s.dependencies?.length && (this.indent(), this.trace(
            P,
            s.dependencies.join(", "),
            "brief",
            "default"
          ), this.outdent());
        else {
          const c = s.description ? ` - ${s.description}` : "";
          this.trace(
            `${l} ${s.name}${c}`,
            null,
            "brief",
            "default"
          );
        }
      });
    }), this.trace(
      m,
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
    return " ".repeat(this.#e * A);
  }
  /**
   * Get caller location from stack trace
   * @private
   * @returns {Object|null} Object with file, line, and column, or null if unavailable
   */
  _getCallerLocation() {
    try {
      const i = new Error().stack?.split(`
`) || [];
      for (let n = 0; n < i.length; n++) {
        const o = i[n];
        if (o.includes("Lumberjack.class.js") || o.includes("node_modules") || o.includes("internal/"))
          continue;
        const r = o.match(/\(([^:]+):(\d+):(\d+)\)|at\s+([^:]+):(\d+):(\d+)/);
        if (r) {
          const f = r[1] || r[4], u = r[2] || r[5], s = r[3] || r[6];
          if (f.includes("Lumberjack.class.js"))
            continue;
          return { file: f, line: u, column: s };
        }
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
  async group(t) {
    const i = this.#e === 0;
    this.enabled && i && console.log(`
` + e.SEPARATOR + `
`), this.indent();
    try {
      await t();
    } finally {
      this.outdent(), this.enabled && i && console.log(`
` + e.SEPARATOR + `
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
  trace(t, i = null, n = g, o = E) {
    if (!this.enabled || n === "silent") return;
    o === "default" && i instanceof Error && (o = "error");
    const r = this._getStyle(o), f = this._getIndent(), u = this.#t.prefix?.trim(), s = r.prefix && r.prefix !== "", a = this._getCallerLocation();
    if (!h.#i && p) {
      let l = f;
      if (u && (l += `${u} `), s && (l += p.hex(r.color)(
        r.prefix.replace(/\n/g, `
` + f)
      ), r.prefix.match(/\s$/) || (l += " ")), l += t, a) {
        const c = `${a.file}:${a.line}`;
        l += p.dim(` (${c})`);
      }
      i != null && (l += " " + (n === "brief" ? this._getValue(i, !1) : `
` + this._formatVerbosePlain(i, f))), console.log(l);
    } else {
      const l = [], c = [];
      if ((f || u) && (l.push("%c" + f + (u ? `${u} ` : "")), c.push(
        `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      )), s && (l.push("%c" + r.prefix.replace(/\n/g, `
` + f)), c.push(
        `color: ${r.color}; font-weight: ${r.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      ), r.prefix.match(/\s$/) || (l.push("%c "), c.push(
        `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      ))), l.push("%c" + t), c.push(
        `color: ${r.color}; font-weight: ${r.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      ), a) {
        const d = `${a.file}:${a.line}`;
        l.push("%c " + d), c.push(
          `color: ${e.DEFAULT.color}; font-weight: normal; font-size: 10px; opacity: 0.7`
        );
      }
      i != null && (n === "brief" ? (l.push("%c " + this._getValue(i, !1)), c.push(
        `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      )) : (l.push(`%c
` + this._formatVerbosePlain(i, f)), c.push(
        `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
      ))), console.log(l.join(""), ...c);
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
  _traceScopedBrowser(t, i, n, o, r, f, u) {
    if (!this.enabled || o === "silent") return;
    r === "default" && n instanceof Error && (r = "error");
    const s = this._getStyle(r), a = this._getIndent(), l = this._getCallerLocation(), c = [], d = [];
    a && (c.push("%c" + a), d.push(
      `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    ));
    const $ = this.#t.prefix?.trim();
    $ && (c.push("%c" + $ + " "), d.push(
      `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    )), s.prefix && (c.push("%c" + s.prefix.replace(/\n/g, `
` + a)), d.push(
      `color: ${s.color}; font-weight: ${s.fontWeight || e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    ), s.prefix.match(/\s$/) || (c.push("%c "), d.push(
      `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    )));
    const S = u || f || e.DEFAULT.color;
    c.push("%c" + t), d.push(
      `color: ${S}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    );
    const L = f || e.DEFAULT.color;
    if (c.push("%c " + i), d.push(
      `color: ${L}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    ), l) {
      const F = `${l.file}:${l.line}`;
      c.push("%c " + F), d.push(
        `color: ${e.DEFAULT.color}; font-weight: normal; font-size: 10px; opacity: 0.7`
      );
    }
    n != null && (c.push(
      "%c " + (o === "brief" ? this._getValue(n, !1) : `
` + this._formatVerbosePlain(n, a))
    ), d.push(
      `color: ${e.DEFAULT.color}; font-weight: ${e.DEFAULT.fontWeight}; font-size: ${e.DEFAULT.fontSize}px`
    )), console.log(c.join(""), ...d);
  }
  /**
   * Get the style object based on input
   * @private
   * @param {string|LumberjackStyle} style - Style name or LumberjackStyle instance
   * @returns {LumberjackStyle} Resolved style object
   */
  _getStyle(t) {
    return t instanceof Object && t.color && t.color_secondary ? t : e.getStyle(t);
  }
  /**
   * Format object for brief mode
   * @private
   * @param {*} obj - Object to format
   * @param {boolean} [inArray=false] - Whether the object is inside an array
   * @returns {string} Formatted string
   */
  _getValue(t, i = !1, n = /* @__PURE__ */ new Set()) {
    if (t === null) return "null";
    if (t === void 0) return "undefined";
    if (typeof t == "string") return t;
    if (typeof t == "number" || typeof t == "boolean") return String(t);
    if (Array.isArray(t)) {
      if (n.has(t)) return "[Circular]";
      n.add(t);
      const o = t.slice(0, U).map((f) => this._getValue(f, !0, n)), r = t.length > U ? ", ..." : "";
      return `[${o.join(", ")}${r}]`;
    }
    if (t instanceof Error)
      return `${t.name}: ${t.message}`;
    if (typeof t == "object") {
      if (n.has(t)) return "[Circular]";
      n.add(t);
      const o = Object.keys(t), f = o.slice(0, D).map(
        (s) => `${s}: ${this._getValue(t[s], !1, n)}`
      ), u = o.length > D ? ", ..." : "";
      return `{ ${f.join(", ")}${u} }`;
    }
    return typeof t == "function" ? "[Function]" : String(t);
  }
  /**
   * Format object for verbose mode with indentation
   * @private
   * @param {*} obj - Object to format
   * @param {string} indent - Current indentation string
   * @returns {string} Formatted multi-line string
   */
  _formatVerbosePlain(t, i = "", n = /* @__PURE__ */ new Set(), o = 0) {
    const r = " ".repeat(A), f = 5;
    return t === null ? "null" : t === void 0 ? "undefined" : typeof t == "string" ? t : typeof t == "number" || typeof t == "boolean" ? String(t) : Array.isArray(t) ? n.has(t) ? "[Circular]" : o >= f ? "[...]" : (n.add(t), t.map(
      (s) => `${i}${r}- ${this._formatVerbosePlain(
        s,
        i + r,
        n,
        o + 1
      )}`
    ).join(`
`) || "[]") : t instanceof Error ? `${t.name}: ${t.message}
${t.stack}` : typeof t == "object" ? n.has(t) ? "[Circular]" : o >= f ? "{...}" : (n.add(t), Object.entries(t).map(
      ([s, a]) => `${i}${r}${s}: ${this._formatVerbosePlain(
        a,
        i + r,
        n,
        o + 1
      )}`
    ).join(`
`) || "{}") : typeof t == "function" ? "[Function]" : String(t);
  }
  get enabled() {
    return this.#t.enabled;
  }
  set enabled(t) {
    this.#t.enabled = !!t;
  }
}
export {
  h as Lumberjack,
  h as default
};
