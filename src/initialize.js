import { MusicPlayer } from "./audio/player.js";
import { initializeEngine } from "./engine/engine.js";

window.addEventListener("DOMContentLoaded", () => {
  const playlist = ["./assets/music/byebyebaby.mp3"];
  const player = new MusicPlayer(playlist);

  const playBtn = document.getElementById("playBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const repeatBtn = document.getElementById("repeatBtn");

  const playIcon = playBtn.querySelector("i");

  // Initialize Babylon engine
  const canvas = document.getElementById("renderCanvas");
  const { discPlane } = initializeEngine(canvas, player);

  // Play / Pause
  playBtn.addEventListener("click", () => {
    player.togglePlay();
    playIcon.classList.toggle("fa-play-circle", !player.isPlaying);
    playIcon.classList.toggle("fa-pause-circle", player.isPlaying);
  });

  nextBtn.addEventListener("click", () => player.next());
  prevBtn.addEventListener("click", () => player.previous());
  shuffleBtn.addEventListener("click", () => {
    player.toggleShuffle();
    shuffleBtn.classList.toggle("active", player.shuffle);
  });
  repeatBtn.addEventListener("click", () => {
    player.toggleRepeat();
    repeatBtn.classList.toggle("active", player.repeat);
  });

  // Auto play next track if repeat is off
  player.onTrackEnd(() => {
    if (!player.repeat) player.next();
  });
});
