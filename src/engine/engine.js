// src/engine/engine.js
import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

/**
 * Initializes Babylon engine, scene, and spinning disc cube
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {MusicPlayer} player - Your music player instance
 * @returns {Object} - { engine, scene, discCube }
 */
export function initializeEngine(canvas, player) {
  // Create Babylon engine
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

  // Create scene
  const scene = new BABYLON.Scene(engine);

  // Optional: simple camera and light
  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 7, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Create the spinning disc cube
  const discCube = BABYLON.MeshBuilder.CreateBox("discCube", { size: 2 }, scene);
  discCube.position = new BABYLON.Vector3(0, 0, 0); // center of scene

  // Transparent material with double-sided disc
  const mat = new BABYLON.StandardMaterial("discMat", scene);
  mat.diffuseTexture = new BABYLON.Texture("assets/textures/disc.png", scene);
  mat.backFaceCulling = false;   // double-sided
  mat.alpha = 0;                 // cube itself invisible
  mat.diffuseTexture.hasAlpha = true;

  discCube.material = mat;

  // Spin cube only when music is playing
  let spinning = false;

  player.onPlay(() => { spinning = true; });
  player.onPause(() => { spinning = false; });

  scene.onBeforeRenderObservable.add(() => {
    if (spinning) {
      discCube.rotation.x += 0.02;
      discCube.rotation.z += 0.015;
    }
  });

  // Run the render loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    engine.resize();
  });

  // Return objects if needed for further control
  return { engine, scene, discCube, camera };
}
