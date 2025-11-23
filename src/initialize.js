import { MusicPlayer } from "./audio/player.js";

window.addEventListener("DOMContentLoaded", () => {

  const playlist = [
    "./assets/music/byebyebaby.mp3"
//  "./assets/music/the-chakra.mp3",
//  "./assets/music/alien.mp3",
//  "./assets/music/new-body.mp3",
//  "./assets/music/xxx.mp3",
//  "./assets/music/sky-city.mp3",
//  "./assets/music/brothers.mp3",
//  "./assets/music/the-garden.mp3",
//  "./assets/music/we-free.mp3",
//  "./assets/music/we-got-love.mp3",
//  "./assets/music/cash-to-burn.mp3",
//  "./assets/music/hurricane.mp3",
//  "./assets/music/law-of-attraction.mp3",
//  "./assets/music/last-name.mp3",
//  "./assets/music/spread-your-wings.mp3",
//  "./assets/music/end-of-it.mp3"
  ];

  const player = new MusicPlayer(playlist);

  const playBtn = document.getElementById("playBtn");
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const repeatBtn = document.getElementById("repeatBtn");

  const playIcon = playBtn.querySelector("i");

  // ▶️ Play / Pause
  playBtn.addEventListener("click", () => {
    player.togglePlay();

    if (player.isPlaying) {
      playIcon.classList.remove("fa-play-circle");
      playIcon.classList.add("fa-pause-circle");
    } else {
      playIcon.classList.remove("fa-pause-circle");
      playIcon.classList.add("fa-play-circle");
    }
  });

  // ⏭ Next
  nextBtn.addEventListener("click", () => {
    player.next();
  });

  // ⏮ Previous
  prevBtn.addEventListener("click", () => {
    player.previous();
  });

  // 🔀 Shuffle
  shuffleBtn.addEventListener("click", () => {
    player.toggleShuffle();
    shuffleBtn.classList.toggle("active", player.shuffle);
  });

  // 🔁 Repeat
  repeatBtn.addEventListener("click", () => {
    player.toggleRepeat();
    repeatBtn.classList.toggle("active", player.repeat);
  });

  // ▶ Auto play next when track ends (if repeat off)
  player.audio.addEventListener("ended", () => {
    if (!player.repeat) {
      player.next();
    }
  });

});
