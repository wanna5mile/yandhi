// main.js — Single-file simplified 3D Music Player (UPDATED)

// ===== BASIC SETUP =====
const canvas = document.getElementById("renderCanvas");
const audio = document.getElementById("audio");

const playlist = [
  "./assets/music/byebyebaby.mp3"
];
let currentIndex = 0;
let isPlaying = false;

audio.src = playlist[currentIndex];

// ===== PLAYER BUTTONS =====
const playBtn = document.getElementById("playBtn");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const playIcon = playBtn.querySelector("i");

playBtn.onclick = () => {
  if (!isPlaying) {
    audio.play();
    isPlaying = true;
    playIcon.classList.replace("fa-play-circle", "fa-pause-circle");
  } else {
    audio.pause();
    isPlaying = false;
    playIcon.classList.replace("fa-pause-circle", "fa-play-circle");
  }
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % playlist.length;
  audio.src = playlist[currentIndex];
  audio.play();
  isPlaying = true;
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  audio.src = playlist[currentIndex];
  audio.play();
  isPlaying = true;
};

// ===== BABYLON ENGINE =====
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// ✅ White background
scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

// Camera
const camera = new BABYLON.ArcRotateCamera(
  "camera",
  Math.PI / 2,
  Math.PI / 2.5,
  8,
  BABYLON.Vector3.Zero(),
  scene
);
camera.attachControl(canvas, true);

// ===== PROPER STUDIO LIGHTING SETUP =====

// Soft ambient fill
const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
hemiLight.intensity = 0.4;

// Main directional light (key light)
const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
dirLight.position = new BABYLON.Vector3(5, 8, 5);
dirLight.intensity = 1.2;

// Subtle rim light for disc edge glow
const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 2, -3), scene);
pointLight.intensity = 0.6;

// ===== DISC (REAL CD SHAPE WITH CENTER HOLE, STANDING) =====

// Create solid disc body
const discBody = BABYLON.MeshBuilder.CreateCylinder("discBody", {
  height: 0.05,
  diameter: 3,
  tessellation: 96
}, scene);

// Create center hole cutter
const hole = BABYLON.MeshBuilder.CreateCylinder("hole", {
  height: 0.06,
  diameter: 0.4,
  tessellation: 64
}, scene);

// Subtract hole from disc body using CSG
const discCSG = BABYLON.CSG.FromMesh(discBody).subtract(BABYLON.CSG.FromMesh(hole));
const disc = discCSG.toMesh("disc", null, scene);

discBody.dispose();
hole.dispose();

// Make disc stand upright
// Cylinder is horizontal by default, rotate it vertically
disc.rotation.x = Math.PI / 2;

const discMat = new BABYLON.PBRMaterial("discMat", scene);

// Texture on both sides
discMat.albedoTexture = new BABYLON.Texture("src/assets/textures/disc.png", scene);
discMat.backFaceCulling = false;

discMat.metallic = 0.4;
discMat.roughness = 0.25;
discMat.clearCoat.isEnabled = true;
discMat.clearCoat.intensity = 0.8;

disc.material = discMat;

// ===== TRANSPARENT CASE =====
const caseBox = BABYLON.MeshBuilder.CreateBox("case", {
  width: 4,
  height: 4,
  depth: 0.5
}, scene);

const glassMat = new BABYLON.PBRMaterial("glassMat", scene);
glassMat.alpha = 0.25;
glassMat.indexOfRefraction = 1.5;
glassMat.roughness = 0.05;
caseBox.material = glassMat;
caseBox.position.z = -0.2;

// ===== AUDIO REACTIVE SPIN (IN PLACE) =====
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const src = audioCtx.createMediaElementSource(audio);
src.connect(analyser);
analyser.connect(audioCtx.destination);

const dataArray = new Uint8Array(analyser.frequencyBinCount);

function render() {
  if (isPlaying) {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;

    // ✅ Spins in place like a real upright CD
    disc.rotation.z += 0.01 + avg * 0.0003;
  }

  scene.render();
}

engine.runRenderLoop(render);
window.addEventListener("resize", () => engine.resize());
