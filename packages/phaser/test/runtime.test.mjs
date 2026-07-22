import assert from "node:assert/strict";
import test from "node:test";

import { applyObjectTransform, createSceneObjects } from "../dist/runtime.js";

test("scene objects accept live transforms, follow previews, and release texture bindings", () => {
  const bindingCalls = [];
  let destroyedBindings = 0;
  const scene = fakeScene();
  const aiRuntime = {
    key(assetId) {
      assert.equal(assetId, "roof");
      return "roof";
    },
    bindTexture(target, assetId, options) {
      bindingCalls.push({ target, assetId, options });
      return {
        destroy() {
          destroyedBindings += 1;
        }
      };
    }
  };

  const [created] = createSceneObjects(scene, sceneDefinition(), aiRuntime);
  assert.ok(created);
  assert.equal(bindingCalls.length, 1);
  assert.deepEqual(
    { assetId: bindingCalls[0].assetId, options: bindingCalls[0].options },
    { assetId: "roof", options: { setInitialTexture: false } }
  );
  assert.strictEqual(bindingCalls[0].target, created);

  bindingCalls[0].target.setTexture("roof.preview");
  assert.equal(created.texture, "roof.preview");

  applyObjectTransform(created, {
    ...sceneDefinition().layers[0].objects[0],
    x: 128,
    y: 144,
    scaleX: 1.5,
    scaleY: 0.75,
    rotation: 90
  });
  assert.deepEqual(
    {
      x: created.x,
      y: created.y,
      scale: created.scale,
      rotation: created.rotation
    },
    {
      x: 128,
      y: 144,
      scale: { x: 1.5, y: 0.75 },
      rotation: 90
    }
  );

  created.destroy();
  assert.equal(destroyedBindings, 1);
});

function sceneDefinition() {
  return {
    id: "world",
    name: "World",
    width: 640,
    height: 480,
    layers: [
      {
        id: "roofs",
        name: "Roofs",
        visible: true,
        locked: false,
        objects: [
          {
            id: "roof-one",
            tag: "roof",
            assetId: "roof",
            x: 64,
            y: 96,
            scaleX: 1,
            scaleY: 1,
            rotation: 0,
            anchorX: 0,
            anchorY: 1,
            visible: true,
            locked: false
          }
        ],
        areas: []
      }
    ]
  };
}

function fakeScene() {
  return {
    add: {
      sprite(x, y, texture) {
        let destroyListener;
        return {
          x,
          y,
          texture,
          once(event, listener) {
            assert.equal(event, "destroy");
            destroyListener = listener;
            return this;
          },
          setPosition(nextX, nextY) {
            this.x = nextX;
            this.y = nextY;
            return this;
          },
          setOrigin(anchorX, anchorY) {
            this.origin = { x: anchorX, y: anchorY };
            return this;
          },
          setScale(scaleX, scaleY) {
            this.scale = { x: scaleX, y: scaleY };
            return this;
          },
          setAngle(rotation) {
            this.rotation = rotation;
            return this;
          },
          setVisible(visible) {
            this.visible = visible;
            return this;
          },
          setDepth(depth) {
            this.depth = depth;
            return this;
          },
          setTexture(nextTexture) {
            this.texture = nextTexture;
            return this;
          },
          destroy() {
            destroyListener?.();
          }
        };
      }
    }
  };
}
