      // Import from the src directory (Vite will handle the module resolution)
      import lumberjack from "../src/index.js";
      import { Lumberjack } from "../src/Lumberjack.class.js";
      import LumberjackStyle from "../src/LumberjackStyle.js";

      // Sample data for demos
      const sampleData = {
        user: "alice",
        items: [1, 2, 3, 4, 5, 6, 7, 8],
        config: { theme: "dark", timeout: 5000 },
        nested: { deep: { value: "hello" } },
      };

      // Configure lumberjack defaults
      lumberjack.configure({
        showCallerLocation: false,
      });

      // Header dropdown settings
      const dropdownBtn = document.querySelector(".dropdown-btn");
      const dropdownMenu = document.querySelector(".dropdown-menu");
      const loggingCheckbox = document.getElementById("setting-logging");
      const callerLocationCheckbox = document.getElementById("setting-caller-location");

      // Initialize checkboxes to match current state
      loggingCheckbox.checked = lumberjack.enabled;
      callerLocationCheckbox.checked = lumberjack.config.showCallerLocation;

      // Dropdown toggle
      dropdownBtn.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".dropdown-container")) {
          dropdownMenu.classList.remove("active");
        }
      });

      // Close dropdown when an option is clicked
      dropdownMenu.addEventListener("click", () => {
        dropdownMenu.classList.remove("active");
      });

      // Update dropdown item text and colors
      function updateLoggingDropdownItem() {
        const loggingText = document.getElementById("logging-text");
        if (loggingCheckbox.checked) {
          loggingText.textContent = "🟢 Disable Logger";
        } else {
          loggingText.textContent = "🚀 Enable Logger";
        }
      }

      function updateCallerLocationDropdownItem() {
        const callerLocationText = document.getElementById("caller-location-text");
        if (callerLocationCheckbox.checked) {
          callerLocationText.textContent = "📍 Disable Caller Location";
        } else {
          callerLocationText.textContent = "📍 Enable Caller Location";
        }
      }

      // Logging checkbox listener
      loggingCheckbox.addEventListener("change", () => {
        lumberjack.enabled = loggingCheckbox.checked;
        if (lumberjack.enabled) {
          lumberjack.trace("✅ Logger enabled from settings dropdown");
        } else {
          console.log(
            "%c⚠️ Logger disabled from settings dropdown",
            "color: #F59E0B; font-weight: bold;"
          );
        }
        updateLoggingDropdownItem();
      });

      // Caller location checkbox listener
      callerLocationCheckbox.addEventListener("change", () => {
        lumberjack.configure({
          showCallerLocation: callerLocationCheckbox.checked,
        });
        if (lumberjack.enabled) {
          if (callerLocationCheckbox.checked) {
            lumberjack.trace("✅ Caller location enabled from settings dropdown");
          } else {
            lumberjack.trace("⚠️ Caller location disabled from settings dropdown");
          }
        }
        updateCallerLocationDropdownItem();
      });


      document.getElementById("btn-basic").addEventListener("click", () => {
        lumberjack.trace("Standard message", sampleData, "brief", "standard");
      });

      document.getElementById("btn-headsup").addEventListener("click", () => {
        lumberjack.trace(
          "Important notification",
          { priority: "high" },
          "brief",
          "headsup"
        );
      });

      document.getElementById("btn-success").addEventListener("click", () => {
        lumberjack.trace(
          "Operation completed",
          { duration: "1.2s" },
          "brief",
          "success"
        );
      });

      document
        .getElementById("btn-error-style")
        .addEventListener("click", () => {
          lumberjack.trace(
            "Something went wrong",
            { code: 500 },
            "brief",
            "error"
          );
        });

      // 2. Brief vs Verbose
      document.getElementById("btn-brief").addEventListener("click", () => {
        lumberjack.trace(
          "Brief mode (truncates arrays/objects)",
          sampleData,
          "brief"
        );
      });

      document.getElementById("btn-verbose").addEventListener("click", () => {
        lumberjack.trace(
          "Verbose mode (expands all data)",
          sampleData,
          "verbose"
        );
      });

      // 3. Auto Error Detection
      document
        .getElementById("btn-auto-error")
        .addEventListener("click", () => {
          try {
            throw new Error("Simulated runtime error");
          } catch (err) {
            lumberjack.trace(
              "Caught exception (auto-detects Error):",
              err,
              "verbose"
            );
          }
        });

      // 4. Indentation & Grouping
      document.getElementById("btn-indent").addEventListener("click", () => {
        lumberjack.trace("Level 0");
        lumberjack.indent();
        lumberjack.trace("Level 1 (indented)");
        lumberjack.indent();
        lumberjack.trace("Level 2 (double indent)");
        lumberjack.outdent();
        lumberjack.trace("Back to Level 1");
        lumberjack.resetIndent();
        lumberjack.trace("Reset to Level 0");
      });

      document
        .getElementById("btn-group")
        .addEventListener("click", async () => {
          await lumberjack.group(async () => {
            lumberjack.trace("Parent operation started");
            lumberjack.trace("Child operation 1 (auto-indented)");
            lumberjack.trace("Child operation 2 (auto-indented)");
          });
          lumberjack.trace("After group (indent restored)");
        });

      // 5. Scoped Loggers
      document.getElementById("btn-scoped").addEventListener("click", () => {
        const uiLogger = Lumberjack.createScoped("UI", {
          prefix: "🎨",
          color: "#10B981",
        });
        uiLogger.trace("Component mounted");
        uiLogger.trace("State updated", { count: 42 });
      });

      document
        .getElementById("btn-scoped-group")
        .addEventListener("click", async () => {
          const apiLogger = Lumberjack.createScoped("API", {
            prefix: "🌐",
            color: "#F59E0B",
          });
          await apiLogger.group(async () => {
            apiLogger.trace("Fetching data...");
            apiLogger.trace("Processing response...");
          });
        });

      // 6. Script Outlines
      document
        .getElementById("btn-outline-brief")
        .addEventListener("click", () => {
          lumberjack.showScriptOutline(
            "Deploy Pipeline",
            [
              { name: "build", description: "Bundle assets" },
              { name: "test", description: "Run test suite" },
              { name: "upload", description: "Deploy to CDN" },
            ],
            "brief",
            "headsup"
          );
        });

      document
        .getElementById("btn-outline-verbose")
        .addEventListener("click", () => {
          lumberjack.showScriptOutline(
            "CI/CD Workflow",
            [
              {
                name: "lint",
                description: "Check code style",
                script: "npm run lint",
                triggers: ["push", "pull_request"],
              },
              {
                name: "build",
                description: "Compile TypeScript",
                script: "tsc --project tsconfig.json",
                dependencies: ["lint"],
              },
              {
                name: "deploy",
                description: "Upload artifacts",
                script: "aws s3 sync dist/ s3://bucket",
                dependencies: ["build"],
                triggers: ["main"],
              },
            ],
            "verbose",
            "headsup"
          );
        });

      // 7. Custom Styles
      const purpleStyle = new LumberjackStyle("#9333EA", "🎨");

      document
        .getElementById("btn-custom-style")
        .addEventListener("click", () => {
          lumberjack.trace(
            "Single custom purple message (next message will be standard)",
            { theme: "royal" },
            "brief",
            purpleStyle
          );
        });

      document
        .getElementById("btn-set-default-style")
        .addEventListener("click", () => {
          // Note: Lumberjack doesn't support changing default style via configure
          // So we'll demonstrate by logging multiple messages with the custom style
          lumberjack.trace(
            "Purple style message 1",
            { count: 1 },
            "brief",
            purpleStyle
          );
          lumberjack.trace(
            "Purple style message 2",
            { count: 2 },
            "brief",
            purpleStyle
          );
          lumberjack.trace(
            "Purple style message 3 - pass style to each trace()",
            { count: 3 },
            "brief",
            purpleStyle
          );
          console.log(
            "%cℹ️ Note: To use custom styles, pass the style parameter to each trace() call",
            "color: #60a5fa; font-style: italic;"
          );
        });

      document
        .getElementById("btn-reset-style")
        .addEventListener("click", () => {
          lumberjack.trace(
            "Back to standard style (gray, no prefix)",
            { reset: true },
            "brief",
            "standard"
          );
        });

      // 8. Configuration
      document.getElementById("btn-configure").addEventListener("click", () => {
        lumberjack.configure({
          enabled: true,
          prefix: "[APP] ",
        });
        lumberjack.trace("Logger reconfigured with prefix");
        updateToggleButton();
      });

      // Initial message
      console.log(
        "%c🪓 Lumberjack Demo Loaded",
        "color: #60a5fa; font-size: 16px; font-weight: bold;"
      );
      console.log(
        "%cClick buttons above to test different features. Logger is disabled by default.",
        "color: #9ca3af;"
      );