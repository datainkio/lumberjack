/** Not implement yet. Intended to provide a subtle effect to distinguish between class names and values */
function brighten(hex, percent) {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Expand 3-digit hex codes to 6-digit
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Brighten each component
  const newR = Math.min(255, Math.floor(r * (1 + percent)));
  const newG = Math.min(255, Math.floor(g * (1 + percent)));
  const newB = Math.min(255, Math.floor(b * (1 + percent)));

  // Convert back to hex and return
  return `#${[newR, newG, newB]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
}

export default brighten;
