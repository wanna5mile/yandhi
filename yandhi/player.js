// ✅ SINGLE-FILE WORKING MUSIC PLAYER (RESTORED + MERGED + STABLE)
// Drop this in event.js and REMOVE other JS imports

window.addEventListener("DOMContentLoaded", () => {

  const waitForBabylon = setInterval(() => {
    if (!window.BABYLON) return;
    clearInterval(waitForBabylon);

    // ================= AUDIO SETUP =================
    const canvas = document.getElementById("renderCanvas");
    const audio = document.getElementById("audio");

    const playlist = ["tracks/byebyebaby.mp3"];
    let currentIndex = 0;
    let isPlaying = false;

    audio.src = playlist[currentIndex];

    // ================= BUTTONS =================
    const playBtn = document.getElementById("playBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const repeatBtn = document.getElementById("repeatBtn");
    const playIcon = playBtn.querySelector("i");

    let shuffle = false;
    let repeat = false;

    // ================= BABYLON ENGINE =================
    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(1, 1, 1, 1);

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 2.5,
      8,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // Lighting
    const hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.4;

    const dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
    dirLight.position = new BABYLON.Vector3(5, 8, 5);
    dirLight.intensity = 1.2;

    const pointLight = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 2, -3), scene);
    pointLight.intensity = 0.6;

    // ================= DISC =================
    const discBody = BABYLON.MeshBuilder.CreateCylinder("discBody", {
      height: 0.05,
      diameter: 3,
      tessellation: 96
    }, scene);

    const hole = BABYLON.MeshBuilder.CreateCylinder("hole", {
      height: 0.06,
      diameter: 0.4,
      tessellation: 64
    }, scene);

    const discCSG = BABYLON.CSG.FromMesh(discBody).subtract(BABYLON.CSG.FromMesh(hole));
    const disc = discCSG.toMesh("disc", null, scene);

    discBody.dispose();
    hole.dispose();

    disc.rotation.x = Math.PI / 2;

    const discMat = new BABYLON.PBRMaterial("discMat", scene);
    discMat.albedoTexture = new BABYLON.Texture("images/disc.png", scene);
    discMat.backFaceCulling = false;
    discMat.metallic = 0.4;
    discMat.roughness = 0.25;
    discMat.clearCoat.isEnabled = true;
    discMat.clearCoat.intensity = 0.8;
    disc.material = discMat;

    // ================= CASE + TAPE =================
    const tape = BABYLON.MeshBuilder.CreateBox("tape", {
      width: 0.4,
      height: 4 / 3,
      depth: 0.52
    }, scene);

    tape.position.x = 2.2;
    tape.position.z = -0.2;

    const tapeMat = new BABYLON.StandardMaterial("tapeMat", scene);
    tapeMat.diffuseColor = new BABYLON.Color3(0.75, 0.6, 0.9);
    tape.material = tapeMat;

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

    // ================= AUDIO ANALYSER =================
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const src = audioCtx.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(audioCtx.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    // ================= CONTROLS =================
    playBtn.onclick = () => {
      audioCtx.resume();

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
      currentIndex = shuffle
        ? Math.floor(Math.random() * playlist.length)
        : (currentIndex + 1) % playlist.length;

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

    shuffleBtn.onclick = () => {
      shuffle = !shuffle;
      shuffleBtn.classList.toggle("active", shuffle);
    };

    repeatBtn.onclick = () => {
      repeat = !repeat;
      repeatBtn.classList.toggle("active", repeat);
      audio.loop = repeat;
    };

    audio.addEventListener("ended", () => {
      if (!repeat) nextBtn.onclick();
    });

    // ================= RENDER LOOP =================
    engine.runRenderLoop(() => {
      if (isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
        disc.rotate(BABYLON.Axis.Y, 0.01 + avg * 0.0003, BABYLON.Space.LOCAL);
      }
      scene.render();
    });

    window.addEventListener("resize", () => engine.resize());

  }, 10);

});
