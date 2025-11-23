// src/audio/player.js
export class MusicPlayer {
  constructor(playlist) {
    this.audio = document.getElementById("audio");
    this.playlist = playlist;
    this.currentIndex = 0;

    this.isPlaying = false;
    this.shuffle = false;
    this.repeat = false;

    this.loadTrack(this.currentIndex);

    // Event callbacks
    this._onPlayCallbacks = [];
    this._onPauseCallbacks = [];
    this._onTrackEndCallbacks = [];
    
    this.audio.addEventListener("ended", () => {
      this._onTrackEndCallbacks.forEach(cb => cb());
    });
  }

  loadTrack(index) {
    this.currentIndex = index;
    this.audio.src = this.playlist[index];
    this.audio.load();
  }

  play() {
    this.audio.play().catch(e => console.warn("Play failed:", e));
    this.isPlaying = true;
    this._onPlayCallbacks.forEach(cb => cb());
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this._onPauseCallbacks.forEach(cb => cb());
  }

  togglePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  next() {
    if (this.shuffle) {
      this.currentIndex = Math.floor(Math.random() * this.playlist.length);
    } else {
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    }
    this.loadTrack(this.currentIndex);
    this.play();
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.loadTrack(this.currentIndex);
    this.play();
  }

  toggleShuffle() {
    this.shuffle = !this.shuffle;
  }

  toggleRepeat() {
    this.repeat = !this.repeat;
    this.audio.loop = this.repeat;
  }

  // Event registration
  onPlay(cb) { this._onPlayCallbacks.push(cb); }
  onPause(cb) { this._onPauseCallbacks.push(cb); }
  onTrackEnd(cb) { this._onTrackEndCallbacks.push(cb); }
}
