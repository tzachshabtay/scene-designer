let installed = false;

export function ensureSceneDesignerStyles(): void {
  if (installed || typeof document === "undefined") return;
  installed = true;

  const style = document.createElement("style");
  style.textContent = `
.scene-designer {
  position: fixed;
  top: 64px;
  right: 14px;
  z-index: 2147483646;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  --sd-bg: rgba(20, 24, 32, 0.97);
  --sd-bg-soft: #1b2230;
  --sd-panel: #273142;
  --sd-border: #303949;
  --sd-border-strong: #58657a;
  --sd-text: #f5f7fb;
  --sd-muted: #b9c1cf;
  --sd-accent: #8bb8ff;
  --sd-success: #46d39a;
  --sd-danger: #f06f6f;
  color: var(--sd-text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 13px;
}
.scene-designer * { box-sizing: border-box; }
.scene-designer [hidden] { display: none !important; }
.scene-designer button,
.scene-designer input,
.scene-designer select {
  font: inherit;
}
.scene-designer__toggle {
  min-width: 74px;
  height: 42px;
  padding: 0 16px;
  border: 1px solid #63708a;
  border-radius: 999px;
  background: #202838;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.35);
  transition: background 140ms ease, border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}
.scene-designer__toggle:hover,
.scene-designer__toggle:focus-visible {
  border-color: #8bb8ff;
  background: #253149;
  box-shadow:
    0 0 0 3px rgba(74, 144, 255, 0.24),
    0 0 22px rgba(74, 144, 255, 0.42),
    0 12px 30px rgba(0, 0, 0, 0.42);
  transform: translateY(-1px);
}
.scene-designer__toggle + .scene-designer__toggle { margin-top: 8px; }
.scene-designer__panel {
  display: none;
  width: min(420px, calc(100vw - 28px));
  max-height: calc(100vh - 124px);
  overflow-y: auto;
  margin-top: 10px;
  padding: 14px;
  border: 1px solid var(--sd-border);
  border-radius: 8px;
  background: var(--sd-bg);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
}
.scene-designer[data-open="scenes"] .scene-designer__panel[data-panel="scenes"],
.scene-designer[data-open="behaviors"] .scene-designer__panel[data-panel="behaviors"] { display: block; }
.scene-designer__header,
.scene-designer__section,
.scene-designer__editor {
  padding: 0;
  margin-bottom: 12px;
  border-bottom: 0;
}
.scene-designer__header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  background: transparent;
}
.scene-designer__title {
  font-weight: 700;
  font-size: 15px;
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
  border: 1px solid var(--sd-border-strong);
  border-radius: 6px;
  padding: 6px 9px;
  min-height: 30px;
  background: var(--sd-panel);
  color: var(--sd-text);
  cursor: pointer;
}
.scene-designer__button:hover { border-color: var(--sd-accent); background: #2d384b; }
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
  background: #111722;
  color: #dbeafe;
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
.scene-designer__item,
.scene-designer__attribute {
  border: 1px solid var(--sd-border);
  border-radius: 7px;
  background: rgba(27, 34, 48, 0.72);
}
.scene-designer__layer,
.scene-designer__attribute { margin-bottom: 10px; }
.scene-designer__layer-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto auto auto auto;
  gap: 6px;
  align-items: center;
  padding: 8px;
}
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
.scene-designer__layer-body {
  border-top: 1px solid rgba(88, 101, 122, 0.42);
  padding: 8px 0;
}
.scene-designer__item[aria-selected="true"] {
  border-color: var(--sd-accent);
  background: #202838;
}
.scene-designer__item-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scene-designer__attribute {
  padding: 8px;
}
.scene-designer__attribute-row {
  margin: 6px 8px;
  padding: 8px;
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
.scene-designer__asset-preview {
  display: grid;
  place-items: center;
  min-height: 96px;
  border: 1px solid var(--sd-border);
  border-radius: 7px;
  background:
    linear-gradient(45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.05) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.05) 75%),
    #111722;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
  background-size: 16px 16px;
  overflow: hidden;
}
.scene-designer__asset-preview img {
  display: block;
  max-width: 100%;
  max-height: 140px;
  object-fit: contain;
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
.scene-designer__tile-toolbar {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 6px;
}
.scene-designer__tile-tool {
  min-width: 0;
  padding-inline: 6px;
}
.scene-designer__tile-tool[aria-pressed="true"] {
  border-color: var(--sd-accent);
  background: #253b5d;
  color: #dbeafe;
  box-shadow: inset 0 0 0 1px rgba(139, 184, 255, 0.28);
}
.scene-designer__tile-palette-section {
  overflow: hidden;
  border: 1px solid var(--sd-border);
  border-radius: 7px;
  background: #111722;
}
.scene-designer__tile-palette-section > .scene-designer__subhead {
  margin: 0;
  padding: 8px;
  border-bottom: 1px solid var(--sd-border);
  background: var(--sd-bg-soft);
}
.scene-designer__tile-palette {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
  gap: 6px;
  max-height: 260px;
  overflow-y: auto;
  padding: 8px;
}
.scene-designer__tile-option {
  display: grid;
  min-width: 0;
  gap: 5px;
  align-content: start;
  padding: 6px;
  border: 1px solid var(--sd-border);
  border-radius: 6px;
  background: #0d0f13;
  color: var(--sd-text);
  cursor: pointer;
}
.scene-designer__tile-option:hover,
.scene-designer__tile-option:focus-visible {
  border-color: var(--sd-accent);
  background: #182235;
}
.scene-designer__tile-option[aria-selected="true"] {
  border-color: var(--sd-accent);
  background: #202f48;
  box-shadow: inset 0 0 0 1px rgba(139, 184, 255, 0.28);
}
.scene-designer__tile-swatch {
  display: block;
  width: 100%;
  min-height: 42px;
  border: 1px solid rgba(185, 193, 207, 0.26);
  border-radius: 4px;
  background-color: #151b27;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}
.scene-designer__tile-name {
  overflow: hidden;
  color: var(--sd-muted);
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scene-designer__tile-summary {
  color: var(--sd-muted);
  font-size: 11px;
}
.scene-designer__status {
  min-height: 20px;
  padding: 10px 12px;
  color: var(--sd-muted);
}
.scene-designer__status[data-tone="success"] { color: var(--sd-success); }
.scene-designer__status[data-tone="error"] { color: var(--sd-danger); }
.scene-designer__dialog {
  width: min(320px, calc(100vw - 32px));
  border: 1px solid var(--sd-border);
  border-radius: 8px;
  padding: 14px;
  background: var(--sd-bg);
  color: var(--sd-text);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
}
.scene-designer__dialog::backdrop {
  background: rgba(0, 0, 0, 0.34);
}
.scene-designer__dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
`;
  document.head.append(style);
}
