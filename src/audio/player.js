export class MusicPlayer {
  constructor(playlist) {
    this.audio = document.getElementById("audio");
    this.playlist = playlist;
    this.currentIndex = 0;

    this.isPlaying = false;
    this.shuffle = false;
    this.repeat = false;

    this.loadTrack(this.currentIndex);
  }

  loadTrack(index) {
    this.audio.src = this.playlist[index];
  }

  play() {
    this.audio.play();
    this.isPlaying = true;
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
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
}
