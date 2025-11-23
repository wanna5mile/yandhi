import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

/**
 * Initializes Babylon engine, scene, and spinning disc plane
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {MusicPlayer} player - Your music player instance
 * @returns {Object} - { engine, scene, discPlane, camera, setDiscTexture }
 */
export function initializeEngine(canvas, player) {
  const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
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

  // Disc plane
  const discPlane = BABYLON.MeshBuilder.CreatePlane("discPlane", { size: 3 }, scene);
  discPlane.position.set(0, 0, 0);
  discPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

  const mat = new BABYLON.StandardMaterial("discMat", scene);
  mat.diffuseTexture = new BABYLON.Texture("assets/textures/disc.png", scene);
  mat.backFaceCulling = false;
  mat.diffuseTexture.hasAlpha = true;
  discPlane.material = mat;

  // Spin control
  let spinning = false;
  player.onPlay(() => spinning = true);
  player.onPause(() => spinning = false);

  scene.onBeforeRenderObservable.add(() => {
    if (spinning) {
      discPlane.rotation.x += 0.02;
      discPlane.rotation.z += 0.015;
    }
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());

  // Utility to change disc texture dynamically
  function setDiscTexture(url) {
    if (url) {
      mat.diffuseTexture.dispose();
      mat.diffuseTexture = new BABYLON.Texture(url, scene);
      mat.diffuseTexture.hasAlpha = true;
    }
  }

  return { engine, scene, discPlane, camera, setDiscTexture };
}
