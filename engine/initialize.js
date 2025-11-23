import { createScene } from "./scene.js";
import { initPlayer } from "./player.js";
import { initControls } from "./controls.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const scene = createScene(engine, canvas);

initPlayer(scene);
initControls(scene);

engine.runRenderLoop(() => {
    scene.render();
});
