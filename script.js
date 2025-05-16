const keys = document.querySelectorAll('.key');
const volumeSlider = document.querySelector('.volume-slider');
let audioContext = null;
let masterGainNode = null;
const initAudio = () => {
    if (audioContext) return;

    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = volumeSlider.value;

    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
};

document.addEventListener('click', initAudio);
document.addEventListener('keydown', initAudio);

const playNote = (frequency) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.02);

    oscillator.start();

    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);

    setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
    }, 1500);

    return { oscillator, gainNode };
};

const noteFrequencies = {
    'A': 261.63,
    'W': 277.18,
    'S': 293.66,
    'E': 311.13,
    'D': 329.63,
    'F': 349.23,
    'T': 369.99,
    'G': 392.00,
    'Y': 415.30,
    'H': 440.00,
    'U': 466.16,
    'J': 493.88,
    'K': 523.25
};

const keyboardMap = {
    'a': 'A',
    'w': 'W',
    's': 'S',
    'e': 'E',
    'd': 'D',
    'f': 'F',
    't': 'T',
    'g': 'G',
    'y': 'Y',
    'h': 'H',
    'u': 'U',
    'j': 'J',
    'k': 'K'
};

const createRipple = (event, element) => {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');

    const rect = element.getBoundingClientRect();

    let x, y;
    if (event.type === 'mousedown' || event.type === 'touchstart') {
        const clientX = event.type === 'touchstart' ? event.touches[0].clientX : event.clientX;
        const clientY = event.type === 'touchstart' ? event.touches[0].clientY : event.clientY;
        x = clientX - rect.left;
        y = clientY - rect.top;
    } else {
        x = rect.width / 2;
        y = rect.height / 2;
    }

    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
};

keys.forEach(key => {
    const note = key.getAttribute('data-note');

    const pressKey = (event) => {
        event.preventDefault();
        key.classList.add('active');
        createRipple(event, key);
        playNote(noteFrequencies[note]);

        document.body.style.background = getRandomGradient();
    };

    const releaseKey = () => {
        key.classList.remove('active');
    };

    key.addEventListener('mousedown', pressKey);
    key.addEventListener('touchstart', pressKey);
    key.addEventListener('mouseup', releaseKey);
    key.addEventListener('mouseleave', releaseKey);
    key.addEventListener('touchend', releaseKey);
});

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();

    if (keyboardMap[key] && !event.repeat) {
        const note = keyboardMap[key];
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);

        if (keyElement) {
            keyElement.classList.add('active');
            createRipple(event, keyElement);
            playNote(noteFrequencies[note]);

            document.body.style.background = getRandomGradient();
        }
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();

    if (keyboardMap[key]) {
        const note = keyboardMap[key];
        const keyElement = document.querySelector(`.key[data-note="${note}"]`);

        if (keyElement) {
            keyElement.classList.remove('active');
        }
    }
});

volumeSlider.addEventListener('input', () => {
    if (masterGainNode) {
        masterGainNode.gain.value = volumeSlider.value;
    }
});

function getRandomGradient() {
    const hue1 = Math.floor(Math.random() * 60) + 170;
    const hue2 = (hue1 + Math.floor(Math.random() * 60) - 30) % 360;

    return `linear-gradient(135deg, 
        hsl(${hue1}, 40%, 70%), 
        hsl(${hue2}, 50%, 60%))`;
}

keys.forEach(key => {
    key.addEventListener('mouseover', () => {
        if (key.classList.contains('white-key')) {
            key.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.8), inset 0 -5px 10px rgba(0,0,0,0.1)';
        } else {
            key.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.8)';
        }
    });

    key.addEventListener('mouseout', () => {
        if (key.classList.contains('white-key')) {
            key.style.boxShadow = 'inset 0 -5px 10px rgba(0,0,0,0.1)';
        } else {
            key.style.boxShadow = 'none';
        }
    });
});

const title = document.querySelector('h1');
let floatDirection = 1;
let floatPosition = 0;

setInterval(() => {
    floatPosition += 0.2 * floatDirection;

    if (floatPosition > 5 || floatPosition < -5) {
        floatDirection *= -1;
    }

    title.style.transform = `translateY(${floatPosition}px)`;
}, 50);
