import * as BABYLON from "https://cdn.babylonjs.com/babylon.js";

export function initializeEngine(canvas, player) {
  const engine = new BABYLON.Engine(canvas, true);
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

  /* CAMERA */
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2.2,
    Math.PI / 3,
    9,
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);

  /* HDR ENVIRONMENT FOR REFLECTIONS */
  const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    "https://playground.babylonjs.com/textures/environment.env",
    scene
  );
  scene.environmentTexture = hdrTexture;
  scene.createDefaultSkybox(hdrTexture, true, 1000);

  /* LIGHTING */
  new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  /* ==========================
        DISC WITH CENTER HOLE
     ========================== */

  const disc = BABYLON.MeshBuilder.CreateTorus("disc", {
    diameter: 3,
    thickness: 0.08,
    tessellation: 128
  }, scene);

  const discMat = new BABYLON.PBRMaterial("discMat", scene);
  discMat.albedoTexture = new BABYLON.Texture("assets/textures/disc.png", scene);
  discMat.metallic = 0.7;
  discMat.roughness = 0.25;
  discMat.reflectivityColor = new BABYLON.Color3(1, 1, 1);
  discMat.microSurface = 1;
  discMat.environmentTexture = hdrTexture;

  disc.material = discMat;

  /* ==========================
        JEWEL CASE - GLASS
     ========================== */

  const caseBox = BABYLON.MeshBuilder.CreateBox("case", {
    width: 4,
    height: 4,
    depth: 0.6
  }, scene);

  const glassMat = new BABYLON.PBRMaterial("glassMat", scene);
  glassMat.alpha = 0.3;
  glassMat.indexOfRefraction = 1.52;
  glassMat.metallic = 0;
  glassMat.roughness = 0.05;
  glassMat.environmentTexture = hdrTexture;

  caseBox.material = glassMat;
  caseBox.position.z = -0.2;

  /* ==========================
        JEWEL CASE HINGE
     ========================== */

  const hinge = BABYLON.MeshBuilder.CreateBox("hinge", {
    width: 0.2,
    height: 4,
    depth: 0.4
  }, scene);

  hinge.position.x = -2;
  hinge.parent = caseBox;

  /* ==========================
        RPM SYNC TO MUSIC
     ========================== */

  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  const source = audioCtx.createMediaElementSource(player.audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  let spinning = false;

  player.onPlay(() => {
    audioCtx.resume();
    spinning = true;
  });

  player.onPause(() => spinning = false);

  scene.onBeforeRenderObservable.add(() => {
    if (!spinning) return;

    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

    // RPM based on audio energy
    const rpm = average / 50;
    disc.rotation.y += 0.01 + rpm * 0.002;
  });

  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());

  function setDiscTexture(url) {
    if (url) {
      discMat.albedoTexture.dispose();
      discMat.albedoTexture = new BABYLON.Texture(url, scene);
    }
  }

  return { engine, scene, disc, camera, setDiscTexture };
}
