const audioInput = document.getElementById('audioInput');
const playButton = document.getElementById('playButton');
const spectrumCanvas = document.getElementById('spectrumCanvas');
const audio = new Audio();
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();

audioInput.addEventListener('change', (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        audio.src = URL.createObjectURL(selectedFile);
    }
});

playButton.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

audio.addEventListener('play', () => {
    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const ctx = spectrumCanvas.getContext('2d');
    spectrumCanvas.width = window.innerWidth;
    spectrumCanvas.height = window.innerHeight;

    function drawSpectrum() {
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);

        const barWidth = (spectrumCanvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];

            ctx.fillStyle = `rgb(${barHeight}, 50, 50)`;
            ctx.fillRect(x, spectrumCanvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }

        requestAnimationFrame(drawSpectrum);
    }

    drawSpectrum();
});

audioContext.resume();
