/**
 * A portal painted over a blocked tile opens that tile for movement. This lets
 * door artwork live on the wall layer while the portal on the interactions
 * layer remains reachable.
 *
 * @param {number} blockedTileCount
 * @param {number} portalTileCount
 */
export function isTileSampleWalkable(blockedTileCount, portalTileCount) {
  return blockedTileCount === 0 || portalTileCount > 0;
}
