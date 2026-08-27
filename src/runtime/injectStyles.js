import css from "./styles.css?inline";

export function injectStyles() {
  let style = document.getElementById("tfx-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "tfx-styles";
    document.head.appendChild(style);
  }
  style.textContent = css;
}

if (typeof document !== "undefined") injectStyles();
