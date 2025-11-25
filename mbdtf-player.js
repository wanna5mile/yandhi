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
  { name: "Dark Fantasy", file: "" },
  { name: "Gorgeous", file: "" },
  { name: "POWER", file: "" },
  { name: "All of the lights (interlude)", file: "" },
  { name: "All of the lights (ft. Rihanna)", file: "" },
  { name: "Monster", file: "" },
  { name: "So Appalled", file: "" },
  { name: "Devil in a new dress (ft. Rick Ross)", file: "" },
  { name: "Runaway", file: "" },
  { name: "Hell of a life", file: "" },
  { name: "Blame Game", file: "" },
  { name: "Lost in the World", file: "" },
  { name: "Who will Survive in America", file: "" },
  { name: "See Me Now", file: "" },
  { name: "chain Heavy", file: "" },
  { name: "Mamma's Boyfriend", file: "" }
];

/* Load a track */
function loadTrack(index) {
  track_index = ((index % music_list.length) + music_list.length) % music_list.length; // handle negative index
  curr_track.src = music_list[track_index].file;
  curr_track.load();
  now_playing.textContent = music_list[track_index].name;
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
pauseTrack(); // set initial icon to play
