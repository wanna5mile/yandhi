import { MusicPlayer } from "./audio/player.js";

const playlist = [
  "./assets/music/bye-bye-baby.mp3"
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

document.getElementById("playBtn").addEventListener("click", () => {
  player.togglePlay();
});

document.getElementById("nextBtn").addEventListener("click", () => {
  player.next();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  player.previous();
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  player.toggleShuffle();
});

document.getElementById("repeatBtn").addEventListener("click", () => {
  player.toggleRepeat();
});
