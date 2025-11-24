/* DOM references */
const now_playing = document.querySelector('.now-playing'); // element to show current song
const playpause_btn = document.querySelector('.playpause-track');
const next_btn = document.querySelector('.next-track');
const prev_btn = document.querySelector('.prev-track');
const curr_track = new Audio();

let track_index = 0;
let isPlaying = false;

/* Define your playlist */
const music_list = [
  { name: "bye bye baby", file: "./music/name.mp3" },
  { name: "the chakra", file: "./music/name.mp3" },
  { name: "alien", file: "./music/name.mp3" },
  { name: "new body", file: "./music/name.mp3" },
  { name: "xxx", file: "./music/name.mp3" },
  { name: "sky city", file: "./music/name.mp3" },
  { name: "brothers", file: "./music/name.mp3" },
  { name: "the garden", file: "./music/name.mp3" },
  { name: "we free", file: "./music/name.mp3" },
  { name: "we got love", file: "./music/name.mp3" },
  { name: "cash to burn", file: "./music/name.mp3" },
  { name: "hurricane", file: "./music/name.mp3" },
  { name: "law of attraction", file: "./music/name.mp3" },
  { name: "last name", file: "./music/name.mp3" },
  { name: "spread your wings", file: "./music/name.mp3" },
  { name: "end of it", file: "./music/name.mp3" }
];

/* Load a track */
function loadTrack(index) {
  track_index = index % music_list.length;
  curr_track.src = music_list[track_index].file;
  curr_track.load();
  now_playing.textContent = music_list[track_index].name;
}

/* Play / Pause */
function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.textContent = "Pause";
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.textContent = "Play";
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

/* Next / Previous */
function nextTrack() {
  loadTrack(track_index + 1);
  playTrack();
}

function prevTrack() {
  loadTrack(track_index - 1);
  playTrack();
}

/* Event listeners */
playpause_btn.addEventListener('click', playpauseTrack);
next_btn.addEventListener('click', nextTrack);
prev_btn.addEventListener('click', prevTrack);
curr_track.addEventListener('ended', nextTrack);

/* Init */
loadTrack(0);
