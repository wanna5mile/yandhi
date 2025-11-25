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
  { name: "Dark Fantasy", file: "tracks/darkfantasy.mp3" },
  { name: "Gorgeous", file: "tracks/gorgeous.mp3" },
  { name: "POWER", file: "tracks/power.mp3" },
  { name: "All of the lights (interlude)", file: "tracks/aotli.mp3" },
  { name: "All of the lights (ft. Rihanna)", file: "tracks/aotl.mp3" },
  { name: "Monster", file: "tracks/monster.mp3" },
  { name: "So Appalled", file: "tracks/soappalled.mp3" },
  { name: "Devil in a new dress (ft. Rick Ross)", file: "tracks/diand.mp3" },
  { name: "Runaway", file: "tracks/runaway.mp3" },
  { name: "Hell of a life", file: "tracks/hoal.mp3" },
  { name: "Blame Game", file: "tracks/blamegame.mp3" },
  { name: "Lost in the World", file: "tracks/litw.mp3" },
  { name: "Who will Survive in America", file: "tracks/wwsia.mp3" },
  { name: "See Me Now", file: "tracks/see-me-now.mp3" },
  { name: "chain Heavy", file: "tracks/chain-heavy.mp3" },
  { name: "Mamma's Boyfriend", file: "tracks/mammas-boyfriend.mp3" }
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
