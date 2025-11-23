// src/engine/engine.js
import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

/**
 * Initializes Babylon engine, scene, and spinning disc plane
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {MusicPlayer} player - Your music player instance
 * @returns {Object} - { engine, scene, discPlane, camera }
 */
export function initializeEngine(canvas, player) {
  // Create Babylon engine
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  // Create scene
  const scene = new BABYLON.Scene(engine);

  // Camera
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2.5,
    7,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);

  // Light
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Create a plane for the disc
  const discPlane = BABYLON.MeshBuilder.CreatePlane("discPlane", { size: 3 }, scene);
  discPlane.position = new BABYLON.Vector3(0, 0, 0);
  discPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL; // always face camera

  // Material with double-sided disc texture
  const mat = new BABYLON.StandardMaterial("discMat", scene);
  mat.diffuseTexture = new BABYLON.Texture("assets/textures/disc.png", scene);
  mat.backFaceCulling = false; // double-sided
  mat.diffuseTexture.hasAlpha = true;

  discPlane.material = mat;

  // Spin plane only when music is playing
  let spinning = false;

  player.onPlay(() => { spinning = true; });
  player.onPause(() => { spinning = false; });

  scene.onBeforeRenderObservable.add(() => {
    if (spinning) {
      discPlane.rotation.x += 0.02;
      discPlane.rotation.z += 0.015;
    }
  });

  // Run render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  // Handle window resize
  window.addEventListener("resize", () => engine.resize());

  // Return objects for further control
  return { engine, scene, discPlane, camera };
}
