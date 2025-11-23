// main.js — Single-file simplified 3D Music Player

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
scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

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

// Light
new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// ===== DISC (3D with hole) =====
const disc = BABYLON.MeshBuilder.CreateTorus("disc", {
  diameter: 3,
  thickness: 0.08,
  tessellation: 64
}, scene);

const discMat = new BABYLON.PBRMaterial("discMat", scene);
discMat.albedoTexture = new BABYLON.Texture("assets/textures/disc.png", scene);
discMat.metallic = 0.6;
discMat.roughness = 0.3;
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

// ===== AUDIO REACTIVE SPIN =====
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
    disc.rotation.y += 0.01 + avg * 0.0003;
  }

  scene.render();
}

engine.runRenderLoop(render);
window.addEventListener("resize", () => engine.resize());
