const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 1. Configuration: Set your paths here
const CORRECT_ANSWER = "khadaish";
const NEXT_PAGE_URL = "interrogation.html"; // Change to your destination URL

const CORRECT_GIF_URL = "correct.gif"; 
const WRONG_GIF_URL = "wrong.gif";

// 2. Element Selectors
const userInput = document.getElementById('userInput');
const submitBtn = document.getElementById('submitBtn');
const gifOverlay = document.getElementById('gifOverlay');
const statusGif = document.getElementById('statusGif');
const statusMessage = document.getElementById('statusMessage');
const correctAudio = document.getElementById('correctAudio');
const wrongAudio = document.getElementById('wrongAudio');
const moynaAudio = document.getElementById('moynaAudio');
let overlayTimeout;

function stopFeedbackAudio() {
    for (const audio of [correctAudio, wrongAudio, moynaAudio]) {
        audio.pause();
        audio.currentTime = 0;
    }
}

function playFeedbackAudio(audio) {
    audio.currentTime = 0;
    audio.play().catch((error) => {
        console.error(`Could not play ${audio.src}:`, error);
    });
}

function hideFeedback() {
    gifOverlay.style.display = "none";
    statusGif.src = "";
    statusMessage.textContent = "";
}

function showMoynaMessage() {
    statusGif.src = "uhhu.gif";
    statusMessage.textContent = "Aww moyna! But aro kichu try koro";
    overlayTimeout = window.setTimeout(hideFeedback, 3000);
}

// =========================
// CANVAS SIZE
// =========================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();


// =========================
// MATRIX CHARACTERS
// =========================

const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*/愛してます\\|';

const fontSize = 16;

let columns = Math.floor(canvas.width / fontSize);

let drops = [];


// =========================
// CREATE DROPS
// =========================

function createDrops() {

    columns = Math.floor(canvas.width / fontSize);

    drops = [];

    for (let i = 0; i < columns; i++) {

        drops[i] = Math.random() * -50;

    }
}

createDrops();


// =========================
// DRAW
// =========================

function draw() {

    /*
        IMPORTANT:

        This transparent black layer
        slowly removes old characters.
    */

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Pink Matrix characters

    ctx.fillStyle =
        'rgba(250, 160, 160, 0.94)';

    ctx.font =
        fontSize + 'px monospace';


    // =========================
    // DRAW EACH COLUMN
    // =========================

    for (let i = 0; i < drops.length; i++) {

        const text =
            chars.charAt(
                Math.floor(
                    Math.random() * chars.length
                )
            );


        ctx.fillText(
            text,
            i * fontSize,
            drops[i] * fontSize
        );


        // =========================
        // RESET DROP
        // =========================

        if (
            drops[i] * fontSize > canvas.height &&
            Math.random() > 0.975
        ) {

            drops[i] = 0;

        }


        drops[i]++;

    }

}


// =========================
// ANIMATION
// =========================

setInterval(draw, 33);


// =========================
// RESIZE
// =========================

window.addEventListener('resize', () => {

    resizeCanvas();

    createDrops();

});


// 3. Main Validation Engine
function validateInput() {
    const value = userInput.value.trim();
    window.clearTimeout(overlayTimeout);
    stopFeedbackAudio();

    if (value.toLowerCase() === "moyna") {
        statusGif.src = "uhhu.gif";
        statusMessage.textContent = "";
        gifOverlay.style.display = "flex";
        moynaAudio.addEventListener('ended', showMoynaMessage, { once: true });
        moynaAudio.play().catch((error) => {
            console.error(`Could not play ${moynaAudio.src}:`, error);
            showMoynaMessage();
        });
    } else if (value === CORRECT_ANSWER) {
        statusGif.src = CORRECT_GIF_URL;
        statusMessage.textContent = "yeee";
        gifOverlay.style.display = "flex";
        playFeedbackAudio(correctAudio);

        overlayTimeout = window.setTimeout(() => {
            stopFeedbackAudio();
            window.location.href = NEXT_PAGE_URL;
        }, 3000);

    } else {
        statusGif.src = WRONG_GIF_URL;
        statusMessage.textContent = "neh, abar try koro";
        gifOverlay.style.display = "flex";
        playFeedbackAudio(wrongAudio);

        wrongAudio.addEventListener('ended', hideFeedback, { once: true });
    }
}

// 4. Event Listeners
submitBtn.addEventListener('click', validateInput);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        validateInput();
    }
});