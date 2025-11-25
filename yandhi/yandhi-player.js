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
  { name: "bye bye baby", file: "tracks/byebyebaby.mp3" },
  { name: "the chakra", file: "tracks/name.mp3" },
  { name: "alien", file: "tracks/name.mp3" },
  { name: "new body", file: "tracks/name.mp3" },
  { name: "xxx", file: "tracks/name.mp3" },
  { name: "sky city", file: "tracks/name.mp3" },
  { name: "brothers", file: "tracks/name.mp3" },
  { name: "the garden", file: "tracks/name.mp3" },
  { name: "we free", file: "tracks/name.mp3" },
  { name: "we got love", file: "tracks/name.mp3" },
  { name: "cash to burn", file: "tracks/name.mp3" },
  { name: "hurricane", file: "tracks/name.mp3" },
  { name: "law of attraction", file: "tracks/name.mp3" },
  { name: "last name", file: "tracks/lastname.mp3" },
  { name: "spread your wings", file: "tracks/name.mp3" },
  { name: "end of it", file: "tracks/name.mp3" }
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

/* Shuffle Toggle */
function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffle_btn.classList.toggle("active", isShuffle);
}

/* Repeat Toggle */
function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;

  if (repeatMode === 0) repeat_btn.textContent = "Repeat Off";
  if (repeatMode === 1) repeat_btn.textContent = "Repeat One";
  if (repeatMode === 2) repeat_btn.textContent = "Repeat All";
}

/* Track End Behavior */
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
