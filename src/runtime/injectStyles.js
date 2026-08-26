import css from "./styles.css?inline";

let injected = false;

export function injectStyles() {
  if (injected || document.getElementById("tfx-styles")) return;
  injected = true;
  const style = document.createElement("style");
  style.id = "tfx-styles";
  style.textContent = css;
  document.head.appendChild(style);
}
