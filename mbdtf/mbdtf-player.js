/* =========================
   DOM REFERENCES
========================= */
const now_playing = document.querySelector('.now-playing');
const playpause_btn = document.querySelector('.playpause-track');
const next_btn = document.querySelector('.next-track');
const prev_btn = document.querySelector('.prev-track');
const shuffle_btn = document.querySelector('.shuffle-track');
const repeat_btn = document.querySelector('.repeat-track');

const curr_track = new Audio();
curr_track.preload = "auto";

/* =========================
   STATE
========================= */
let track_index = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = off, 1 = repeat one, 2 = repeat all

/* =========================
   PLAYLIST
========================= */
const music_list = [
  { name: "Dark Fantasy", file: "tracks/darkfantasy.mp3" },
  { name: "Gorgeous", file: "tracks/gorgeous.mp3" },
  { name: "POWER", file: "tracks/power.mp3" },
  { name: "All of the Lights (Interlude)", file: "tracks/aotli.mp3" },
  { name: "All of the Lights ft. Rihanna", file: "tracks/aotl.mp3" },
  { name: "Monster", file: "tracks/monster.mp3" },
  { name: "So Appalled", file: "tracks/soappalled.mp3" },
  { name: "Devil in a New Dress ft. Rick Ross", file: "tracks/diand.mp3" },
  { name: "Runaway", file: "tracks/runaway.mp3" },
  { name: "Hell of a Life", file: "tracks/hoal.mp3" },
  { name: "Blame Game", file: "tracks/blamegame.mp3" },
  { name: "Lost in the World", file: "tracks/litw.mp3" },
  { name: "Who Will Survive in America", file: "tracks/wwsia.mp3" },
  { name: "See Me Now", file: "tracks/see-me-now.mp3" },
  { name: "Chain Heavy", file: "tracks/chain-heavy.mp3" },
  { name: "Mamma's Boyfriend", file: "tracks/mammas-boyfriend.mp3" }
];

/* =========================
   CORE FUNCTIONS
========================= */

function updateUI() {
  playpause_btn.innerHTML = isPlaying
    ? '<i class="fa fa-pause-circle fa-5x"></i>'
    : '<i class="fa fa-play-circle fa-5x"></i>';
}

function loadTrack(index) {
  track_index = (index + music_list.length) % music_list.length;
  curr_track.src = music_list[track_index].file;
  curr_track.load();
  now_playing.textContent = music_list[track_index].name.toUpperCase();
}

/* Safe track changer */
function changeTrack(index) {
  const wasPlaying = isPlaying;

  loadTrack(index);

  if (wasPlaying) {
    curr_track.addEventListener('canplay', function autoPlay() {
      curr_track.play().catch(() => {});
      curr_track.removeEventListener('canplay', autoPlay);
    });
  }
}

/* =========================
   PLAYBACK CONTROL
========================= */

function playTrack() {
  curr_track.play().catch(() => {});
}

function pauseTrack() {
  curr_track.pause();
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

/* =========================
   TRACK NAVIGATION
========================= */

function nextTrack() {
  if (isShuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * music_list.length);
    } while (randomIndex === track_index);
    changeTrack(randomIndex);
  } else {
    changeTrack(track_index + 1);
  }
}

function prevTrack() {
  changeTrack(track_index - 1);
}

/* =========================
   SHUFFLE & REPEAT
========================= */

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffle_btn.classList.toggle('active', isShuffle);
}

function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;

  repeat_btn.textContent =
    repeatMode === 0 ? "Repeat Off" :
    repeatMode === 1 ? "Repeat One" :
    "Repeat All";
}

/* =========================
   AUDIO EVENTS (TRUTH SOURCE)
========================= */

curr_track.addEventListener('play', () => {
  isPlaying = true;
  updateUI();
});

curr_track.addEventListener('pause', () => {
  isPlaying = false;
  updateUI();
});

curr_track.addEventListener('ended', () => {
  if (repeatMode === 1) {
    playTrack();
  } else if (repeatMode === 2) {
    nextTrack();
  } else {
    pauseTrack();
  }
});

/* =========================
   EVENT LISTENERS
========================= */

playpause_btn.addEventListener('click', playpauseTrack);
next_btn.addEventListener('click', nextTrack);
prev_btn.addEventListener('click', prevTrack);
shuffle_btn?.addEventListener('click', toggleShuffle);
repeat_btn?.addEventListener('click', toggleRepeat);

/* =========================
   INIT
========================= */

loadTrack(0);
updateUI();
