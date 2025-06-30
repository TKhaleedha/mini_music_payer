const songs = ['song1.mp3', 'song2.mp3', 'song3.mp3'];
const titles = ['Devara Thandavam', 'Saripodha Sanivaram', 'Night Vibes'];
const covers = ['song1.jpg', 'song2.jpg', 'song3.jpg'];

let songIndex = 0;
let isLooping = false;
let playCounts = JSON.parse(localStorage.getItem('playCounts')) || {};

const audio = document.getElementById('audio');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volUp = document.getElementById('vol-up');
const volDown = document.getElementById('vol-down');
const loopBtn = document.getElementById('loop');
const progress = document.getElementById('progress');
const progressContainer = document.querySelector('.progress-container');
const timer = document.getElementById('timer');
const songItems = document.getElementById('songItems');
const mostPlayedList = document.getElementById('mostPlayedList');

function loadSong(index) {
  title.innerText = titles[index];
  audio.src = `songs/${songs[index]}`;
  cover.src = `images/${covers[index]}`;
}

function playSong() {
  audio.play();
  playBtn.innerText = '⏸️';
  const songKey = titles[songIndex];
  playCounts[songKey] = (playCounts[songKey] || 0) + 1;
  localStorage.setItem('playCounts', JSON.stringify(playCounts));
  updateMostPlayed();
}

function pauseSong() {
  audio.pause();
  playBtn.innerText = '▶️';
}

playBtn.addEventListener('click', () => {
  audio.paused ? playSong() : pauseSong();
});

prevBtn.addEventListener('click', () => {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
});

nextBtn.addEventListener('click', () => {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songIndex);
  playSong();
});

audio.addEventListener('timeupdate', () => {
  const { duration, currentTime } = audio;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  timer.innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
});

progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

audio.addEventListener('ended', () => {
  if (!isLooping) nextBtn.click();
});

volUp.addEventListener('click', () => {
  audio.volume = Math.min(1, audio.volume + 0.1);
});

volDown.addEventListener('click', () => {
  audio.volume = Math.max(0, audio.volume - 0.1);
});

loopBtn.addEventListener('click', () => {
  isLooping = !isLooping;
  audio.loop = isLooping;
  loopBtn.innerText = isLooping ? '🔂' : '🔁';
});

function formatTime(time) {
  if (isNaN(time)) return '00:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function displayAllSongs() {
  songItems.innerHTML = '';
  titles.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = name;
    li.addEventListener('click', () => {
      songIndex = index;
      loadSong(index);
      playSong();
    });
    songItems.appendChild(li);
  });
}

function updateMostPlayed() {
  mostPlayedList.innerHTML = '';
  const sorted = Object.entries(playCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Top 3

  if (sorted.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No songs played yet.';
    mostPlayedList.appendChild(li);
    return;
  }

  sorted.forEach(([song, count]) => {
    const li = document.createElement('li');
    li.textContent = `${song} — ${count} play${count > 1 ? 's' : ''}`;
    mostPlayedList.appendChild(li);
  });
}

// Init
loadSong(songIndex);
displayAllSongs();
updateMostPlayed();
