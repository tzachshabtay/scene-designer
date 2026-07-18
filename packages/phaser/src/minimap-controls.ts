export type MinimapPanelPosition = {
  left: number;
  top: number;
};

export function clampMinimapPanelPosition(
  position: MinimapPanelPosition,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  margin = 8
): MinimapPanelPosition {
  return {
    left: Math.max(margin, Math.min(viewport.width - panel.width - margin, position.left)),
    top: Math.max(margin, Math.min(viewport.height - panel.height - margin, position.top))
  };
}

export function parseZoomPercentage(value: string): number | undefined {
  const normalized = value.trim().replace(/%$/, "").trim();
  if (!normalized) return undefined;
  const percentage = Number(normalized);
  return Number.isFinite(percentage) && percentage > 0 ? percentage : undefined;
}
