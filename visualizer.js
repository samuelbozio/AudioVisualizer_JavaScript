const audio = document.getElementById('audio');
const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');


let audioContext;
let analyser;
let source;

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {

    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        source = audioContext.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(audioContext.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        function draw() {
            requestAnimationFrame(draw);

            canvasContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);

            analyser.getByteFrequencyData(dataArray);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                const red = barHeight + 25 * (i / bufferLength);
                const green = 250 * (i / bufferLength);
                const blue = 50;

                canvasContext.fillStyle = `rgb(${red},${green},${blue})`;
                canvasContext.fillRect(x, canvas.height - barHeight * 5, barWidth, barHeight * 2);

                x += barWidth + 1;
            }
        }

        audio.onplay = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            draw();
        };

        audio.play();
    }
});
