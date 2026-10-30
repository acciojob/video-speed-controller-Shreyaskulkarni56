const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const toggle = player.querySelector('.toggle');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const skipButtons = player.querySelectorAll('[data-skip]');
const sliders = player.querySelectorAll('.player__slider');

const speed = player.querySelector('.speed');
const speedBar = player.querySelector('.speed-bar');

// Play and pause
function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function updateButton() {
    toggle.textContent = video.paused ? '►' : '❚ ❚';
}

toggle.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

// Progress bar
function updateProgress() {
    if (!video.duration) return;

    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
}

function scrub(event) {
    if (!video.duration) return;

    const rect = progress.getBoundingClientRect();
    const percentage = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
    );

    video.currentTime = percentage * video.duration;
}

video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', updateProgress);

progress.addEventListener('click', scrub);

// Allow dragging the progress bar
let isScrubbing = false;

progress.addEventListener('mousedown', event => {
    isScrubbing = true;
    scrub(event);
});

document.addEventListener('mousemove', event => {
    if (isScrubbing) scrub(event);
});

document.addEventListener('mouseup', () => {
    isScrubbing = false;
});

// Rewind and fast forward
function skip() {
    video.currentTime = Math.max(
        0,
        Math.min(video.duration || 0, video.currentTime + Number(this.dataset.skip))
    );
}

skipButtons.forEach(button => {
    button.addEventListener('click', skip);
});

// Volume and playback speed sliders
function handleRangeUpdate() {
    video[this.name] = Number(this.value);
}

sliders.forEach(slider => {
    slider.addEventListener('input', handleRangeUpdate);
});

// Vertical playback speed scrubber
function handleSpeedMove(event) {
    const rect = speed.getBoundingClientRect();

    const position = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
    );

    const min = 0.4;
    const max = 4;

    const playbackRate = max - position * (max - min);

    video.playbackRate = playbackRate;
    speedBar.style.height = `${(1 - position) * 100}%`;
    speedBar.textContent = `${playbackRate.toFixed(1)}×`;

    // Keep the playback speed slider synchronized.
    const speedSlider = player.querySelector('[name="playbackRate"]');
    speedSlider.value = Math.max(
        Number(speedSlider.min),
        Math.min(Number(speedSlider.max), playbackRate)
    );
}

let isSpeedScrubbing = false;

speed.addEventListener('mousedown', event => {
    isSpeedScrubbing = true;
    handleSpeedMove(event);
});

document.addEventListener('mousemove', event => {
    if (isSpeedScrubbing) handleSpeedMove(event);
});

document.addEventListener('mouseup', () => {
    isSpeedScrubbing = false;
});

updateButton();