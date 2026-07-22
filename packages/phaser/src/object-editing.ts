import type { SceneObject } from "@scene-designer/core";

export type ObjectCornerScaleHandle = "scale-nw" | "scale-ne" | "scale-se" | "scale-sw";
export type ObjectEdgeScaleHandle = "scale-n" | "scale-e" | "scale-s" | "scale-w";
export type ObjectScaleHandle = ObjectCornerScaleHandle | ObjectEdgeScaleHandle;

export type ObjectEditingPoint = {
  x: number;
  y: number;
};

export type ObjectEditingSize = {
  width: number;
  height: number;
};

export type ObjectScaleHandlePoint = {
  kind: ObjectScaleHandle;
  point: ObjectEditingPoint;
};

const CORNER_HANDLES: ObjectCornerScaleHandle[] = [
  "scale-nw",
  "scale-ne",
  "scale-se",
  "scale-sw"
];

const EDGE_HANDLES: ObjectEdgeScaleHandle[] = [
  "scale-n",
  "scale-e",
  "scale-s",
  "scale-w"
];

const OPPOSITE_EDGE: Record<ObjectEdgeScaleHandle, ObjectEdgeScaleHandle> = {
  "scale-n": "scale-s",
  "scale-e": "scale-w",
  "scale-s": "scale-n",
  "scale-w": "scale-e"
};

type ObjectGeometry = Pick<
  SceneObject,
  "x" | "y" | "scaleX" | "scaleY" | "rotation" | "anchorX" | "anchorY"
>;

export function objectScaleHandlePoints(
  object: ObjectGeometry,
  size: ObjectEditingSize
): ObjectScaleHandlePoint[] {
  const left = -object.anchorX * size.width;
  const right = (1 - object.anchorX) * size.width;
  const top = -(1 - object.anchorY) * size.height;
  const bottom = object.anchorY * size.height;
  const middleX = (left + right) / 2;
  const middleY = (top + bottom) / 2;
  const localPoints: ObjectEditingPoint[] = [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom },
    { x: middleX, y: top },
    { x: right, y: middleY },
    { x: middleX, y: bottom },
    { x: left, y: middleY }
  ];

  return [...CORNER_HANDLES, ...EDGE_HANDLES].map((kind, index) => ({
    kind,
    point: objectLocalToWorld(localPoints[index], object)
  }));
}

export function nearestObjectScaleHandle(
  point: ObjectEditingPoint,
  handles: ObjectScaleHandlePoint[],
  maximumDistance: number
): ObjectScaleHandle | undefined {
  let nearest: ObjectScaleHandlePoint | undefined;
  let nearestDistance = maximumDistance;

  for (const handle of handles) {
    const candidateDistance = distance(point, handle.point);
    if (candidateDistance < nearestDistance) {
      nearest = handle;
      nearestDistance = candidateDistance;
    }
  }

  return nearest?.kind;
}

export function resizeObjectFromEdge(
  object: ObjectGeometry,
  sourceSize: ObjectEditingSize,
  handle: ObjectEdgeScaleHandle,
  startPointer: ObjectEditingPoint,
  pointer: ObjectEditingPoint,
  minimumScale = 0.05
): Partial<Pick<SceneObject, "x" | "y" | "scaleX" | "scaleY">> {
  const displaySize = {
    width: Math.abs(object.scaleX) * sourceSize.width,
    height: Math.abs(object.scaleY) * sourceSize.height
  };
  const handles = objectScaleHandlePoints(object, displaySize);
  const draggedHandle = handles.find((candidate) => candidate.kind === handle)?.point;
  const fixedHandle = handles.find((candidate) => candidate.kind === OPPOSITE_EDGE[handle])?.point;

  if (!draggedHandle || !fixedHandle) return {};

  // Preserve the exact spot at which the user grabbed the handle so resizing
  // does not jump when the pointer starts near, rather than on, its center.
  const targetHandle = {
    x: pointer.x - (startPointer.x - draggedHandle.x),
    y: pointer.y - (startPointer.y - draggedHandle.y)
  };
  const localDelta = rotateVector({
    x: targetHandle.x - fixedHandle.x,
    y: targetHandle.y - fixedHandle.y
  }, -object.rotation);

  const minimumWidth = Math.max(0, minimumScale) * sourceSize.width;
  const minimumHeight = Math.max(0, minimumScale) * sourceSize.height;
  let nextWidth = displaySize.width;
  let nextHeight = displaySize.height;

  if (handle === "scale-e") nextWidth = Math.max(minimumWidth, localDelta.x);
  if (handle === "scale-w") nextWidth = Math.max(minimumWidth, -localDelta.x);
  if (handle === "scale-s") nextHeight = Math.max(minimumHeight, localDelta.y);
  if (handle === "scale-n") nextHeight = Math.max(minimumHeight, -localDelta.y);

  const fixedLocal = fixedEdgeLocalPoint(object, { width: nextWidth, height: nextHeight }, handle);
  const fixedOffset = rotateVector(fixedLocal, object.rotation);
  const position = {
    x: fixedHandle.x - fixedOffset.x,
    y: fixedHandle.y - fixedOffset.y
  };

  if (handle === "scale-e" || handle === "scale-w") {
    return {
      x: position.x,
      y: position.y,
      scaleX: scaleWithPreservedSign(object.scaleX, nextWidth / sourceSize.width)
    };
  }

  return {
    x: position.x,
    y: position.y,
    scaleY: scaleWithPreservedSign(object.scaleY, nextHeight / sourceSize.height)
  };
}

function fixedEdgeLocalPoint(
  object: ObjectGeometry,
  size: ObjectEditingSize,
  draggedHandle: ObjectEdgeScaleHandle
): ObjectEditingPoint {
  const left = -object.anchorX * size.width;
  const right = (1 - object.anchorX) * size.width;
  const top = -(1 - object.anchorY) * size.height;
  const bottom = object.anchorY * size.height;
  const middleX = (left + right) / 2;
  const middleY = (top + bottom) / 2;

  switch (draggedHandle) {
    case "scale-n":
      return { x: middleX, y: bottom };
    case "scale-e":
      return { x: left, y: middleY };
    case "scale-s":
      return { x: middleX, y: top };
    case "scale-w":
      return { x: right, y: middleY };
  }
}

function objectLocalToWorld(point: ObjectEditingPoint, object: ObjectGeometry): ObjectEditingPoint {
  const offset = rotateVector(point, object.rotation);
  return {
    x: object.x + offset.x,
    y: object.y + offset.y
  };
}

function rotateVector(point: ObjectEditingPoint, degrees: number): ObjectEditingPoint {
  const radians = degrees * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
}

function scaleWithPreservedSign(currentScale: number, magnitude: number): number {
  return (currentScale < 0 ? -1 : 1) * magnitude;
}

function distance(left: ObjectEditingPoint, right: ObjectEditingPoint): number {
  return Math.hypot(right.x - left.x, right.y - left.y);
}
