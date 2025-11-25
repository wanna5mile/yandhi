/* DOM references */
const now_playing = document.querySelector('.now-playing');
const playpause_btn = document.querySelector('.playpause-track');
const next_btn = document.querySelector('.next-track');
const prev_btn = document.querySelector('.prev-track');
const shuffle_btn = document.querySelector('.shuffle-track');
const repeat_btn = document.querySelector('.repeat-track');

const curr_track = new Audio();

let track_index = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = off, 1 = repeat one, 2 = repeat all

/* Playlist */
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

/* Load Track */
function loadTrack(index) {
  track_index = (index + music_list.length) % music_list.length;
  curr_track.src = music_list[track_index].file;
  curr_track.load();
  now_playing.textContent = music_list[track_index].name.toUpperCase();
}

/* Play / Pause */
function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

/* Next Track */
function nextTrack() {
  if (isShuffle) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * music_list.length);
    } while (randomIndex === track_index);
    track_index = randomIndex;
  } else {
    track_index++;
  }

  loadTrack(track_index);
  playTrack();
}

/* Previous Track */
function prevTrack() {
  track_index--;
  loadTrack(track_index);
  playTrack();
}

/* Shuffle */
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffle_btn.classList.toggle('active', isShuffle);
}

/* Repeat */
function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;

  if (repeatMode === 0) repeat_btn.textContent = "Repeat Off";
  if (repeatMode === 1) repeat_btn.textContent = "Repeat One";
  if (repeatMode === 2) repeat_btn.textContent = "Repeat All";
}

/* Track End */
curr_track.addEventListener('ended', () => {
  if (repeatMode === 1) {
    playTrack();
  } else if (repeatMode === 2) {
    nextTrack();
  } else {
    pauseTrack();
  }
});

/* Event Listeners */
playpause_btn.addEventListener('click', playpauseTrack);
next_btn.addEventListener('click', nextTrack);
prev_btn.addEventListener('click', prevTrack);
shuffle_btn?.addEventListener('click', toggleShuffle);
repeat_btn?.addEventListener('click', toggleRepeat);

/* Init */
loadTrack(0);
pauseTrack();
