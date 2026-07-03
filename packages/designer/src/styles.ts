let installed = false;

export function ensureSceneDesignerStyles(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;

  const style = document.createElement("style");
  style.textContent = `
.scene-designer {
  --sd-bg: #101216;
  --sd-bg-soft: #171a20;
  --sd-panel: #1f242c;
  --sd-border: #3b4350;
  --sd-text: #eef2f7;
  --sd-muted: #a7b0bf;
  --sd-accent: #46d39a;
  --sd-danger: #f06f6f;
  color: var(--sd-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
}
.scene-designer button,
.scene-designer input,
.scene-designer select {
  font: inherit;
}
.scene-designer__toggle {
  position: fixed;
  z-index: 9998;
  top: 64px;
  right: 16px;
  min-width: 92px;
  border: 1px solid color-mix(in srgb, var(--sd-accent), white 14%);
  border-radius: 7px;
  padding: 8px 12px;
  background: #18261f;
  color: var(--sd-text);
  cursor: pointer;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.28);
}
.scene-designer__toggle:hover { border-color: var(--sd-accent); }
.scene-designer__panel {
  position: fixed;
  z-index: 9997;
  top: 108px;
  right: 16px;
  width: min(420px, calc(100vw - 32px));
  max-height: calc(100vh - 124px);
  overflow: auto;
  display: none;
  border: 1px solid var(--sd-border);
  border-radius: 8px;
  background: var(--sd-bg);
  box-shadow: 0 18px 60px rgb(0 0 0 / 0.42);
}
.scene-designer[data-open="true"] .scene-designer__panel { display: block; }
.scene-designer__header,
.scene-designer__section,
.scene-designer__editor {
  padding: 12px;
  border-bottom: 1px solid var(--sd-border);
}
.scene-designer__header {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
  background: var(--sd-bg-soft);
}
.scene-designer__title {
  font-weight: 700;
  letter-spacing: 0;
}
.scene-designer__row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.scene-designer__row + .scene-designer__row { margin-top: 8px; }
.scene-designer__stack {
  display: grid;
  gap: 8px;
}
.scene-designer__label {
  display: grid;
  gap: 4px;
  color: var(--sd-muted);
  font-size: 12px;
}
.scene-designer__field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}
.scene-designer__button {
  border: 1px solid var(--sd-border);
  border-radius: 6px;
  padding: 6px 9px;
  min-height: 30px;
  background: var(--sd-panel);
  color: var(--sd-text);
  cursor: pointer;
}
.scene-designer__button:hover { border-color: var(--sd-accent); }
.scene-designer__button:disabled { opacity: 0.45; cursor: not-allowed; }
.scene-designer__button--danger:hover { border-color: var(--sd-danger); }
.scene-designer__icon-button {
  width: 30px;
  height: 30px;
  padding: 0;
  display: inline-grid;
  place-items: center;
}
.scene-designer__input,
.scene-designer__select {
  min-width: 0;
  width: 100%;
  border: 1px solid var(--sd-border);
  border-radius: 6px;
  padding: 6px 8px;
  background: #0d0f13;
  color: var(--sd-text);
}
.scene-designer__subhead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
  color: var(--sd-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0;
}
.scene-designer__layer,
.scene-designer__item {
  border: 1px solid var(--sd-border);
  border-radius: 7px;
  background: var(--sd-bg-soft);
}
.scene-designer__layer { margin-bottom: 10px; }
.scene-designer__layer-header,
.scene-designer__item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 6px;
  align-items: center;
  padding: 8px;
}
.scene-designer__item {
  margin: 6px 8px;
  cursor: pointer;
}
.scene-designer__item[aria-selected="true"] {
  border-color: var(--sd-accent);
  background: #16251f;
}
.scene-designer__item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scene-designer__empty {
  color: var(--sd-muted);
  padding: 6px 8px 10px;
}
.scene-designer__asset-browser {
  border: 1px solid var(--sd-border);
  border-radius: 7px;
  overflow: hidden;
}
.scene-designer__asset-breadcrumbs,
.scene-designer__asset-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
}
.scene-designer__asset-breadcrumbs {
  background: var(--sd-bg-soft);
  border-bottom: 1px solid var(--sd-border);
}
.scene-designer__asset-chip {
  border: 1px solid var(--sd-border);
  border-radius: 999px;
  padding: 5px 8px;
  background: #0d0f13;
  color: var(--sd-text);
  cursor: pointer;
}
.scene-designer__asset-chip[aria-selected="true"] {
  border-color: var(--sd-accent);
  color: var(--sd-accent);
}
.scene-designer__status {
  min-height: 20px;
  padding: 10px 12px;
  color: var(--sd-muted);
}
.scene-designer__status[data-tone="success"] { color: var(--sd-accent); }
.scene-designer__status[data-tone="error"] { color: var(--sd-danger); }
`;
  document.head.append(style);
}
