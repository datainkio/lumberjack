import e from "../index.js";
import { Lumberjack as l } from "../Lumberjack.class.js";
import d from "../LumberjackStyle.js";
const a = {
  user: "alice",
  items: [1, 2, 3, 4, 5, 6, 7, 8],
  config: { theme: "dark", timeout: 5e3 },
  nested: { deep: { value: "hello" } }
}, n = document.getElementById("btn-toggle");
function c() {
  e.enabled ? (n.textContent = "🟢 Logger Enabled (Click to Disable)", n.style.background = "#10b981") : (n.textContent = "🚀 Enable Logger (Click Me First!)", n.style.background = "#fbbf24");
}
n.addEventListener("click", () => {
  e.enabled = !e.enabled, e.enabled ? e.trace(
    "✅ Logger enabled! Check console for all subsequent logs."
  ) : console.log(
    "%c⚠️ Logger disabled - no more Lumberjack output until re-enabled",
    "color: #F59E0B; font-weight: bold;"
  ), c();
});
c();
const o = document.getElementById("btn-toggle-caller-location");
function i() {
  e.config.showCallerLocation ? (o.textContent = "📍 Caller Location Enabled (Click to Disable)", o.style.background = "#60a5fa") : (o.textContent = "📍 Caller Location Disabled (Click to Enable)", o.style.background = "#ef4444");
}
o.addEventListener("click", () => {
  e.configure({
    showCallerLocation: !e.config.showCallerLocation
  }), e.config.showCallerLocation ? e.trace(
    "✅ Caller location enabled! File:line will now appear in logs."
  ) : e.trace(
    "⚠️ Caller location disabled - file:line will no longer appear in logs."
  ), i();
});
i();
document.getElementById("btn-basic").addEventListener("click", () => {
  e.trace("Standard message", a, "brief", "standard");
});
document.getElementById("btn-headsup").addEventListener("click", () => {
  e.trace(
    "Important notification",
    { priority: "high" },
    "brief",
    "headsup"
  );
});
document.getElementById("btn-success").addEventListener("click", () => {
  e.trace(
    "Operation completed",
    { duration: "1.2s" },
    "brief",
    "success"
  );
});
document.getElementById("btn-error-style").addEventListener("click", () => {
  e.trace(
    "Something went wrong",
    { code: 500 },
    "brief",
    "error"
  );
});
document.getElementById("btn-brief").addEventListener("click", () => {
  e.trace(
    "Brief mode (truncates arrays/objects)",
    a,
    "brief"
  );
});
document.getElementById("btn-verbose").addEventListener("click", () => {
  e.trace(
    "Verbose mode (expands all data)",
    a,
    "verbose"
  );
});
document.getElementById("btn-auto-error").addEventListener("click", () => {
  try {
    throw new Error("Simulated runtime error");
  } catch (t) {
    e.trace(
      "Caught exception (auto-detects Error):",
      t,
      "verbose"
    );
  }
});
document.getElementById("btn-indent").addEventListener("click", () => {
  e.trace("Level 0"), e.indent(), e.trace("Level 1 (indented)"), e.indent(), e.trace("Level 2 (double indent)"), e.outdent(), e.trace("Back to Level 1"), e.resetIndent(), e.trace("Reset to Level 0");
});
document.getElementById("btn-group").addEventListener("click", async () => {
  await e.group(async () => {
    e.trace("Parent operation started"), e.trace("Child operation 1 (auto-indented)"), e.trace("Child operation 2 (auto-indented)");
  }), e.trace("After group (indent restored)");
});
document.getElementById("btn-scoped").addEventListener("click", () => {
  const t = l.createScoped("UI", {
    prefix: "🎨",
    color: "#10B981"
  });
  t.trace("Component mounted"), t.trace("State updated", { count: 42 });
});
document.getElementById("btn-scoped-group").addEventListener("click", async () => {
  const t = l.createScoped("API", {
    prefix: "🌐",
    color: "#F59E0B"
  });
  await t.group(async () => {
    t.trace("Fetching data..."), t.trace("Processing response...");
  });
});
document.getElementById("btn-outline-brief").addEventListener("click", () => {
  e.showScriptOutline(
    "Deploy Pipeline",
    [
      { name: "build", description: "Bundle assets" },
      { name: "test", description: "Run test suite" },
      { name: "upload", description: "Deploy to CDN" }
    ],
    "brief",
    "headsup"
  );
});
document.getElementById("btn-outline-verbose").addEventListener("click", () => {
  e.showScriptOutline(
    "CI/CD Workflow",
    [
      {
        name: "lint",
        description: "Check code style",
        script: "npm run lint",
        triggers: ["push", "pull_request"]
      },
      {
        name: "build",
        description: "Compile TypeScript",
        script: "tsc --project tsconfig.json",
        dependencies: ["lint"]
      },
      {
        name: "deploy",
        description: "Upload artifacts",
        script: "aws s3 sync dist/ s3://bucket",
        dependencies: ["build"],
        triggers: ["main"]
      }
    ],
    "verbose",
    "headsup"
  );
});
const r = new d("#9333EA", "🎨");
document.getElementById("btn-custom-style").addEventListener("click", () => {
  e.trace(
    "Single custom purple message (next message will be standard)",
    { theme: "royal" },
    "brief",
    r
  );
});
document.getElementById("btn-set-default-style").addEventListener("click", () => {
  e.trace(
    "Purple style message 1",
    { count: 1 },
    "brief",
    r
  ), e.trace(
    "Purple style message 2",
    { count: 2 },
    "brief",
    r
  ), e.trace(
    "Purple style message 3 - pass style to each trace()",
    { count: 3 },
    "brief",
    r
  ), console.log(
    "%cℹ️ Note: To use custom styles, pass the style parameter to each trace() call",
    "color: #60a5fa; font-style: italic;"
  );
});
document.getElementById("btn-reset-style").addEventListener("click", () => {
  e.trace(
    "Back to standard style (gray, no prefix)",
    { reset: !0 },
    "brief",
    "standard"
  );
});
document.getElementById("btn-configure").addEventListener("click", () => {
  e.configure({
    enabled: !0,
    prefix: "[APP] "
  }), e.trace("Logger reconfigured with prefix"), c();
});
console.log(
  "%c🪓 Lumberjack Demo Loaded",
  "color: #60a5fa; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cClick buttons above to test different features. Logger is disabled by default.",
  "color: #9ca3af;"
);
