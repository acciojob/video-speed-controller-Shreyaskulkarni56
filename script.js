const video = document.querySelector('.flex');
const speed = document.querySelector('.speed');
const bar = document.querySelector('.speed-bar');

function handleMove(event) {
    const rect = speed.getBoundingClientRect();

    // Calculate mouse position as a percentage.
    const position = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
    );

    // Playback speed ranges from 0.4x to 4x.
    const min = 0.4;
    const max = 4;
    const playbackRate = max - position * (max - min);

    // Update the speed bar and video playback.
    bar.style.height = `${(1 - position) * 100}%`;
    bar.textContent = `${playbackRate.toFixed(1)}×`;

    video.playbackRate = playbackRate;
}

let isScrubbing = false;

speed.addEventListener('mousedown', event => {
    isScrubbing = true;
    handleMove(event);
});

document.addEventListener('mousemove', event => {
    if (isScrubbing) {
        handleMove(event);
    }
});

document.addEventListener('mouseup', () => {
    isScrubbing = false;
});