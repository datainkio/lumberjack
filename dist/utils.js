function f(t, o) {
  t = t.replace(/^#/, ""), t.length === 3 && (t = t.split("").map((n) => n + n).join(""));
  const s = parseInt(t.substr(0, 2), 16), a = parseInt(t.substr(2, 2), 16), r = parseInt(t.substr(4, 2), 16), i = Math.min(255, Math.floor(s * (1 + o))), l = Math.min(255, Math.floor(a * (1 + o))), p = Math.min(255, Math.floor(r * (1 + o)));
  return `#${[i, l, p].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
export {
  f as default
};
