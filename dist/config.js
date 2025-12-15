// Export plain style definitions (used to build LumberjackStyle instances)
// Each value is an object: { color: '#hex', prefix: 'emoji' }

export const DEFAULT_STYLE = {
  color: "#CCCCCC",
  prefix: "",
  fontWeight: "normal",
  fontSize: 12,
};
// All params are optional; defaults will be used for any missing values
export const HEADSUP_STYLE = { color: "#F59E0B", prefix: "⚡" };
export const ERROR_STYLE = { color: "#EF4444", prefix: "❌" };
export const SUCCESS_STYLE = { color: "#10B981", prefix: "" };

// General separator used between groups
export const SEPARATOR = "::::::::::::::::::";

// Whitespace and preview sizing
export const INDENT_SIZE = 2;
export const MAX_ARRAY_PREVIEW = 3;
export const MAX_OBJECT_PREVIEW = 3;

// Defaults for trace mode
export const DEFAULT_MODE = "brief";

// Script outline defaults
export const SCRIPT_OUTLINE_ICON = "📋";
export const SCRIPT_OUTLINE_STYLE = HEADSUP_STYLE;

// Divider settings used in outlines and headings
export const DIVIDER_CHAR = "─";
export const DIVIDER_LENGTH = 50;
export const DIVIDER_COLOR = "#808080";

// Script outline text and labels (can be customized or localized)
// (Outline/label constants moved to `constants.js`)

export const BRIGHTEN_PERCENT = 0.6;
