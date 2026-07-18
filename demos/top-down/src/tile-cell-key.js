/**
 * Tile cell IDs are local to a tilemap platform, so runtime state must include
 * every containing scope when it addresses a rendered or collected tile.
 *
 * @param {string} sceneId
 * @param {string} platformId
 * @param {string} cellId
 * @returns {string}
 */
export function tileCellKey(sceneId, platformId, cellId) {
  return JSON.stringify([sceneId, platformId, cellId]);
}
